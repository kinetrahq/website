const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".navbar__menu-button");
const mobileNavigation = document.querySelector(".mobile-navigation");
const mobileLinks = document.querySelectorAll(".mobile-navigation__link");

const dropdownTriggers = document.querySelectorAll(
    ".navbar__link--dropdown"
);

const desktopBreakpoint = window.matchMedia("(min-width: 901px)");

const SCROLL_THRESHOLD = 16;


/* ==========================================================
   HEADER SCROLL STATE
   ========================================================== */

function updateHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle(
        "is-scrolled",
        window.scrollY > SCROLL_THRESHOLD
    );
}

updateHeaderState();

window.addEventListener("scroll", updateHeaderState, {
    passive: true,
});


/* ==========================================================
   MOBILE NAVIGATION
   ========================================================== */

function isMobileNavigationOpen() {
    return menuButton?.getAttribute("aria-expanded") === "true";
}

function openMobileNavigation() {
    if (!menuButton || !mobileNavigation) {
        return;
    }

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");

    mobileNavigation.classList.add("is-open");
    mobileNavigation.setAttribute("aria-hidden", "false");

    document.body.classList.add("navigation-open");
}

function closeMobileNavigation() {
    if (!menuButton || !mobileNavigation) {
        return;
    }

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");

    mobileNavigation.classList.remove("is-open");
    mobileNavigation.setAttribute("aria-hidden", "true");

    document.body.classList.remove("navigation-open");
}

function toggleMobileNavigation() {
    if (isMobileNavigationOpen()) {
        closeMobileNavigation();
        return;
    }

    closeAllDropdowns();
    openMobileNavigation();
}

menuButton?.addEventListener("click", toggleMobileNavigation);

mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
});


/* ==========================================================
   DESKTOP DROPDOWNS
   ========================================================== */

function getDropdown(trigger) {
    const dropdownId = trigger.getAttribute("aria-controls");

    if (!dropdownId) {
        return null;
    }

    return document.getElementById(dropdownId);
}

function closeDropdown(trigger) {
    const dropdown = getDropdown(trigger);

    trigger.setAttribute("aria-expanded", "false");
    dropdown?.classList.remove("is-open");
    dropdown?.setAttribute("aria-hidden", "true");
}

function openDropdown(trigger) {
    const dropdown = getDropdown(trigger);

    if (!dropdown) {
        return;
    }

    closeAllDropdowns(trigger);
    closeMobileNavigation();

    trigger.setAttribute("aria-expanded", "true");
    dropdown.classList.add("is-open");
    dropdown.setAttribute("aria-hidden", "false");
}

function toggleDropdown(trigger) {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeDropdown(trigger);
        return;
    }

    openDropdown(trigger);
}

function closeAllDropdowns(exception = null) {
    dropdownTriggers.forEach((trigger) => {
        if (trigger !== exception) {
            closeDropdown(trigger);
        }
    });
}

dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        toggleDropdown(trigger);
    });
});


/* ==========================================================
   GLOBAL CLOSE BEHAVIOR
   ========================================================== */

document.addEventListener("click", (event) => {
    const clickedDropdown = event.target.closest(".nav-dropdown");
    const clickedTrigger = event.target.closest(
        ".navbar__link--dropdown"
    );

    if (!clickedDropdown && !clickedTrigger) {
        closeAllDropdowns();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    closeMobileNavigation();
    closeAllDropdowns();

    menuButton?.focus();
});


/* ==========================================================
   BREAKPOINT CHANGES
   ========================================================== */

function handleBreakpointChange(event) {
    if (!event.matches) {
        closeAllDropdowns();
        return;
    }

    closeMobileNavigation();
}

desktopBreakpoint.addEventListener(
    "change",
    handleBreakpointChange
);


/* ==========================================================
   PAGE RESTORE SAFETY
   ========================================================== */

window.addEventListener("pageshow", () => {
    closeMobileNavigation();
    closeAllDropdowns();
    updateHeaderState();
});
