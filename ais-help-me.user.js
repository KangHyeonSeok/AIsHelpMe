// ==UserScript==
// @name         AIsHelpMe - Gemini & ChatGPT Consensus Bridge
// @namespace    https://github.com/KangHyeonSeok/AIsHelpMe
// @version      1.0.1
// @description  Zero-cost consensus bridge between Gemini and ChatGPT for multi-LLM synergy
// @author       KangHyeonSeok
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      MIT
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // ========== Configuration ==========
    const CONFIG = {
        STORAGE_KEYS: {
            DRAFT: 'ais_draft',
            CRITIQUE: 'ais_critique',
            STATE: 'ais_state',
            ORIGINAL_PROMPT: 'ais_original_prompt',
            STEP: 'ais_step'
        },
        STATES: {
            IDLE: 'idle',
            WAITING_FOR_DRAFT: 'waiting_for_draft',
            WAITING_FOR_CRITIQUE: 'waiting_for_critique',
            WAITING_FOR_FINAL: 'waiting_for_final'
        },
        SELECTORS: {
            GEMINI: {
                response: '[data-response-chunk]',
                responseContainer: '.model-response-text',
                textarea: 'rich-textarea',
                sendButton: 'button[aria-label*="Send"]'
            },
            CHATGPT: {
                response: '[data-message-author-role="assistant"]',
                textarea: '#prompt-textarea',
                sendButton: 'button[data-testid="send-button"]'
            }
        },
        DELAYS: {
            RESPONSE_CHECK: 2000,
            PASTE_DELAY: 1000,
            POLLING_INTERVAL: 1000,
            WORKFLOW_TIMEOUT: 120000,
            INIT_DELAY: 2000
        },
        MIN_RESPONSE_LENGTH: 50
    };

    const STEP_LABELS = {
        IDLE: '대기 중',
        GEMINI_INPUT_WAIT: '제미나이 입력 대기중',
        GEMINI_RESPONDING: '제미나이 응답중',
        CHATGPT_INPUT_WAIT: '챗지피티 입력 대기중',
        CHATGPT_RESPONDING: '챗지피티 응답중',
        GEMINI_FINALIZING: '제미나이 정리 중'
    };

    let draftMonitorInterval = null;
    let critiqueMonitorInterval = null;
    let finalMonitorInterval = null;

    // ========== Utility Functions ==========
    function log(message, data = null) {
        const prefix = '[AIsHelpMe]';
        if (data) {
            console.log(prefix, message, data);
        } else {
            console.log(prefix, message);
        }
    }

    function getCurrentPlatform() {
        const hostname = window.location.hostname;
        const href = window.location.href;

        // Use exact hostname match or subdomain match for security
        if (hostname === 'gemini.google.com' || hostname.endsWith('.gemini.google.com') || href.includes('gemini.google.com')) {
            return 'gemini';
        }
        if (hostname === 'chatgpt.com' || hostname.endsWith('.chatgpt.com') ||
            hostname === 'chat.openai.com' || hostname.endsWith('.chat.openai.com') ||
            href.includes('chatgpt.com') || href.includes('chat.openai.com')) {
            return 'chatgpt';
        }
        return null;
    }

    // ========== Storage Functions ==========
    function setState(state) {
        GM_setValue(CONFIG.STORAGE_KEYS.STATE, state);
        log('State changed:', state);
    }

    function getState() {
        return GM_getValue(CONFIG.STORAGE_KEYS.STATE, CONFIG.STATES.IDLE);
    }

    function setDraft(content) {
        GM_setValue(CONFIG.STORAGE_KEYS.DRAFT, content);
        log('Draft saved');
    }

    function getDraft() {
        return GM_getValue(CONFIG.STORAGE_KEYS.DRAFT, null);
    }

    function setCritique(content) {
        GM_setValue(CONFIG.STORAGE_KEYS.CRITIQUE, content);
        log('Critique saved');
    }

    function getCritique() {
        return GM_getValue(CONFIG.STORAGE_KEYS.CRITIQUE, null);
    }

    function setOriginalPrompt(prompt) {
        GM_setValue(CONFIG.STORAGE_KEYS.ORIGINAL_PROMPT, prompt);
        log('Original prompt saved');
    }

    function getOriginalPrompt() {
        return GM_getValue(CONFIG.STORAGE_KEYS.ORIGINAL_PROMPT, null);
    }

    function setStep(stepText) {
        GM_setValue(CONFIG.STORAGE_KEYS.STEP, stepText);
        updateStepLabel(stepText);
        log('Step changed:', stepText);
    }

    function getStep() {
        return GM_getValue(CONFIG.STORAGE_KEYS.STEP, null);
    }

    function clearAllStorage() {
        GM_deleteValue(CONFIG.STORAGE_KEYS.DRAFT);
        GM_deleteValue(CONFIG.STORAGE_KEYS.CRITIQUE);
        GM_deleteValue(CONFIG.STORAGE_KEYS.STATE);
        GM_deleteValue(CONFIG.STORAGE_KEYS.ORIGINAL_PROMPT);
        GM_deleteValue(CONFIG.STORAGE_KEYS.STEP);
        log('Storage cleared');
    }

    // ========== UI Functions ==========
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'ais-status-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            display: none;
            max-width: 300px;
            line-height: 1.4;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    function showStatus(message, duration = 3000) {
        let indicator = document.getElementById('ais-status-indicator');
        if (!indicator) {
            indicator = createStatusIndicator();
        }
        indicator.textContent = message;
        indicator.style.display = 'block';

        if (duration > 0) {
            setTimeout(() => {
                indicator.style.display = 'none';
            }, duration);
        }
    }

    function hideStatus() {
        const indicator = document.getElementById('ais-status-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    function createControlPanel() {
        // Check if already exists
        if (document.getElementById('ais-control-panel')) {
            log('Control panel already exists');
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'ais-control-panel';
        panel.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: white !important;
            padding: 15px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            z-index: 2147483647 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            font-size: 13px !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
        `;

        const title = document.createElement('div');
        title.textContent = 'AIsHelpMe';
        title.style.cssText = `
            font-weight: 600 !important;
            margin-bottom: 10px !important;
            color: #333 !important;
            display: block !important;
        `;
        panel.appendChild(title);

        const stepLabel = document.createElement('div');
        stepLabel.id = 'ais-step-label';
        stepLabel.textContent = `Step: ${getStep() || STEP_LABELS.IDLE}`;
        stepLabel.style.cssText = `
            margin-bottom: 10px !important;
            color: #555 !important;
            font-size: 12px !important;
            display: block !important;
        `;
        panel.appendChild(stepLabel);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            margin-right: 8px !important;
            font-size: 13px !important;
            display: inline-block !important;
        `;
        startButton.onclick = () => {
            const platform = getCurrentPlatform();
            if (platform === 'gemini') {
                setState(CONFIG.STATES.WAITING_FOR_DRAFT);
                setStep(STEP_LABELS.GEMINI_INPUT_WAIT);
                showStatus('✓ Consensus flow activated! Submit your prompt to Gemini.', 5000);
            } else {
                showStatus('⚠ Please start the flow from Gemini', 3000);
            }
        };
        panel.appendChild(startButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            background: #6c757d !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            font-size: 13px !important;
            display: inline-block !important;
        `;
        resetButton.onclick = () => {
            clearAllStorage();
            setStep(STEP_LABELS.IDLE);
            showStatus('✓ Flow reset', 2000);
        };
        panel.appendChild(resetButton);

        document.body.appendChild(panel);

        // Verify it was added
        const added = document.getElementById('ais-control-panel');
        if (added) {
            log('✅ Control panel successfully added to DOM');
        } else {
            console.error('[AIsHelpMe] ❌ Failed to add control panel to DOM');
        }
    }

    function updateStepLabel(stepText) {
        const label = document.getElementById('ais-step-label');
        if (label) {
            label.textContent = `Step: ${stepText || STEP_LABELS.IDLE}`;
        }
    }

    function resolveStepFromState(state) {
        switch (state) {
            case CONFIG.STATES.WAITING_FOR_DRAFT:
                return STEP_LABELS.GEMINI_RESPONDING;
            case CONFIG.STATES.WAITING_FOR_CRITIQUE:
                return STEP_LABELS.CHATGPT_RESPONDING;
            case CONFIG.STATES.WAITING_FOR_FINAL:
                return STEP_LABELS.GEMINI_FINALIZING;
            default:
                return STEP_LABELS.IDLE;
        }
    }

    function clearMonitorInterval(intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        return null;
    }

    // ========== Content Extraction ==========
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                } else {
                    setTimeout(checkElement, CONFIG.DELAYS.POLLING_INTERVAL);
                }
            };

            checkElement();
        });
    }

    function extractGeminiResponse() {
        const containerSelectors = [
            '.model-response-text',
            '.response-container-content'
        ];

        for (const selector of containerSelectors) {
            const containers = document.querySelectorAll(selector);
            if (containers.length > 0) {
                const lastContainer = containers[containers.length - 1];
                const text = lastContainer.innerText || lastContainer.textContent;
                if (text && text.trim().length > 0) {
                    return text.trim();
                }
            }
        }

        const chunks = Array.from(document.querySelectorAll('[data-response-chunk]'));
        if (chunks.length > 0) {
            const lastChunk = chunks[chunks.length - 1];
            const container = lastChunk.closest('.response-container-content, .model-response-text, [data-response-container], [data-message-id]') || lastChunk.parentElement;
            const containerChunks = container ? container.querySelectorAll('[data-response-chunk]') : chunks;
            const text = Array.from(containerChunks)
                .map(el => (el.innerText || el.textContent || '').trim())
                .filter(Boolean)
                .join('\n')
                .trim();
            return text || null;
        }

        return null;
    }

    function extractChatGPTResponse() {
        const responses = document.querySelectorAll('[data-message-author-role="assistant"]');
        if (responses.length > 0) {
            const lastResponse = responses[responses.length - 1];
            const text = lastResponse.innerText || lastResponse.textContent;
            return text.trim();
        }
        return null;
    }

    function isGeminiGenerating() {
        const selectors = [
            'button[aria-label*="Stop"]',
            'button[aria-label*="정지"]',
            'button[aria-label*="중지"]',
            'button[aria-label*="취소"]'
        ];
        return selectors.some(selector => document.querySelector(selector));
    }

    function isChatGPTGenerating() {
        const selectors = [
            'button[data-testid="stop-button"]',
            'button[aria-label*="Stop"]',
            'button[aria-label*="정지"]',
            'button[aria-label*="중지"]'
        ];
        return selectors.some(selector => document.querySelector(selector));
    }

    // ========== Text Insertion ==========
    function insertTextIntoGemini(text) {
        log('Inserting text into Gemini');

        // Find the textarea element
        const richTextarea = document.querySelector('rich-textarea');
        if (!richTextarea) {
            log('Could not find Gemini textarea');
            return false;
        }

        // Find the actual editable element inside rich-textarea
        const editableDiv = richTextarea.querySelector('.ql-editor, [contenteditable="true"]');
        if (!editableDiv) {
            log('Could not find editable element in Gemini');
            return false;
        }

        // Set the text
        editableDiv.innerHTML = '';
        editableDiv.textContent = text;

        // Trigger input events
        editableDiv.dispatchEvent(new Event('input', { bubbles: true }));
        editableDiv.dispatchEvent(new Event('change', { bubbles: true }));

        log('Text inserted into Gemini');
        return true;
    }

    function insertTextIntoChatGPT(text) {
        log('Inserting text into ChatGPT');

        // Try multiple selectors
        const selectors = [
            '#prompt-textarea',
            'textarea[placeholder*="Message"]',
            'textarea',
            '[contenteditable="true"]'
        ];

        let textarea = null;
        for (const selector of selectors) {
            textarea = document.querySelector(selector);
            if (textarea) {
                log(`✓ Found textarea with selector: ${selector}`);
                break;
            }
        }

        if (!textarea) {
            log('❌ Could not find ChatGPT textarea with any selector');
            console.error('[AIsHelpMe] Available textareas:', document.querySelectorAll('textarea'));
            console.error('[AIsHelpMe] Available contenteditable:', document.querySelectorAll('[contenteditable="true"]'));
            showStatus('⚠ Could not find input field. Please paste manually.', 5000);
            return false;
        }

        // Set the value
        if (textarea.tagName === 'TEXTAREA') {
            textarea.value = text;
        } else {
            // For contenteditable elements
            textarea.textContent = text;
        }
        textarea.focus();

        // Trigger multiple events to ensure the UI updates
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
        textarea.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));

        log('✓ Text inserted into ChatGPT');
        return true;
    }

    // ========== Button Click Functions ==========
    function clickGeminiSendButton() {
        log('Attempting to click Gemini send button');

        const selectors = [
            'button[aria-label*="Send"]',
            'button[aria-label*="보내기"]',
            'button.send-button',
            'button[type="submit"]'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                log(`✓ Found send button with selector: ${selector}`);
                setTimeout(() => {
                    button.click();
                    log('✓ Gemini send button clicked');
                }, 500);
                return true;
            }
        }

        log('❌ Could not find enabled Gemini send button');
        return false;
    }

    function clickChatGPTSendButton() {
        log('Attempting to click ChatGPT send button');

        const selectors = [
            'button[data-testid="send-button"]',
            'button[aria-label*="Send"]',
            'button.send-button',
            'button[type="submit"]'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                log(`✓ Found send button with selector: ${selector}`);
                setTimeout(() => {
                    button.click();
                    log('✓ ChatGPT send button clicked');
                }, 500);
                return true;
            }
        }

        log('❌ Could not find enabled ChatGPT send button');
        return false;
    }

    // ========== Main Workflow Functions ==========

    // Step 1: Extract Draft from Gemini
    function handleGeminiDraft() {
        const state = getState();
        if (state !== CONFIG.STATES.WAITING_FOR_DRAFT) return;
        if (draftMonitorInterval) return;

        log('Monitoring for Gemini draft response...');
        showStatus('⏳ Waiting for Gemini response...', 0);
        setStep(STEP_LABELS.GEMINI_RESPONDING);

        // Start monitoring immediately
        monitorGeminiDraftResponse();
    }

    function monitorGeminiDraftResponse() {
        if (draftMonitorInterval) return;
        let lastText = '';
        let lastChangeAt = Date.now();
        const stableDurationMs = 4000;

        draftMonitorInterval = setInterval(() => {
            const currentState = getState();
            if (currentState !== CONFIG.STATES.WAITING_FOR_DRAFT) {
                draftMonitorInterval = clearMonitorInterval(draftMonitorInterval);
                return;
            }

            const response = extractGeminiResponse();

            if (response && response.length > CONFIG.MIN_RESPONSE_LENGTH) {
                if (response !== lastText) {
                    lastText = response;
                    lastChangeAt = Date.now();
                    log(`Draft in progress: ${response.length} chars`);
                    return;
                }

                if (!isGeminiGenerating() && Date.now() - lastChangeAt >= stableDurationMs) {
                    log('✓ Draft complete, capturing');
                    setDraft(response);
                    setState(CONFIG.STATES.WAITING_FOR_CRITIQUE);
                    setStep(STEP_LABELS.CHATGPT_INPUT_WAIT);
                    draftMonitorInterval = clearMonitorInterval(draftMonitorInterval);
                    showStatus('✓ Draft captured! Now open ChatGPT tab.', 0);
                }
            }
        }, CONFIG.DELAYS.POLLING_INTERVAL);

        // Clear interval after timeout
        setTimeout(() => {
            draftMonitorInterval = clearMonitorInterval(draftMonitorInterval);
        }, CONFIG.DELAYS.WORKFLOW_TIMEOUT);
    }

    // Step 2: Send Draft to ChatGPT for Critique
    function handleChatGPTCritique() {
        const state = getState();
        if (state !== CONFIG.STATES.WAITING_FOR_CRITIQUE) return;

        const draft = getDraft();
        if (!draft) {
            log('No draft found in storage');
            return;
        }

        log('Preparing to send draft to ChatGPT for critique');
        showStatus('📝 Preparing critique request...', 3000);
        setStep(STEP_LABELS.CHATGPT_INPUT_WAIT);

        setTimeout(() => {
            const critiquePrompt = `Please provide a constructive critique of the following response. Focus on accuracy, completeness, clarity, and potential improvements:\n\n---\n${draft}\n---\n\nProvide your feedback in a structured format.`;

            const success = insertTextIntoChatGPT(critiquePrompt);
            if (success) {
                showStatus('✓ Critique request ready! Auto-sending...', 2000);

                // Auto-click send button
                setTimeout(() => {
                    if (clickChatGPTSendButton()) {
                        showStatus('⏳ Waiting for ChatGPT response...', 0);
                        setStep(STEP_LABELS.CHATGPT_RESPONDING);
                        monitorChatGPTResponse();
                    } else {
                        showStatus('⚠️ Could not click Send. Please click manually.', 0);
                        setStep(STEP_LABELS.CHATGPT_RESPONDING);
                        // Fallback: still monitor for response
                        monitorChatGPTResponse();
                    }
                }, 1500);
            }
        }, CONFIG.DELAYS.PASTE_DELAY);
    }

    function monitorChatGPTResponse() {
        if (critiqueMonitorInterval) return;
        let lastText = '';
        let lastChangeAt = Date.now();
        const stableDurationMs = 4000;

        critiqueMonitorInterval = setInterval(() => {
            const currentState = getState();
            if (currentState !== CONFIG.STATES.WAITING_FOR_CRITIQUE) {
                critiqueMonitorInterval = clearMonitorInterval(critiqueMonitorInterval);
                return;
            }

            const response = extractChatGPTResponse();

            if (response && response.length > CONFIG.MIN_RESPONSE_LENGTH) {
                if (response !== lastText) {
                    lastText = response;
                    lastChangeAt = Date.now();
                    log(`Response in progress: ${response.length} chars`);
                    return;
                }

                if (!isChatGPTGenerating() && Date.now() - lastChangeAt >= stableDurationMs) {
                    log('✓ Response complete, capturing critique');
                    setCritique(response);
                    setState(CONFIG.STATES.WAITING_FOR_FINAL);
                    setStep(STEP_LABELS.GEMINI_FINALIZING);
                    critiqueMonitorInterval = clearMonitorInterval(critiqueMonitorInterval);
                    showStatus('✓ Critique captured! Return to Gemini tab.', 0);
                }
            }
        }, CONFIG.DELAYS.POLLING_INTERVAL);

        // Clear interval after timeout
        setTimeout(() => {
            critiqueMonitorInterval = clearMonitorInterval(critiqueMonitorInterval);
        }, CONFIG.DELAYS.WORKFLOW_TIMEOUT);
    }

    // Step 3: Send Critique back to Gemini for Final Answer
    function handleGeminiFinal() {
        const state = getState();
        if (state !== CONFIG.STATES.WAITING_FOR_FINAL) return;

        const draft = getDraft();
        const critique = getCritique();

        if (!draft || !critique) {
            log('Missing draft or critique');
            return;
        }

        log('Preparing final synthesis in Gemini');
        showStatus('🔄 Preparing final synthesis...', 3000);
        setStep(STEP_LABELS.GEMINI_FINALIZING);

        setTimeout(() => {
            const finalPrompt = `Based on the following feedback, please provide an improved and synthesized final answer:\n\n**Original Response:**\n${draft}\n\n**Feedback:**\n${critique}\n\n**Please provide the final, improved response:**`;

            const success = insertTextIntoGemini(finalPrompt);
            if (success) {
                showStatus('✓ Final synthesis ready! Auto-sending...', 2000);

                // Auto-click send button
                setTimeout(() => {
                    if (clickGeminiSendButton()) {
                        showStatus('⏳ Waiting for final response...', 0);
                        setStep(STEP_LABELS.GEMINI_FINALIZING);
                        monitorGeminiFinalResponse();
                    } else {
                        showStatus('⚠️ Could not click Send. Please click manually.', 0);
                        setStep(STEP_LABELS.GEMINI_FINALIZING);
                        // Fallback: still monitor for response
                        monitorGeminiFinalResponse();
                    }
                }, 1500);
            }
        }, CONFIG.DELAYS.PASTE_DELAY);
    }

    function monitorGeminiFinalResponse() {
        if (finalMonitorInterval) return;
        const draftResponse = getDraft();
        let lastText = '';
        let lastChangeAt = Date.now();
        const stableDurationMs = 4000;

        finalMonitorInterval = setInterval(() => {
            const currentState = getState();
            if (currentState !== CONFIG.STATES.WAITING_FOR_FINAL) {
                finalMonitorInterval = clearMonitorInterval(finalMonitorInterval);
                return;
            }

            const response = extractGeminiResponse();

            if (response && response.length > CONFIG.MIN_RESPONSE_LENGTH && response !== draftResponse) {
                if (response !== lastText) {
                    lastText = response;
                    lastChangeAt = Date.now();
                    log(`Final response in progress: ${response.length} chars`);
                    return;
                }

                if (!isGeminiGenerating() && Date.now() - lastChangeAt >= stableDurationMs) {
                    log('✓ Final response complete');
                    finalMonitorInterval = clearMonitorInterval(finalMonitorInterval);
                    setState(CONFIG.STATES.IDLE);
                    setStep(STEP_LABELS.IDLE);
                    showStatus('✅ Consensus flow complete!', 5000);
                    setTimeout(() => {
                        clearAllStorage();
                    }, 5000);
                }
            }
        }, CONFIG.DELAYS.POLLING_INTERVAL);

        // Clear interval after timeout
        setTimeout(() => {
            finalMonitorInterval = clearMonitorInterval(finalMonitorInterval);
        }, CONFIG.DELAYS.WORKFLOW_TIMEOUT);
    }

    // ========== Event Listeners ==========
    function setupGeminiListeners() {
        log('Setting up Gemini listeners');

        // Listen for state changes (both local and remote)
        GM_addValueChangeListener(CONFIG.STORAGE_KEYS.STATE, (name, oldValue, newValue, remote) => {
            log('State changed:', { newValue, remote, source: remote ? 'remote' : 'local' });

            if (newValue === CONFIG.STATES.WAITING_FOR_FINAL) {
                log('Triggering Gemini final handler');
                handleGeminiFinal();
            } else if (newValue === CONFIG.STATES.WAITING_FOR_DRAFT) {
                log('Triggering Gemini draft handler');
                handleGeminiDraft();
            } else if (newValue === CONFIG.STATES.IDLE) {
                setStep(STEP_LABELS.IDLE);
                draftMonitorInterval = clearMonitorInterval(draftMonitorInterval);
                finalMonitorInterval = clearMonitorInterval(finalMonitorInterval);
            }
        });

        // Avoid aggressive mutation observers to reduce page load
    }

    function setupChatGPTListeners() {
        log('Setting up ChatGPT listeners');

        // Listen for state changes (both local and remote)
        GM_addValueChangeListener(CONFIG.STORAGE_KEYS.STATE, (name, oldValue, newValue, remote) => {
            log('State changed:', { newValue, remote, source: remote ? 'remote' : 'local' });

            if (newValue === CONFIG.STATES.WAITING_FOR_CRITIQUE) {
                log('Triggering ChatGPT critique handler');
                handleChatGPTCritique();
            } else if (newValue === CONFIG.STATES.IDLE) {
                setStep(STEP_LABELS.IDLE);
                critiqueMonitorInterval = clearMonitorInterval(critiqueMonitorInterval);
            }
        });
    }

    // ========== Initialization ==========
    // ========== Initialization ==========
    async function init() {
        const platform = getCurrentPlatform();
        log('Initializing on platform:', platform);
        log('Current URL:', window.location.href);

        if (!platform) {
            log('❌ Not on a supported platform');
            console.error('[AIsHelpMe] Platform detection failed. Current hostname:', window.location.hostname);
            return;
        }

        try {
            // Wait for body to be ready
            await waitForElement('body', 10000);
            log('✓ Document body ready');

            // Create UI with a slight delay to ensure other frameworks are loaded
            setTimeout(() => {
                createControlPanel();
                log('✓ Control panel initialization triggered');
                const storedStep = getStep();
                if (storedStep) {
                    updateStepLabel(storedStep);
                } else {
                    const currentState = getState();
                    updateStepLabel(resolveStepFromState(currentState));
                }
            }, 1000);

            GM_addValueChangeListener(CONFIG.STORAGE_KEYS.STEP, (name, oldValue, newValue) => {
                updateStepLabel(newValue);
            });

            if (platform === 'gemini') {
                setupGeminiListeners();

                const state = getState();
                if (state === CONFIG.STATES.WAITING_FOR_FINAL) {
                    showStatus('💡 Awaiting final synthesis...', 0);
                    handleGeminiFinal();
                } else if (state === CONFIG.STATES.WAITING_FOR_DRAFT) {
                    showStatus('👂 Listening for draft response...', 0);
                    setStep(STEP_LABELS.GEMINI_RESPONDING);
                }
            } else if (platform === 'chatgpt') {
                setupChatGPTListeners();

                const state = getState();
                if (state === CONFIG.STATES.WAITING_FOR_CRITIQUE) {
                    showStatus('💡 Ready to send for critique...', 0);
                    handleChatGPTCritique();
                }
            }

            log('Initialization complete');
        } catch (error) {
            console.error('[AIsHelpMe] Initialization failed:', error);
            // Retry after 5 seconds
            setTimeout(init, 5000);
        }
    }

    // Expose debug object
    window.AIsHelpMe = {
        version: '1.0.4',
        getState: () => {
            return {
                currentState: getState(),
                platform: getCurrentPlatform(),
                draft: getDraftLength(getDraft()),
                critique: getDraftLength(getCritique()),
                panelExists: !!document.getElementById('ais-control-panel')
            };
        },
        forceShowPanel: () => {
            const panel = document.getElementById('ais-control-panel');
            if (panel) {
                panel.style.display = 'block';
                log('Panel visibility forced');
            } else {
                createControlPanel();
            }
        },
        reset: () => {
            clearAllStorage();
            location.reload();
        },
        // ChatGPT specific debug methods
        triggerChatGPTCritique: () => {
            log('Manually triggering ChatGPT critique');
            handleChatGPTCritique();
        },
        checkChatGPTTextarea: () => {
            const selectors = ['#prompt-textarea', 'textarea', '[contenteditable="true"]'];
            console.log('[AIsHelpMe] Checking ChatGPT textareas:');
            selectors.forEach(sel => {
                const el = document.querySelector(sel);
                console.log(`  Selector: ${sel}`, el);
            });
        },
        // Send button test methods
        testGeminiSendButton: () => {
            console.log('[AIsHelpMe] Testing Gemini send button...');
            return clickGeminiSendButton();
        },
        testChatGPTSendButton: () => {
            console.log('[AIsHelpMe] Testing ChatGPT send button...');
            return clickChatGPTSendButton();
        }
    };

    function getDraftLength(text) {
        return text ? text.length + ' chars' : 'null';
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
