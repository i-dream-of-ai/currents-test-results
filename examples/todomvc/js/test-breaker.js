/**
 * Test Breaker Script for TodoMVC
 * 
 * This script randomly introduces bugs into the TodoMVC application
 * to intentionally break Playwright tests. It modifies DOM selectors,
 * changes event handlers, breaks local storage functionality, and
 * introduces timing issues.
 */

(function() {
  // Configuration: probability of each type of bug being introduced (0-1)
  const config = {
    selectorChanges: 0.7,    // Change CSS selectors that tests rely on
    eventHandlerBreaks: 0.6, // Break event handlers
    storageIssues: 0.5,      // Break local storage functionality
    timingIssues: 0.4,       // Introduce timing issues
    randomDelay: 0.3         // Add random delays to operations
  };

  // Helper function to determine if a bug should be introduced based on probability
  function shouldIntroduceBug(probability) {
    return Math.random() < probability;
  }

  // Helper function to get a random item from an array
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Helper function to add a random delay
  function addRandomDelay(callback, minMs = 100, maxMs = 2000) {
    const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
    setTimeout(callback, delay);
  }

  // 1. Break CSS Selectors
  function breakSelectors() {
    if (!shouldIntroduceBug(config.selectorChanges)) return;
    
    console.log("🐞 Breaking CSS selectors...");
    
    const selectorsToBreak = [
      { original: '.new-todo', newClass: 'new-task-input' },
      { original: '.toggle', newClass: 'task-checkbox' },
      { original: '.destroy', newClass: 'delete-task' },
      { original: '.todo-list', newClass: 'tasks-list' },
      { original: '.clear-completed', newClass: 'remove-finished' },
      { original: '.toggle-all', newClass: 'toggle-every-task' },
      { original: '.todo-count', newClass: 'remaining-count' }
    ];
    
    // Randomly select 1-3 selectors to break
    const numToBreak = Math.floor(Math.random() * 3) + 1;
    const selectedBreaks = [];
    
    for (let i = 0; i < numToBreak; i++) {
      if (selectorsToBreak.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * selectorsToBreak.length);
      const selectorToBreak = selectorsToBreak.splice(randomIndex, 1)[0];
      selectedBreaks.push(selectorToBreak);
      
      // Find elements with the original class and change them
      document.querySelectorAll(selectorToBreak.original).forEach(element => {
        // Replace the class name
        if (element.classList.contains(selectorToBreak.original.substring(1))) {
          element.classList.remove(selectorToBreak.original.substring(1));
          element.classList.add(selectorToBreak.newClass.substring(1));
        }
        
        // If it's using the class as part of its identity, update that too
        if (element.className.includes(selectorToBreak.original.substring(1))) {
          element.className = element.className.replace(
            selectorToBreak.original.substring(1),
            selectorToBreak.newClass.substring(1)
          );
        }
      });
      
      console.log(`Changed selector ${selectorToBreak.original} to ${selectorToBreak.newClass}`);
    }
  }

  // 2. Break Event Handlers
  function breakEventHandlers() {
    if (!shouldIntroduceBug(config.eventHandlerBreaks)) return;
    
    console.log("🐞 Breaking event handlers...");
    
    const eventBreakers = [
      // Break the new todo input
      function() {
        const newTodoInput = document.querySelector('.new-todo');
        if (newTodoInput) {
          const originalKeyDown = newTodoInput.onkeydown;
          newTodoInput.onkeydown = function(event) {
            // Randomly prevent some keydown events from being processed
            if (Math.random() < 0.5) {
              console.log("Blocked keydown event on new-todo");
              event.stopPropagation();
              return false;
            }
            return originalKeyDown ? originalKeyDown.call(this, event) : true;
          };
        }
      },
      
      // Break the toggle functionality
      function() {
        document.querySelectorAll('.toggle').forEach(toggle => {
          const originalOnClick = toggle.onclick;
          toggle.onclick = function(event) {
            // Sometimes prevent the toggle from working
            if (Math.random() < 0.5) {
              console.log("Blocked toggle click event");
              event.stopPropagation();
              return false;
            }
            return originalOnClick ? originalOnClick.call(this, event) : true;
          };
        });
      },
      
      // Break the destroy button
      function() {
        document.querySelectorAll('.destroy').forEach(destroyBtn => {
          const originalOnClick = destroyBtn.onclick;
          destroyBtn.onclick = function(event) {
            // Sometimes prevent the destroy from working
            if (Math.random() < 0.5) {
              console.log("Blocked destroy click event");
              event.stopPropagation();
              return false;
            }
            return originalOnClick ? originalOnClick.call(this, event) : true;
          };
        });
      },
      
      // Break the edit functionality
      function() {
        document.querySelectorAll('.todo-list li label').forEach(label => {
          const originalDblClick = label.ondblclick;
          label.ondblclick = function(event) {
            // Sometimes prevent editing
            if (Math.random() < 0.5) {
              console.log("Blocked double-click edit event");
              event.stopPropagation();
              return false;
            }
            return originalDblClick ? originalDblClick.call(this, event) : true;
          };
        });
      }
    ];
    
    // Apply 1-2 random event breakers
    const numToApply = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numToApply; i++) {
      const breaker = getRandomItem(eventBreakers);
      breaker();
    }
  }

  // 3. Break Local Storage
  function breakLocalStorage() {
    if (!shouldIntroduceBug(config.storageIssues)) return;
    
    console.log("🐞 Breaking local storage...");
    
    const storageBreakers = [
      // Override localStorage.setItem to sometimes fail
      function() {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
          if (key.includes('todos') && Math.random() < 0.3) {
            console.log("Blocked localStorage.setItem");
            throw new Error("Storage quota exceeded"); // Simulate storage error
          }
          originalSetItem.call(this, key, value);
        };
      },
      
      // Override localStorage.getItem to sometimes return null
      function() {
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = function(key) {
          if (key.includes('todos') && Math.random() < 0.3) {
            console.log("Returning null from localStorage.getItem");
            return null;
          }
          return originalGetItem.call(this, key);
        };
      },
      
      // Corrupt the stored data
      function() {
        const todosKey = 'todos-react';
        const storedData = localStorage.getItem(todosKey);
        if (storedData) {
          try {
            const todos = JSON.parse(storedData);
            // Randomly corrupt some data
            if (todos.length > 0) {
              const randomIndex = Math.floor(Math.random() * todos.length);
              // Corrupt a random todo
              todos[randomIndex].title = todos[randomIndex].title + "_corrupted";
              // Or delete a property
              if (Math.random() < 0.5) {
                delete todos[randomIndex].completed;
              }
              localStorage.setItem(todosKey, JSON.stringify(todos));
              console.log("Corrupted localStorage data");
            }
          } catch (e) {
            console.log("Failed to corrupt localStorage data", e);
          }
        }
      }
    ];
    
    // Apply a random storage breaker
    const breaker = getRandomItem(storageBreakers);
    breaker();
  }

  // 4. Introduce Timing Issues
  function introduceTimingIssues() {
    if (!shouldIntroduceBug(config.timingIssues)) return;
    
    console.log("🐞 Introducing timing issues...");
    
    // Delay rendering updates
    const originalSetState = React.Component.prototype.setState;
    React.Component.prototype.setState = function(state, callback) {
      if (Math.random() < 0.3) {
        console.log("Delaying setState call");
        setTimeout(() => {
          originalSetState.call(this, state, callback);
        }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
      } else {
        originalSetState.call(this, state, callback);
      }
    };
  }

  // Wait for the app to be fully loaded before breaking it
  function initTestBreaker() {
    console.log("🐞 Test Breaker initialized. Preparing to break tests...");
    
    // Wait a bit to ensure the app is fully loaded
    setTimeout(() => {
      // Randomly decide which bugs to introduce
      if (shouldIntroduceBug(config.selectorChanges)) {
        breakSelectors();
      }
      
      if (shouldIntroduceBug(config.eventHandlerBreaks)) {
        breakEventHandlers();
      }
      
      if (shouldIntroduceBug(config.storageIssues)) {
        breakLocalStorage();
      }
      
      if (shouldIntroduceBug(config.timingIssues)) {
        introduceTimingIssues();
      }
      
      console.log("🐞 Test Breaker has finished introducing bugs!");
    }, 1000);
  }

  // Initialize when the window loads
  if (document.readyState === 'complete') {
    initTestBreaker();
  } else {
    window.addEventListener('load', initTestBreaker);
  }
})();