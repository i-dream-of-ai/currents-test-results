/**
 * Test Breaker Loader
 * 
 * This script dynamically loads the test-breaker.js file when activated.
 * It can be included in the HTML and controlled via URL parameters or
 * localStorage settings.
 */

(function() {
  // Check if we should activate the test breaker
  function shouldActivateTestBreaker() {
    // Check URL parameter: ?break-tests=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('break-tests') === 'true') {
      return true;
    }
    
    // Check localStorage setting
    if (localStorage.getItem('activate-test-breaker') === 'true') {
      return true;
    }
    
    return false;
  }
  
  // Load the test breaker script
  function loadTestBreaker() {
    console.log('🐞 Loading Test Breaker script...');
    const script = document.createElement('script');
    script.src = 'js/test-breaker.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  // Initialize the loader
  function init() {
    if (shouldActivateTestBreaker()) {
      loadTestBreaker();
    }
  }
  
  // Run initialization when the page loads
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
  
  // Expose API for programmatic control
  window.TestBreakerLoader = {
    activate: function() {
      localStorage.setItem('activate-test-breaker', 'true');
      loadTestBreaker();
    },
    deactivate: function() {
      localStorage.setItem('activate-test-breaker', 'false');
      console.log('🐞 Test Breaker deactivated. Reload the page for this to take effect.');
    }
  };
})();