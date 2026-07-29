"use strict";

const menuToggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");
const desktopQuery = window.matchMedia("(min-width: 50rem)");

const setMenuState = (isOpen) => {
    if (!(menuToggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) {
        return;
    }

    const accessibleLabel = menuToggle.querySelector(".sr-only");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("nav__menu--open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    if (accessibleLabel) {
        accessibleLabel.textContent = isOpen ? "Cerrar menú" : "Abrir menú";
    }
};

if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
        setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            menuToggle.focus();
        }
    });

    desktopQuery.addEventListener("change", (event) => {
        if (event.matches) {
            setMenuState(false);
        }
    });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});
