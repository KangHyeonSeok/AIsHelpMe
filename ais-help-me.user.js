// ==UserScript==
// @name         AIsHelpMe - Gemini & ChatGPT Consensus Bridge
// @namespace    https://github.com/KangHyeonSeok/AIsHelpMe
// @version      1.0.0
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

(function() {
    'use strict';

    // ========== Configuration ==========
    const CONFIG = {
        STORAGE_KEYS: {
            DRAFT: 'ais_draft',
            CRITIQUE: 'ais_critique',
            STATE: 'ais_state',
            ORIGINAL_PROMPT: 'ais_original_prompt'
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
            POLLING_INTERVAL: 1000
        }
    };

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
        if (hostname.includes('gemini.google.com')) return 'gemini';
        if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) return 'chatgpt';
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

    function clearAllStorage() {
        GM_deleteValue(CONFIG.STORAGE_KEYS.DRAFT);
        GM_deleteValue(CONFIG.STORAGE_KEYS.CRITIQUE);
        GM_deleteValue(CONFIG.STORAGE_KEYS.STATE);
        GM_deleteValue(CONFIG.STORAGE_KEYS.ORIGINAL_PROMPT);
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
        const panel = document.createElement('div');
        panel.id = 'ais-control-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
        `;

        const title = document.createElement('div');
        title.textContent = 'AIsHelpMe Control';
        title.style.cssText = `
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        `;
        panel.appendChild(title);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Consensus Flow';
        startButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            margin-right: 8px;
            font-size: 13px;
        `;
        startButton.onclick = () => {
            const platform = getCurrentPlatform();
            if (platform === 'gemini') {
                setState(CONFIG.STATES.WAITING_FOR_DRAFT);
                showStatus('✓ Consensus flow activated! Submit your prompt to Gemini.', 5000);
            } else {
                showStatus('⚠ Please start the flow from Gemini', 3000);
            }
        };
        panel.appendChild(startButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 13px;
        `;
        resetButton.onclick = () => {
            clearAllStorage();
            showStatus('✓ Flow reset', 2000);
        };
        panel.appendChild(resetButton);

        document.body.appendChild(panel);
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
        // Try multiple selectors to find the response
        const selectors = [
            '.model-response-text',
            '[data-response-chunk]',
            '.response-container-content'
        ];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                const lastElement = elements[elements.length - 1];
                const text = lastElement.innerText || lastElement.textContent;
                if (text && text.trim().length > 0) {
                    return text.trim();
                }
            }
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
        
        // Find the textarea
        const textarea = document.querySelector('#prompt-textarea');
        if (!textarea) {
            log('Could not find ChatGPT textarea');
            return false;
        }
        
        // Set the value
        textarea.value = text;
        
        // Trigger input events to enable send button
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        
        log('Text inserted into ChatGPT');
        return true;
    }

    // ========== Main Workflow Functions ==========
    
    // Step 1: Extract Draft from Gemini
    function handleGeminiDraft() {
        const state = getState();
        if (state !== CONFIG.STATES.WAITING_FOR_DRAFT) return;
        
        log('Checking for Gemini draft response');
        
        // Wait for response to appear
        setTimeout(() => {
            const response = extractGeminiResponse();
            if (response && response.length > 50) {
                log('Draft extracted from Gemini');
                setDraft(response);
                setState(CONFIG.STATES.WAITING_FOR_CRITIQUE);
                showStatus('✓ Draft captured! Now open ChatGPT tab.', 0);
            }
        }, CONFIG.DELAYS.RESPONSE_CHECK);
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
        
        setTimeout(() => {
            const critiquePrompt = `Please provide a constructive critique of the following response. Focus on accuracy, completeness, clarity, and potential improvements:\n\n---\n${draft}\n---\n\nProvide your feedback in a structured format.`;
            
            const success = insertTextIntoChatGPT(critiquePrompt);
            if (success) {
                showStatus('✓ Critique request ready! Click Send button.', 0);
                
                // Monitor for ChatGPT response
                const checkInterval = setInterval(() => {
                    const currentState = getState();
                    if (currentState !== CONFIG.STATES.WAITING_FOR_CRITIQUE) {
                        clearInterval(checkInterval);
                        return;
                    }
                    
                    const response = extractChatGPTResponse();
                    if (response && response.length > 50) {
                        log('Critique extracted from ChatGPT');
                        setCritique(response);
                        setState(CONFIG.STATES.WAITING_FOR_FINAL);
                        clearInterval(checkInterval);
                        showStatus('✓ Critique captured! Return to Gemini tab.', 0);
                    }
                }, CONFIG.DELAYS.POLLING_INTERVAL);
                
                // Clear interval after 2 minutes
                setTimeout(() => clearInterval(checkInterval), 120000);
            }
        }, CONFIG.DELAYS.PASTE_DELAY);
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
        
        setTimeout(() => {
            const finalPrompt = `Based on the following feedback, please provide an improved and synthesized final answer:\n\n**Original Response:**\n${draft}\n\n**Feedback:**\n${critique}\n\n**Please provide the final, improved response:**`;
            
            const success = insertTextIntoGemini(finalPrompt);
            if (success) {
                showStatus('✓ Final synthesis request ready! Click Send.', 0);
                
                // Monitor for final response
                const checkInterval = setInterval(() => {
                    const currentState = getState();
                    if (currentState !== CONFIG.STATES.WAITING_FOR_FINAL) {
                        clearInterval(checkInterval);
                        return;
                    }
                    
                    const response = extractGeminiResponse();
                    if (response && response.length > 50 && response !== draft) {
                        log('Final answer received from Gemini');
                        clearInterval(checkInterval);
                        setState(CONFIG.STATES.IDLE);
                        showStatus('✅ Consensus flow complete!', 5000);
                        setTimeout(() => {
                            clearAllStorage();
                        }, 5000);
                    }
                }, CONFIG.DELAYS.POLLING_INTERVAL);
                
                // Clear interval after 2 minutes
                setTimeout(() => clearInterval(checkInterval), 120000);
            }
        }, CONFIG.DELAYS.PASTE_DELAY);
    }

    // ========== Event Listeners ==========
    function setupGeminiListeners() {
        log('Setting up Gemini listeners');
        
        // Listen for state changes
        GM_addValueChangeListener(CONFIG.STORAGE_KEYS.STATE, (name, oldValue, newValue, remote) => {
            if (remote) {
                log('State changed remotely:', newValue);
                
                if (newValue === CONFIG.STATES.WAITING_FOR_FINAL) {
                    handleGeminiFinal();
                }
            }
        });
        
        // Monitor for form submissions
        const observer = new MutationObserver((mutations) => {
            const state = getState();
            if (state === CONFIG.STATES.WAITING_FOR_DRAFT) {
                handleGeminiDraft();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function setupChatGPTListeners() {
        log('Setting up ChatGPT listeners');
        
        // Listen for state changes
        GM_addValueChangeListener(CONFIG.STORAGE_KEYS.STATE, (name, oldValue, newValue, remote) => {
            if (remote) {
                log('State changed remotely:', newValue);
                
                if (newValue === CONFIG.STATES.WAITING_FOR_CRITIQUE) {
                    handleChatGPTCritique();
                }
            }
        });
    }

    // ========== Initialization ==========
    function init() {
        const platform = getCurrentPlatform();
        log('Initializing on platform:', platform);
        
        if (!platform) {
            log('Not on a supported platform');
            return;
        }
        
        // Wait for page to be fully loaded
        setTimeout(() => {
            createControlPanel();
            
            if (platform === 'gemini') {
                setupGeminiListeners();
                
                const state = getState();
                if (state === CONFIG.STATES.WAITING_FOR_FINAL) {
                    showStatus('💡 Awaiting final synthesis...', 0);
                    handleGeminiFinal();
                } else if (state === CONFIG.STATES.WAITING_FOR_DRAFT) {
                    showStatus('👂 Listening for draft response...', 0);
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
        }, 2000);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
