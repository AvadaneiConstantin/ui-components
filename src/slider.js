// src\slider.js

// Import component configuration from separate file
import { COMPONENTS_CONFIG } from "./config/components.js";

// Use the imported configuration
const components = COMPONENTS_CONFIG;

let currentCategory = "landing";
let currentIndex = 0;
let autoSlideInterval = null;
let isPlaying = false;

// DOM Elements
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const componentFrame = document.getElementById("componentFrame");
const componentTitle = document.getElementById("componentTitle");
const slidePlaceholder = document.getElementById("slidePlaceholder");
const loadingOverlay = document.getElementById("loadingOverlay");
const bulletsContainer = document.getElementById("bullets");
const categoryTabs = document.querySelectorAll(".category-tab");

// Initialize
function initSlider() {
  loadCategory("landing");
  setupEventListeners();
}

// Load category
function loadCategory(category) {
  currentCategory = category;
  currentIndex = 0;

  // Update active tab
  categoryTabs.forEach((tab) => {
    const tabCategory = tab.getAttribute("data-category");
    tab.classList.toggle("text-sky-600", tabCategory === category);
    tab.classList.toggle("border-b", tabCategory === category);
    tab.classList.toggle("border-sky-500", tabCategory === category);
  });

  // Load first component
  if (components[category] && components[category].length > 0) {
    loadComponent(0);
    updateBullets();
  } else {
    showPlaceholder("No components in this category");
  }
}

// Load component
// Load component
async function loadComponent(index) {
  const categoryComponents = components[currentCategory];
  if (!categoryComponents || index < 0 || index >= categoryComponents.length)
    return;

  currentIndex = index;
  const component = categoryComponents[index];

  // Reset UI state
  loadingOverlay.classList.remove("hidden");
  slidePlaceholder.classList.add("hidden");
  componentFrame.classList.add("hidden");
  componentTitle.textContent = component.name;

  try {
    // 1. Descarcă conținutul fișierului ca text
    const response = await fetch(component.path);

    if (!response.ok) throw new Error("404 Not Found");

    const htmlContent = await response.text();

    // 2. VERIFICARE CRITICĂ:
    // Dacă fișierul descărcat conține titlul paginii tale principale,
    // înseamnă că serverul face redirect la index.html în loc de 404.
    if (htmlContent.includes("<title>UI Components Showcase</title>")) {
      throw new Error("Component file missing (Redirected to index)");
    }

    // 3. Dacă e valid, setăm sursa iframe-ului
    componentFrame.src = component.path;

    componentFrame.onload = function () {
      loadingOverlay.classList.add("hidden");
      componentFrame.classList.remove("hidden");

      // Sync theme
      try {
        const iframeDoc =
          componentFrame.contentDocument ||
          componentFrame.contentWindow.document;
        if (document.documentElement.classList.contains("dark")) {
          iframeDoc.documentElement.classList.add("dark");
        }
      } catch (e) {
        console.debug("Theme sync failed (cross-origin)");
      }

      updateButtons();
      updateBullets();
    };
  } catch (error) {
    console.warn("Slider Error:", error.message);
    loadingOverlay.classList.add("hidden");

    // Afișăm mesajul de eroare în UI-ul tău existent
    showPlaceholder(`
      <div class="text-red-500 text-center">
        <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
        <p class="font-bold">Component Not Found</p>
        <p class="text-xs opacity-70">${component.path}</p>
      </div>
    `);

    updateButtons();
    updateBullets();
  }
}

// Update bullets
function updateBullets() {
  const categoryComponents = components[currentCategory];
  bulletsContainer.innerHTML = "";

  categoryComponents.forEach((_, index) => {
    const bullet = document.createElement("button");
    bullet.className = `w-3 h-3 rounded-full ${
      index === currentIndex ? "bg-sky-600" : "bg-gray-300 dark:bg-gray-700"
    }`;
    bullet.addEventListener("click", () => loadComponent(index));
    bulletsContainer.appendChild(bullet);
  });
}

// Update buttons state
function updateButtons() {
  const categoryComponents = components[currentCategory];
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === categoryComponents.length - 1;
}

// Show placeholder
function showPlaceholder(message) {
  slidePlaceholder.innerHTML = `
    <div class="text-center">
      <i class="fas fa-layer-group text-5xl mb-4 opacity-30"></i>
      <p>${message}</p>
    </div>
  `;
  slidePlaceholder.classList.remove("hidden");
  componentFrame.classList.add("hidden");
}

// Auto slide
function toggleAutoSlide() {
  if (isPlaying) {
    clearInterval(autoSlideInterval);
    playPauseBtn.innerHTML =
      '<i class="fas fa-play mr-1"></i><span>Play</span>';
  } else {
    autoSlideInterval = setInterval(() => {
      const categoryComponents = components[currentCategory];
      if (currentIndex < categoryComponents.length - 1) {
        loadComponent(currentIndex + 1);
      } else {
        loadComponent(0);
      }
    }, 3000);
    playPauseBtn.innerHTML =
      '<i class="fas fa-pause mr-1"></i><span>Pause</span>';
  }
  isPlaying = !isPlaying;
}

// Setup event listeners
function setupEventListeners() {
  // Category tabs
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.getAttribute("data-category");
      loadCategory(category);
    });
  });

  // Navigation buttons
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      loadComponent(currentIndex - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    const categoryComponents = components[currentCategory];
    if (currentIndex < categoryComponents.length - 1) {
      loadComponent(currentIndex + 1);
    }
  });

  // Play/Pause
  playPauseBtn.addEventListener("click", toggleAutoSlide);

  // Fullscreen
  fullscreenBtn.addEventListener("click", () => {
    const component = components[currentCategory][currentIndex];
    if (component) {
      window.open(component.path, "_blank");
    }
  });
}

// Initialize on load
document.addEventListener("DOMContentLoaded", initSlider);
