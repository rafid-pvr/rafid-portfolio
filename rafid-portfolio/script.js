/*
  Portfolio interactions and local assistant.
  To connect a real assistant later, call a secure server-side endpoint from here.
  Do not place API keys or provider credentials in this frontend file.
*/

const siteConfig = {
  assistantEndpoint: "", // e.g. "/api/portfolio-assistant" — keep keys on the server
  resumeUrl: "assets/Mohammed_Rafid_ATS_Resume_Final.pdf",
  linkedinUrl: "https://www.linkedin.com/in/mohammed-rafid-a04288435?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  githubUrl: "https://github.com/rafid-pvr"
};

const header = document.querySelector(".site-header");
const progressBar = document.getElementById("progressBar");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.querySelector(".menu-toggle");
const navAnchors = [...document.querySelectorAll(".nav-links > a[href^='#']")];

function updateScrollUI() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
  header.classList.toggle("scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const opening = !navLinks.classList.contains("open");
  navLinks.classList.toggle("open", opening);
  menuToggle.classList.toggle("open", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
});

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navAnchors.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
}, { rootMargin: "-35% 0px -55%", threshold: [0, .2, .6] });

document.querySelectorAll("main > section[id]").forEach((section) => sectionObserver.observe(section));

const backdrop = document.getElementById("modalBackdrop");
const resumeModal = document.getElementById("resumeModal");
const projectModal = document.getElementById("projectModal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalText = document.getElementById("project-modal-text");
let activeModal = null;
let triggerElement = null;

const projectDetails = {
  "Accounting & Business Operations": "This portfolio section captures practical experience with accounting activities, sales support, purchasing, inventory-related work and day-to-day business operations. More details can be added here as future project examples are ready to share.",
  "AI Learning & Experiments": "This is an evolving learning area: exploring ChatGPT and other AI tools for productivity, business workflows and future automation ideas. Specific project outcomes can be added as they are completed.",
  "Small Online Selling": "This project area reflects small-scale online selling and customer-oriented business activities. It is ready to expand with future examples, links or case studies."
};

function openModal(modal, source) {
  triggerElement = source || document.activeElement;
  activeModal = modal;
  backdrop.hidden = false;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => modal.querySelector("button")?.focus());
}

function closeModal() {
  if (!activeModal) return;
  activeModal.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = "";
  triggerElement?.focus();
  activeModal = null;
}

document.querySelectorAll(".resume-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    if (siteConfig.resumeUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = siteConfig.resumeUrl;
      downloadLink.download = "Mohammed_Rafid_Resume.pdf";
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      return;
    }
    openModal(resumeModal, button);
  });
});

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const projectName = button.dataset.project;
    projectModalTitle.textContent = projectName;
    projectModalText.textContent = projectDetails[projectName];
    openModal(projectModal, button);
  });
});

document.querySelectorAll(".modal-close").forEach((button) => button.addEventListener("click", closeModal));
backdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeModal();
  }
});

const chatLauncher = document.getElementById("chatLauncher");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const quickPrompts = document.getElementById("quickPrompts");

function setChatOpen(open) {
  chatPanel.classList.toggle("open", open);
  chatPanel.setAttribute("aria-hidden", String(!open));
  chatLauncher.setAttribute("aria-expanded", String(open));
  if (open) window.setTimeout(() => chatInput.focus(), 180);
}

chatLauncher.addEventListener("click", () => setChatOpen(!chatPanel.classList.contains("open")));
chatClose.addEventListener("click", () => setChatOpen(false));

function addChatMessage(text, role) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function localAssistantResponse(question) {
  const input = question.toLowerCase().trim();
  if (/tally/.test(input)) {
    return "Rafid has practical experience using Tally as part of his accounting activities and routine record management.";
  }
  if (/account|experience|work|operation|inventory|purchase|sales|customer|cash|employee/.test(input)) {
    return "His practical experience includes accounting activities, Tally usage, sales support, customer dealing, purchase activities, goods inward and outward checks, inventory operations, employee coordination, cash and transaction handling, online selling and general business support.";
  }
  if (/tool|skill|excel|chatgpt/.test(input)) {
    return "His toolkit includes Accounting, Tally, Microsoft Excel, AI tools, ChatGPT, Sales & Customer Dealing, Purchase & Inventory Operations, and Business Operations. The portfolio describes Excel as working knowledge and the AI tools as learning and experimentation.";
  }
  if (/ai|automation|future|learn/.test(input)) {
    return "Yes. Rafid is actively learning how AI can support real-world problems, productivity and business operations. He uses ChatGPT and other AI tools while exploring accounting and business workflows.";
  }
  if (/contact|email|phone|whatsapp|reach|instagram/.test(input)) {
    return "You can contact Rafid by email at Rafid.pvr@gmail.com, via WhatsApp at +971 56 639 0270, or on Instagram at @mohd_rafid__.zh. LinkedIn and GitHub links can be added when they are available.";
  }
  if (/project|online selling/.test(input)) {
    return "The portfolio currently features Accounting & Business Operations, AI Learning & Experiments, and Small Online Selling. Each represents practical experience or an active learning area, with room for future case studies.";
  }
  if (/who|about|rafid|mohammed/.test(input)) {
    return "Mohammed Rafid P is an accounting professional and learner with around 2 years of practical experience across accounting, sales, purchasing, customer dealing and business operations. He is also exploring AI tools and business workflows.";
  }
  return "I can help with Mohammed Rafid’s experience, skills, accounting background, AI learning, projects or contact information. Which would you like to know about?";
}

async function answerQuestion(question) {
  addChatMessage(question, "user");
  if (siteConfig.assistantEndpoint) {
    // A future implementation should call the configured server endpoint here.
    // The local assistant remains active until a secure endpoint is connected.
  }
  window.setTimeout(() => addChatMessage(localAssistantResponse(question), "bot"), 260);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  chatInput.value = "";
  answerQuestion(question);
});

quickPrompts.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  answerQuestion(button.textContent);
});
