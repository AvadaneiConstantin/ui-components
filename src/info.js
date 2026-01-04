/**
 * INFO.JS - Dynamic Component Loading and Management
 * Handles loading of info and screenshots components on demand
 */

class AboutComponents {
  constructor() {
    this.init();
  }

  /**
   * Initialize the component manager
   * Sets up DOM references and event listeners
   */
  init() {
    // Cache DOM elements for performance
    this.elements = {
      showMoreInfo: document.getElementById("showMoreInfo"),
      screenshotsBtn: document.getElementById("screenshotsBtn"),
      dynamicContentContainer: document.getElementById(
        "dynamicContentContainer"
      ),
    };

    // Component loading state tracking
    this.isInfoLoaded = false;
    this.isScreenshotsLoaded = false;
    this.currentVisibleComponent = null;

    // Setup user interactions
    this.setupEventListeners();

    // Load component statistics (non-blocking)
    this.loadComponentStats();
  }

  /**
   * Set up all event listeners for user interactions
   */
  setupEventListeners() {
    // More Info button - loads component on first click, toggles visibility thereafter
    if (this.elements.showMoreInfo) {
      this.elements.showMoreInfo.addEventListener("click", () => {
        this.toggleComponent("moreInfo", "components/appComponents/info.html");
      });
    }

    // Screenshots button - same lazy-loading behavior
    if (this.elements.screenshotsBtn) {
      this.elements.screenshotsBtn.addEventListener("click", () => {
        this.toggleComponent(
          "screenshotsContainer",
          "components/appComponents/screenshots.html"
        );
      });
    }

    // Escape key support for closing open components
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.currentVisibleComponent) {
        this.hideCurrentComponent();
      }
    });
  }

  /**
   * Toggle component visibility with lazy loading
   * @param {string} componentId - DOM ID of the component
   * @param {string} componentPath - Path to HTML file
   */
  async toggleComponent(componentId, componentPath) {
    // Hide if same component is already visible
    if (this.currentVisibleComponent === componentId) {
      this.hideComponent(componentId);
      return;
    }

    // Hide currently visible component (only one visible at a time)
    if (this.currentVisibleComponent) {
      this.hideComponent(this.currentVisibleComponent);
    }

    // Check if component is already in DOM (cached)
    let componentElement = document.getElementById(componentId);

    // Lazy load component if not cached
    if (!componentElement) {
      componentElement = await this.loadComponent(componentPath, componentId);
      if (!componentElement) return; // Exit if loading failed
    }

    // Show component and update UI state
    componentElement.classList.remove("hidden");
    this.currentVisibleComponent = componentId;
    this.updateButtonText(componentId, true);

    // Smooth scroll to component with slight delay for render
    setTimeout(() => {
      componentElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  /**
   * Load HTML component from external file
   * @param {string} componentPath - Path to HTML file
   * @param {string} componentId - Expected DOM ID in loaded HTML
   * @returns {HTMLElement|null} - Loaded component element or null on failure
   */
  async loadComponent(componentPath, componentId) {
    try {
      const response = await fetch(componentPath);

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to load ${componentPath}`
        );
      }

      const html = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Extract target component from loaded HTML
      const componentElement = tempDiv.querySelector(`#${componentId}`);

      if (!componentElement) {
        throw new Error(
          `Component #${componentId} not found in ${componentPath}`
        );
      }

      // Add to DOM container
      this.elements.dynamicContentContainer.appendChild(componentElement);

      // Update loading state
      if (componentId === "moreInfo") {
        this.isInfoLoaded = true;
      } else if (componentId === "screenshotsContainer") {
        this.isScreenshotsLoaded = true;
      }

      return componentElement;
    } catch (error) {
      console.error("Component loading error:", error);

      // User-friendly error display
      const errorDiv = document.createElement("div");
      errorDiv.id = componentId;
      errorDiv.className = "bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4";
      errorDiv.innerHTML = `
        <p class="text-red-800 dark:text-red-200">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Failed to load component. Please try again.
        </p>
      `;

      this.elements.dynamicContentContainer.appendChild(errorDiv);
      return errorDiv;
    }
  }

  /**
   * Hide specific component
   * @param {string} componentId - ID of component to hide
   */
  hideComponent(componentId) {
    const element = document.getElementById(componentId);
    if (element) {
      element.classList.add("hidden");
    }

    this.currentVisibleComponent = null;
    this.updateButtonText(componentId, false);
  }

  /**
   * Hide currently visible component
   */
  hideCurrentComponent() {
    if (this.currentVisibleComponent) {
      this.hideComponent(this.currentVisibleComponent);
    }
  }

  /**
   * Update button text and styling based on component state
   * @param {string} componentId - Which component is being toggled
   * @param {boolean} isShowing - Whether component is now visible
   */
  updateButtonText(componentId, isShowing) {
    if (componentId === "moreInfo") {
      this.elements.showMoreInfo.innerHTML = isShowing
        ? '<i class="fas fa-chevron-up mr-2"></i>Show Less Info'
        : '<i class="fas fa-info-circle mr-2"></i>Show More Info';

      this.elements.showMoreInfo.classList.toggle("bg-sky-700", isShowing);
    } else if (componentId === "screenshotsContainer") {
      this.elements.screenshotsBtn.innerHTML = isShowing
        ? '<i class="fas fa-times mr-2"></i>Hide Screenshots'
        : '<i class="fas fa-images mr-2"></i>See Screenshots';

      this.elements.screenshotsBtn.classList.toggle("bg-purple-700", isShowing);
    }
  }

  /**
   * Load and display component statistics
   * Called after initial page load to populate stats
   */
  loadComponentStats() {
    setTimeout(() => {
      // Clean up any existing stats to avoid duplicates
      const existingStats = document.getElementById("dynamicComponentStats");
      if (existingStats) {
        existingStats.remove();
      }

      // Create stats display element
      const statsElement = document.createElement("div");
      statsElement.id = "dynamicComponentStats";
      statsElement.className =
        "mt-4 text-center text-sm text-gray-600 dark:text-gray-400";
      statsElement.innerHTML = `
        <div class="inline-flex items-center space-x-4 flex-wrap justify-center gap-2">
          <span class="flex items-center"><i class="fas fa-box mr-1"></i> ${this.countComponents()} Components</span>
          <span class="flex items-center"><i class="fas fa-folder mr-1"></i> 6 Categories</span>
          <span class="flex items-center"><i class="fas fa-code mr-1"></i> HTML + Tailwind + JS</span>
          <span class="flex items-center"><i class="fas fa-rocket mr-1"></i> High Performance</span>
          <span class="flex items-center"><i class="fas fa-check-circle mr-1"></i> Unit Tested</span>
        </div>
      `;

      // Insert stats above CTA section
      const ctaSection = document.querySelector(
        "#aboutComponents .text-center"
      );
      if (ctaSection) {
        ctaSection.parentNode.insertBefore(statsElement, ctaSection);
      }
    }, 1000); // Delay to ensure other components are loaded
  }

  /**
   * Count total available components from main app state
   * @returns {number|string} - Component count or "Multiple" if unavailable
   */
  countComponents() {
    if (window.componentApp && window.componentApp.components) {
      let total = 0;
      const categories = window.componentApp.components;
      for (const category in categories) {
        total += categories[category].length;
      }
      return total;
    }
    return "Multiple"; // Fallback if app state not available
  }
}

// Initialize component manager when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new AboutComponents();
});
