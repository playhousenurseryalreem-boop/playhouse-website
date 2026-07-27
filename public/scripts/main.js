const menuToggle = document.querySelector(".menu-toggle");
const menuItems = document.querySelector(".menu-items");

if (menuToggle && menuItems) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuItems.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const branchLinks = {
  "Khalidiya Branch": "https://wa.me/971542632235?text=Hi%20Playhouse%20Khalidiya!",
  "Al Reem Branch": "https://wa.me/971505624547?text=Hi%20Playhouse%20Al%20Reem!",
  "Mirdif Branch": "https://wa.me/971529821105?text=Hi%20Playhouse%20Mirdif!"
};

const branchNumbers = {
  "Khalidiya Branch": "971542632235",
  "Al Reem Branch": "971505624547",
  "Mirdif Branch": "971529821105"
};

const getValue = (form, name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || "";

const getCurrentLanguage = () => localStorage.getItem("playhouse-language") || document.documentElement.lang || "en";

const branchDisplayNames = {
  en: {
    "Khalidiya Branch": "Khalidiya",
    "Al Reem Branch": "Al Reem",
    "Mirdif Branch": "Mirdif"
  },
  ar: {
    "Khalidiya Branch": "الخالدية",
    "Al Reem Branch": "الريم",
    "Mirdif Branch": "مردف"
  }
};

const ageDisplayNames = {
  ar: {
    "45 days - 1 year": "45 يوماً - سنة",
    "1 - 2 years": "سنة - سنتان",
    "2 - 3 years": "سنتان - 3 سنوات",
    "3 - 4 years": "3 - 4 سنوات",
    "4 - 5 years": "4 - 5 سنوات"
  }
};

const buildWhatsAppUrl = (form) => {
  const branch = getValue(form, "your-location") || "Khalidiya Branch";
  const number = branchNumbers[branch] || branchNumbers["Khalidiya Branch"];
  const parentName = [getValue(form, "FirstName"), getValue(form, "LastName")].filter(Boolean).join(" ");
  const childName = [getValue(form, "Child_s_First_Name__c"), getValue(form, "Child_s_Last_Name__c")].filter(Boolean).join(" ");
  const language = getCurrentLanguage() === "ar" ? "ar" : "en";
  const branchName = branchDisplayNames[language][branch] || branch.replace(" Branch", "");
  const childAge = getValue(form, "your-age");
  const childAgeLabel = ageDisplayNames[language]?.[childAge] || childAge;
  const messageLines = language === "ar"
    ? [
        `مرحباً بلاي هاوس ${branchName}!`,
        "أرغب في حجز زيارة.",
        parentName ? `اسم ولي الأمر: ${parentName}` : "",
        getValue(form, "Phone") ? `رقم الهاتف: ${getValue(form, "Phone")}` : "",
        getValue(form, "your-email") ? `البريد الإلكتروني: ${getValue(form, "your-email")}` : "",
        childName ? `اسم الطفل: ${childName}` : "",
        childAgeLabel ? `عمر الطفل: ${childAgeLabel}` : "",
        `أقرب فرع: ${branchName}`
      ]
    : [
        `Hi Playhouse ${branchName}!`,
        "I would like to book a visit.",
        parentName ? `Parent name: ${parentName}` : "",
        getValue(form, "Phone") ? `Mobile: ${getValue(form, "Phone")}` : "",
        getValue(form, "your-email") ? `Email: ${getValue(form, "your-email")}` : "",
        childName ? `Child name: ${childName}` : "",
        childAgeLabel ? `Child age: ${childAgeLabel}` : "",
        `Nearest branch: ${branchName}`
      ];

  return `https://wa.me/${number}?text=${encodeURIComponent(messageLines.filter(Boolean).join("\n"))}`;
};

const bookingModal = document.querySelector(".booking-modal");
const openBookingButtons = document.querySelectorAll("[data-open-booking]");
const closeBookingButtons = document.querySelectorAll("[data-close-booking]");

const openBookingModal = () => {
  if (!bookingModal) return;
  bookingModal.classList.add("is-open");
  bookingModal.setAttribute("aria-hidden", "false");
  bookingModal.querySelector("input, select, button")?.focus();
};

const closeBookingModal = () => {
  if (!bookingModal) return;
  bookingModal.classList.remove("is-open");
  bookingModal.setAttribute("aria-hidden", "true");
};

const chatWidget = document.querySelector("[data-chat-widget]");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatClose = document.querySelector("[data-chat-close]");

const openChatWidget = () => {
  if (!chatWidget || !chatToggle) return;
  chatWidget.classList.add("is-open");
  chatToggle.setAttribute("aria-expanded", "true");
};

const closeChatWidget = () => {
  if (!chatWidget || !chatToggle) return;
  chatWidget.classList.remove("is-open");
  chatToggle.setAttribute("aria-expanded", "false");
};

openBookingButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openBookingModal();
  });
});

closeBookingButtons.forEach((button) => {
  button.addEventListener("click", closeBookingModal);
});

bookingModal?.addEventListener("click", (event) => {
  if (event.target === bookingModal) {
    closeBookingModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBookingModal();
    closeChatWidget();
  }
});

chatToggle?.addEventListener("click", openChatWidget);
chatClose?.addEventListener("click", closeChatWidget);

document.querySelectorAll(".wide-form, .tour-form form, .booking-modal-form, .hero-booking-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = buildWhatsAppUrl(form);
    window.open(url, "_blank", "noopener");
    closeBookingModal();
  });
});
