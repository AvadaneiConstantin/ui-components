// src/config/components.js
export const COMPONENTS_CONFIG = {
  landing: [
    {
      id: "landing1",
      name: "Landing 1",
      path: "/public/components/landing/landing1.html",
      tags: ["hero", "cta", "gradient"],
      description: "Modern SaaS platform landing with gradient overlay",
    },
    {
      id: "landing2",
      name: "Landing 2",
      path: "/public/components/landing/landing2.html",
      tags: ["product", "launch", "modern"],
      description: "Product launch page with announcement badge",
    },
    {
      id: "landing3",
      name: "Landing 3",
      path: "/public/components/landing/landing3.html",
    },
  ],

  navbar: [
    {
      id: "navbar1",
      name: "Modern Navbar",
      path: "/public/components/navbar/navbar1.html",
      tags: ["navigation", "sticky", "responsive"],
    },
    {
      id: "navbar2",
      name: "Navbar 2",
      path: "/public/components/navbar/navbar2.html",
    },
    {
      id: "navbar3",
      name: "Navbar with multiple columns dropdown",
      path: "/public/components/navbar/navbar3.html",
    },
    {
      id: "pageNavbar",
      name: "Page Navbar",
      path: "/public/components/navbar/pageNavbar.html",
    },
  ],

  login: [
    {
      id: "login1",
      name: "Login 1",
      path: "/public/components/login/login1.html",
      tags: ["authentication", "form"],
    },
    {
      id: "login2",
      name: "Login 2",
      path: "/public/components/login/login2.html",
    },
    {
      id: "loginPage",
      name: "Login Page",
      path: "/public/components/login/loginPage.html",
    },
  ],

  review: [
    {
      id: "review1",
      name: "Review Card 1",
      path: "/public/components/reviews/review1.html",
      tags: ["testimonial", "card", "rating"],
    },
    {
      id: "review2",
      name: "Review Card 2",
      path: "/public/components/reviews/review2.html",
    },
    {
      id: "rating1",
      name: "Rating Widget",
      path: "/public/components/reviews/rating1.html",
    },
    {
      id: "rating2",
      name: "Share Your Experience",
      path: "/public/components/reviews/rating2.html",
    },
  ],

  contact: [
    {
      id: "contact1",
      name: "Contact 1",
      path: "/public/components/contact/contact1.html",
      tags: ["form", "contact", "social"],
    },
    {
      id: "contact2",
      name: "Contact 2",
      path: "./components/contact/contact2.html",
    },
    {
      id: "contact3",
      name: "Request Consultation",
      path: "/public/components/contact/contact3.html",
    },
  ],

  webApp: [
    {
      id: "vision",
      name: "Vision Page",
      path: "/public/components/WebPages/vision.html",
      tags: ["full-page", "illustration"],
    },
    {
      id: "page2",
      name: "Nexus Flow Page",
      path: "/public/components/WebPages/nexus.html",
    },
    {
      id: "professor",
      name: "Professor Page",
      path: "/public/components/WebPages/proffessor.html",
    },
    {
      id: "robot",
      name: "Robot Page",
      path: "/public/components/WebPages/robo.html",
    },
    {
      id: "space",
      name: "Space Page",
      path: "/public/components/WebPages/space.html",
    },
    {
      id: "photographer",
      name: "Photographer Page",
      path: "/public/components/WebPages/fotographer.html",
    },
  ],
};

// Helper functions
export function getAllComponents() {
  return Object.values(COMPONENTS_CONFIG).flat();
}

export function getComponentById(id) {
  return getAllComponents().find((comp) => comp.id === id);
}

export function getComponentsByCategory(category) {
  return COMPONENTS_CONFIG[category] || [];
}
