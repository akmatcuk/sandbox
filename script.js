// 1. Tip data – edit this list to change tips
// Each tip has text and category
const TIPS = [
  {
    text: "Turn off lights when leaving a room for more than a few minutes.",
    category: "Energy",
  },
  {
    text: "Use a reusable water bottle instead of buying single-use plastic bottles.",
    category: "Water",
  },
  {
    text: "Combine errands into a single trip to reduce driving.",
    category: "Transport",
  },
  {
    text: "Choose second-hand or vintage clothing before buying new.",
    category: "Fashion",
  },
  {
    text: "Plan meals for the week to avoid food waste and impulse buying.",
    category: "Food",
  },
  {
    text: "Wash clothes in cold water whenever possible to save energy.",
    category: "Energy",
  },
  {
    text: "Take shorter showers and turn off the tap while soaping.",
    category: "Water",
  },
  {
    text: "Bring your own bag when grocery shopping to avoid disposable bags.",
    category: "Food",
  },
  {
    text: "Have one meat-free day each week to reduce your footprint.",
    category: "Food",
  },
  {
    text: "Walk or cycle short distances instead of driving.",
    category: "Transport",
  },
  {
    text: "Sort recyclables properly to avoid contamination.",
    category: "Waste",
  },
  {
    text: "Choose products with minimal or recyclable packaging.",
    category: "Waste",
  },
  {
    text: "Compost food scraps to reduce landfill waste.",
    category: "Waste",
  },

];

// 2. Helpers

function $(selector) {
  return document.querySelector(selector);
}

function setCurrentYear() {
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 3. Theme (dark / light) toggle

const THEME_KEY = "sustainability-daily-theme";

function applyStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark") {
    document.body.classList.add("dark");
  } else if (stored === "light") {
    document.body.classList.remove("dark");
  }
}

function initThemeToggle() {
  applyStoredTheme();

  const toggle = $("#themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  });
}

// 4. Random tip generator

let lastTipIndex = -1;

function getRandomTip() {
  if (TIPS.length === 0) {
    return { text: "No tips available yet. Add some in script.js!", category: "General" };
  }

  if (TIPS.length === 1) {
    return TIPS[0];
  }

  let index;
  do {
    index = Math.floor(Math.random() * TIPS.length);
  } while (index === lastTipIndex);

  lastTipIndex = index;
  return TIPS[index];
}

const TIP_OF_DAY_KEY = "sustainability-daily-tip";
const TIP_OF_DAY_DATE_KEY = "sustainability-daily-tip-date";

function getTipOfTheDay() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(TIP_OF_DAY_DATE_KEY);
  const savedTip = localStorage.getItem(TIP_OF_DAY_KEY);

  // If we already have today's tip, use it
  if (savedDate === today && savedTip) {
    return JSON.parse(savedTip);
  }

  // Otherwise generate a new one
  const newTip = getRandomTip();

  // Save it for the rest of the day
  localStorage.setItem(TIP_OF_DAY_KEY, JSON.stringify(newTip));
  localStorage.setItem(TIP_OF_DAY_DATE_KEY, today);

  return newTip;
}

function renderRandomTip() {
  const tipCard = $("#tipCard");
  const tipTextEl = $("#tipText");
  const tipCategoryEl = $("#tipCategory");

  if (!tipCard || !tipTextEl || !tipCategoryEl) return;

  const tip = getTipOfTheDay();
  tipTextEl.textContent = tip.text;
  tipCategoryEl.textContent = tip.category;

  // Simple fade animation
  tipCard.style.opacity = "0";
  tipCard.style.transform = "translateY(4px)";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      tipCard.style.transition = "opacity 180ms ease-out, transform 180ms ease-out";
      tipCard.style.opacity = "1";
      tipCard.style.transform = "translateY(0)";
    });
  });
}

// 5. Notifications logic

function canUseNotifications() {
  return "Notification" in window;
}

function requestNotificationPermission() {
  if (!canUseNotifications()) {
    alert("Your browser does not support notifications.");
    return Promise.resolve("denied");
  }

  if (Notification.permission === "granted") {
    return Promise.resolve("granted");
  }

  return Notification.requestPermission();
}

function sendTipNotification() {
  const tipTextEl = $("#tipText");
  const tipCategoryEl = $("#tipCategory");
  if (!tipTextEl || !tipCategoryEl) return;

  const title = `Sustainability Daily – ${tipCategoryEl.textContent}`;
  const body = tipTextEl.textContent;

  if (!canUseNotifications()) {
    alert("Your browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "", // You can add a logo path here later: "images/logo-96.png"
    });
  } else {
    requestNotificationPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body,
          icon: "",
        });
      } else {
        alert("Notifications were blocked. You can change this in your browser settings.");
      }
    });
  }
}

// 6. Initialize everything on DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  initThemeToggle();
  renderRandomTip();

  if (notifyTipBtn) {
    notifyTipBtn.addEventListener("click", sendTipNotification);
  }
});
