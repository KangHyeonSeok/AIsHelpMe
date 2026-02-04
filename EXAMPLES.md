# Usage Examples & Workflow

## 🎯 Complete Workflow Example

### Scenario: Asking about JavaScript Promises

Let's walk through a complete example of using AIsHelpMe to get a consensus answer about JavaScript Promises.

---

### **Phase 1: Draft (Gemini)** 📝

**Your Prompt:**
```
Explain how JavaScript Promises work and provide best practices for error handling.
```

**Gemini's Response (Draft):**
```
JavaScript Promises are objects representing the eventual completion or failure 
of an asynchronous operation. They have three states: pending, fulfilled, and 
rejected. You can chain promises using .then() and handle errors with .catch().

Best practices:
1. Always return promises in chain
2. Use .catch() at the end of chains
3. Consider async/await for cleaner code
```

✅ **Status**: "✓ Draft captured! Now open ChatGPT tab."

---

### **Phase 2: Critique (ChatGPT)** 🔍

**Auto-Generated Prompt to ChatGPT:**
```
Please provide a constructive critique of the following response. Focus on 
accuracy, completeness, clarity, and potential improvements:

---
[Gemini's draft response here]
---

Provide your feedback in a structured format.
```

**ChatGPT's Response (Critique):**
```
STRENGTHS:
✓ Correctly identifies the three promise states
✓ Mentions promise chaining and error handling basics
✓ Suggests async/await as a modern approach

AREAS FOR IMPROVEMENT:
1. Missing explanation of Promise creation (new Promise constructor)
2. Should mention Promise.all(), Promise.race() for multiple promises
3. Error handling needs more depth:
   - Difference between .catch() and try/catch with async/await
   - Importance of handling rejection in promise chains
   - Unhandled promise rejection warnings
4. Could add example code for clarity
5. Should mention finally() method for cleanup

ACCURACY: Generally accurate but incomplete

RECOMMENDATION: Expand with Promise creation, multiple promise handling, 
more detailed error handling patterns, and practical code examples.
```

✅ **Status**: "✓ Critique captured! Return to Gemini tab."

---

### **Phase 3: Finalize (Gemini)** ✨

**Auto-Generated Prompt to Gemini:**
```
Based on the following feedback, please provide an improved and synthesized 
final answer:

**Original Response:**
[Gemini's draft]

**Feedback:**
[ChatGPT's critique]

**Please provide the final, improved response:**
```

**Gemini's Final Response (Synthesized):**
```
# JavaScript Promises: Comprehensive Guide

## What are Promises?
JavaScript Promises are objects representing the eventual completion or failure 
of an asynchronous operation. They have three states:
- **Pending**: Initial state
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

## Creating Promises
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Async operation
  if (success) {
    resolve(value);
  } else {
    reject(error);
  }
});
```

## Promise Chaining
```javascript
fetchData()
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error))
  .finally(() => cleanup());
```

## Best Practices for Error Handling

### 1. Always Handle Rejections
```javascript
// ❌ Bad: Unhandled rejection
promise.then(data => console.log(data));

// ✅ Good: With error handling
promise
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 2. Use async/await with try/catch
```javascript
async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw if needed
  } finally {
    console.log('Fetch attempt completed');
  }
}
```

### 3. Handle Multiple Promises
```javascript
// All promises must succeed
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results))
  .catch(error => console.error('One failed:', error));

// First to complete wins
Promise.race([promise1, promise2])
  .then(result => console.log('First:', result));

// All settle (success or failure)
Promise.allSettled([promise1, promise2])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.log('Failed:', result.reason);
      }
    });
  });
```

## Key Recommendations
1. Always return promises in chains to maintain the chain
2. Use `.catch()` at the end of promise chains
3. Prefer async/await for better readability
4. Use `.finally()` for cleanup operations (closing connections, etc.)
5. Handle unhandled rejections globally for production apps
6. Consider `Promise.allSettled()` when you need all results regardless of success
7. Add proper error context for debugging

## Common Pitfalls to Avoid
- ❌ Forgetting to return promises in `.then()` handlers
- ❌ Not catching errors in async functions
- ❌ Creating unnecessary promise wrappers
- ❌ Ignoring unhandled rejection warnings
```

✅ **Status**: "✅ Consensus flow complete!"

---

## 🎯 More Examples

### Example 2: Technical Comparison

**Prompt:** "What are the key differences between React and Vue?"

