/* ============================= */
/* ========= INIT ============== */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {
    setupSidebarNavigation();
    setupCardNavigation();
    setupCloakSettings();
    setupAboutBlankButtons();
});

/* ============================= */
/* ===== SIDEBAR NAVIGATION ==== */
/* ============================= */

function setupSidebarNavigation() {
    const icons = document.querySelectorAll('.sidebar .icon');

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetPage = icon.dataset.page;
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
}

/* ============================= */
/* ===== CARD NAVIGATION ======= */
/* ============================= */

function setupCardNavigation() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetPage = card.dataset.page;
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
}

/* ============================= */
/* ===== WEBSITE CLOAK ========= */
/* ============================= */

function setupCloakSettings() {
    const savedTitle = localStorage.getItem("nrg_cloak_title");
    const savedIcon = localStorage.getItem("nrg_cloak_icon");

    if (savedTitle) document.title = savedTitle;

    if (savedIcon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = savedIcon;
    }
}

function applyCloak(title, iconUrl) {
    if (title) {
        document.title = title;
        localStorage.setItem("nrg_cloak_title", title);
    }

    if (iconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = iconUrl;
        localStorage.setItem("nrg_cloak_icon", iconUrl);
    }
}

/* ============================= */
/* ===== OPEN IN ABOUT:BLANK === */
/* ============================= */

function setupAboutBlankButtons() {
    const aboutBlankButtons = document.querySelectorAll('.open-about');

    aboutBlankButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            openInAboutBlank(window.location.href);
        });
    });
}

function openInAboutBlank(url) {
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.write(`
        <html>
            <head>
                <title>Loading...</title>
                <style>
                    html,body{
                        margin:0;
                        height:100%;
                        background:#000;
                    }
                    iframe{
                        border:none;
                        width:100%;
                        height:100%;
                    }
                </style>
            </head>
            <body>
                <iframe src="${url}"></iframe>
            </body>
        </html>
    `);

    win.document.close();
}
