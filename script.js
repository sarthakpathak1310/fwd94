"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });
}

const themeButton = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("sau-campus-theme");
} catch {
  // The theme switch still works if browser storage is unavailable.
}

if (savedTheme === "evening") document.body.classList.add("dark-mode");

function updateThemeButton() {
  if (!themeButton) return;
  const isEvening = document.body.classList.contains("dark-mode");
  themeButton.setAttribute("aria-pressed", String(isEvening));
  if (themeLabel) themeLabel.textContent = isEvening ? "Daytime view" : "Evening view";
}

updateThemeButton();
themeButton?.addEventListener("click", () => {
  const isEvening = document.body.classList.toggle("dark-mode");

  try {
    localStorage.setItem("sau-campus-theme", isEvening ? "evening" : "day");
  } catch {
    // Keep the selected theme for this page view when storage is unavailable.
  }

  updateThemeButton();
});

const searchInput = document.querySelector("#tour-search");
const tourCards = [...document.querySelectorAll(".tour-card")];
const resultCount = document.querySelector("#result-count");
const noResults = document.querySelector("#no-results");

function filterTourStops() {
  if (!searchInput) return;

  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  tourCards.forEach((card) => {
    const matches = card.dataset.search.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (resultCount) resultCount.textContent = String(visibleCount);
  if (noResults) noResults.hidden = visibleCount !== 0;
}

searchInput?.addEventListener("input", filterTourStops);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput?.focus();
  }
});

const tourDetails = {
  academic: {
    title: "Academic campus",
    copy: "South Asian University brings students and scholars together for teaching, research and collaboration across the region. Explore the official university website for details about academic programmes and faculties.",
  },
  grounds: {
    title: "Campus grounds",
    copy: "Shared spaces give students room to meet, move between classes and spend time with one another. The campus is part of the wider university experience: a place shaped by daily encounters and exchange.",
  },
  community: {
    title: "Student community",
    copy: "Students from across South Asia bring different perspectives, cultures and experiences to university life. Their shared community is at the heart of SAU’s regional outlook.",
  },
  clubs: {
    title: "Clubs and societies",
    copy: "SAU student societies span music and dance, art and theatre, film and photography, South Asia Speaks and the Book Club. They give students ways to share interests, build friendships and bring ideas to campus life.",
  },
  hostel: {
    title: "Hostel life",
    copy: "SAU hostels offer shared accommodation and common areas for study, recreation and gathering. Hostel places are limited, and allocation depends on availability. Visit the official hostel page for current information.",
  },
  library: {
    title: "G. K. Chadha Library",
    copy: "The university library supports study and research with books, journals and electronic resources. The photo on this card is an illustrative library image, not a photograph of SAU’s library.",
  },
  sports: {
    title: "Sports and recreation",
    copy: "Campus recreation includes playgrounds and opportunities for football, cricket, table tennis, chess and carrom. Visit the official university website for current facilities and activities.",
  },
};

const detailsDialog = document.querySelector(".location-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCopy = document.querySelector("#dialog-copy");

document.querySelectorAll(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const details = tourDetails[button.dataset.location];
    if (!details || !detailsDialog || !dialogTitle || !dialogCopy) return;

    dialogTitle.textContent = details.title;
    dialogCopy.textContent = details.copy;
    detailsDialog.showModal();
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => detailsDialog?.close());

detailsDialog?.addEventListener("click", (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});