**Result:** You get:
1. Gemini's initial comparison
2. ChatGPT's critique on what's missing (e.g., ecosystem, learning curve, job market)
3. Gemini's enhanced comparison incorporating all feedback

### Example 3: Code Review

**Prompt:** "Review this Python function for potential issues: [code snippet]"

**Result:** You get:
1. Gemini's initial review
2. ChatGPT's critique on missed security issues or edge cases
3. Gemini's comprehensive final review with all concerns addressed

### Example 4: Explanation Request

**Prompt:** "Explain quantum computing to a 10-year-old"

**Result:** You get:
1. Gemini's initial kid-friendly explanation
2. ChatGPT's feedback on clarity and age-appropriateness
3. Gemini's refined explanation that's even clearer

---

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    START: User's Question                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: DRAFT PHASE (Gemini Tab)                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. User submits prompt to Gemini                    │    │
│  │ 2. Gemini generates initial response                │    │
│  │ 3. Script captures response → Save to GM_storage    │    │
│  │ 4. Status: "Draft captured! Open ChatGPT tab"      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: CRITIQUE PHASE (ChatGPT Tab)                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. User switches to ChatGPT tab                     │    │
│  │ 2. Script reads draft from GM_storage               │    │
│  │ 3. Auto-generates critique prompt with draft        │    │
│  │ 4. User clicks Send button                          │    │
│  │ 5. ChatGPT provides structured feedback             │    │
│  │ 6. Script captures critique → Save to GM_storage    │    │
│  │ 7. Status: "Critique captured! Return to Gemini"   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: FINALIZE PHASE (Gemini Tab)                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. User returns to Gemini tab                       │    │
│  │ 2. Script reads draft + critique from GM_storage    │    │
│  │ 3. Auto-generates synthesis prompt                  │    │
│  │ 4. User clicks Send button                          │    │
│  │ 5. Gemini produces improved final answer            │    │
│  │ 6. Script detects completion                        │    │
│  │ 7. Status: "Consensus flow complete!"              │    │
│  │ 8. Auto-cleanup storage after 5 seconds             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               COMPLETE: Enhanced Consensus Answer            │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Tips for Best Results

### 1. Start with Clear Questions
- ✅ **Good**: "Explain the differences between SQL and NoSQL databases with examples"
- ❌ **Poor**: "databases?"

### 2. Let Each AI Complete Its Response
- Don't interrupt mid-generation
- Wait for the status indicator to update
- Full responses lead to better critiques

### 3. Use for Complex Topics
Best suited for:
- Technical explanations that benefit from multiple perspectives
- Code reviews that need thorough analysis
- Comparisons requiring balanced viewpoints
- Learning new concepts where completeness matters

### 4. Review Each Phase
While the workflow is automated, you can:
- Read the draft to understand initial thoughts
- Review the critique to see what might be missing
- Compare the final answer to see the improvement

### 5. Iterate if Needed
- The final answer not satisfactory? Click "Reset" and try a more specific prompt
- You can also manually guide the critique by editing the auto-generated prompt

---

## 🎓 Learning from the Consensus

The power of this tool is in seeing how different AI models complement each other:

- **Gemini** often provides broad, comprehensive overviews
- **ChatGPT** excels at structured critique and identifying gaps
- **Synthesis** combines both strengths for a superior answer

By observing this process, you learn:
1. How to ask better questions
2. What aspects to consider when evaluating answers
3. How peer review improves quality
4. The value of multiple perspectives

---

## 🔄 When to Use AIsHelpMe

### ✅ Perfect For:
- 📚 Learning new technical concepts
- 🔍 Getting thorough explanations
- ⚖️ Comparing technologies or approaches
- 🐛 Code review with multiple perspectives
- 📝 Research requiring comprehensive coverage
- 🎯 Decisions needing balanced viewpoints

### ❌ Not Ideal For:
- ⚡ Quick, simple questions (single AI is faster)
- 🎨 Creative writing (one voice is often better)
- 🔢 Simple calculations or lookups
- ⏰ Time-sensitive queries (takes longer than single AI)

---

## 📈 Measuring the Benefit

You'll notice improvements in:
- **Completeness**: Final answers cover more aspects
- **Accuracy**: Errors caught by peer review
- **Clarity**: Explanations refined based on feedback
- **Depth**: More detailed than single-AI responses
- **Balance**: Multiple perspectives included
