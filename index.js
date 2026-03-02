// ==============================
// NRG GLOBAL SETTINGS SYSTEM
// ==============================

// Apply cloak on page load
document.addEventListener("DOMContentLoaded", () => {
    applySavedCloak();
    setupAboutBlank();
});

// ==============================
// CLOAK SYSTEM
// ==============================

function applyCloak(title, icon) {
    if (title) {
        localStorage.setItem("nrg_cloak_title", title);
        document.title = title;
    }

    if (icon) {
        localStorage.setItem("nrg_cloak_icon", icon);
        setFavicon(icon);
    }
}

function applySavedCloak() {
    const savedTitle = localStorage.getItem("nrg_cloak_title");
    const savedIcon = localStorage.getItem("nrg_cloak_icon");

    if (savedTitle) {
        document.title = savedTitle;
    }

    if (savedIcon) {
        setFavicon(savedIcon);
    }
}

function setFavicon(iconUrl) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = iconUrl;
}

// ==============================
// ABOUT:BLANK SYSTEM
// ==============================

function setupAboutBlank() {
    const btn = document.querySelector(".open-about");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const win = window.open("about:blank", "_blank");
        win.document.write(`
            <iframe src="${location.href}" 
                    style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>
        `);
    });
}
