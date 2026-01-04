/**
 * APP.JS - UI Components Showcase
 * Handles theme, scroll to top, and basic UI functionality
 * Slider logic is in slider.js
 */

// ========================
// PERFORMANCE UTILITIES
// ========================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================
// THEME MANAGEMENT
// ========================

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const themeIcon = document.querySelector(".theme-icon");

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
    if (themeIcon) themeIcon.textContent = "☀️";
  } else {
    document.documentElement.classList.remove("dark");
    if (themeIcon) themeIcon.textContent = "🌙";
  }
}

/**
 * Toggle theme between dark and light modes
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Update theme icon
  const icon = document.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = isDark ? "☀️" : "🌙";
  }

  // Sync theme with all iframes on the page
  syncThemeWithAllIframes(isDark);
}

/**
 * Sync theme with all iframes on the page
 * @param {boolean} isDark - Whether dark mode is enabled
 */
function syncThemeWithAllIframes(isDark) {
  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    try {
      if (iframe.contentDocument) {
        const iframeDoc = iframe.contentDocument;
        if (isDark) {
          iframeDoc.documentElement.classList.add("dark");
        } else {
          iframeDoc.documentElement.classList.remove("dark");
        }
      }
    } catch (error) {
      // Cross-origin error, can't access iframe
      console.debug("Cannot access iframe for theme sync");
    }
  });
}

// ========================
// SCROLL TO TOP
// ========================

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) return;

  // DEBOUNCED scroll handler for better performance
  const handleScroll = debounce(() => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove("hidden");
    } else {
      scrollToTopBtn.classList.add("hidden");
    }
  }, 50); // 50ms delay - smooth but performant

  window.addEventListener("scroll", handleScroll);

  // Scroll to top on click
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
// ========================
// EXPAND TOGGLE
// ========================

/**
 * Toggle expand/collapse using CSS classes only
 */
function toggleExpand() {
  const slideContainer = document.getElementById("slideContainer");
  const expandText = document.getElementById("expandText");
  const expandToggle = document.getElementById("expandToggle");

  if (!slideContainer || !expandText) {
    console.error("Expand elements not found");
    return;
  }

  // Toggle expanded class
  const isExpanded = slideContainer.classList.toggle("expanded");

  // Update button text
  expandText.textContent = isExpanded ? "Collapse" : "Expand";

  // Update button icon
  if (expandToggle) {
    const icon = expandToggle.querySelector("i");
    if (icon) {
      icon.className = isExpanded ? "fas fa-compress-alt" : "fas fa-expand-alt";
    }
  }
}

// ========================
// KEYBOARD SHORTCUTS
// ========================

/**
 * Setup keyboard shortcuts for better UX
 */
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    // Ctrl+T / Cmd+T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault();
      toggleTheme();
    }

    // Home key to scroll to top
    if (e.key === "Home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// ========================
// OBSERVER FOR THEME CHANGES
// ========================

/**
 * Setup observer to detect theme changes and sync with iframes
 */
function setupThemeObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const isDark = document.documentElement.classList.contains("dark");
        syncThemeWithAllIframes(isDark);
      }
    });
  });

  // Observe changes on html element
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// ========================
// INITIALIZATION
// ========================

/**
 * Initialize all functionality when DOM is loaded
 */
function initApp() {
  // 1. Initialize theme
  initTheme();

  // 2. Setup theme toggle button
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // 3. Setup scroll to top
  initScrollToTop();

  // 4. Setup expand toggle
  const expandToggle = document.getElementById("expandToggle");
  if (expandToggle) {
    expandToggle.addEventListener("click", toggleExpand);
  }

  // 5. Setup theme observer for iframe sync
  setupThemeObserver();

  // 6. Setup keyboard shortcuts
  setupKeyboardShortcuts();
}

// ========================
// EXPORT FUNCTIONS FOR SLIDER.JS
// ========================

/**
 * Export theme sync function for slider.js to use
 * @param {HTMLIFrameElement} iframe - The iframe to sync theme with
 */
export function syncThemeWithIframe(iframe) {
  if (!iframe) return;

  try {
    const isDark = document.documentElement.classList.contains("dark");
    const iframeDoc = iframe.contentDocument;

    if (iframeDoc) {
      if (isDark) {
        iframeDoc.documentElement.classList.add("dark");
      } else {
        iframeDoc.documentElement.classList.remove("dark");
      }
    }
  } catch (error) {
    console.debug("Cannot sync theme with iframe");
  }
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
