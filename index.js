// ==============================
// NRG GLOBAL SETTINGS SYSTEM
// ==============================

// Immediately apply cloak (no wait)
const savedTitle = localStorage.getItem("nrg_cloak_title");
const savedIcon = localStorage.getItem("nrg_cloak_icon");

if (savedTitle) document.title = savedTitle;
if (savedIcon) setFavicon(savedIcon);

// Wait for DOMContentLoaded only for buttons
document.addEventListener("DOMContentLoaded", () => {
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

function resetCloak() {
    localStorage.removeItem("nrg_cloak_title");
    localStorage.removeItem("nrg_cloak_icon");
    location.reload();
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

(function () {
    const savedTitle = localStorage.getItem("nrg_cloak_title");
    const savedIcon = localStorage.getItem("nrg_cloak_icon");

    if (savedTitle) {
        document.title = savedTitle;
    }

    if (savedIcon) {
        let link = document.querySelector("link[rel='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = savedIcon;
    }
})();


// ===== PANIC KEY SYSTEM =====

// Default panic config
if (!localStorage.getItem("nrg_panic_key")) {
    localStorage.setItem("nrg_panic_key", "\\"); // default key
}

if (!localStorage.getItem("nrg_panic_url")) {
    localStorage.setItem("nrg_panic_url", "https://google.com");
}

document.addEventListener("keydown", function(e) {
    const panicKey = localStorage.getItem("nrg_panic_key");

    if (e.key === panicKey) {
        const panicUrl = localStorage.getItem("nrg_panic_url");

        // Option 1: Redirect current tab
        window.location.href = panicUrl;

        // Option 2 (stronger): Replace tab
        // window.open(panicUrl, "_self");
    }
});

/* ==============================
   UNIVERSAL THEME SCRIPT
============================== */

// Define theme colors
const themes = {
    default: {
        '--bg-gradient-1': '#0a0a0a',
        '--bg-gradient-2': '#0a1f3f',
        '--bg-gradient-3': '#001f4f',
        '--bg-gradient-4': '#0a0a0a',
        '--btn-primary-bg': '#00d9ff',
        '--btn-primary-hover': '#00b8e6',
        '--btn-secondary-bg': '#1e1e2e'
    },
    ocean: {
        '--bg-gradient-1': '#001f3f',
        '--bg-gradient-2': '#003366',
        '--bg-gradient-3': '#0055a5',
        '--bg-gradient-4': '#001f3f',
        '--btn-primary-bg': '#00ffaa',
        '--btn-primary-hover': '#00dd88',
        '--btn-secondary-bg': '#0a1f3f'
    },
    sunset: {
        '--bg-gradient-1': '#ff6b6b',
        '--bg-gradient-2': '#ff8e53',
        '--bg-gradient-3': '#ffb347',
        '--bg-gradient-4': '#ff6b6b',
        '--btn-primary-bg': '#ffb347',
        '--btn-primary-hover': '#ffa500',
        '--btn-secondary-bg': '#1a1a1a'
    },
    forest: {
  '--bg-gradient-1': '#0b3d0b',
  '--bg-gradient-2': '#1e5e1e',
  '--bg-gradient-3': '#2e7d2e',
  '--bg-gradient-4': '#0b3d0b',
  '--btn-primary-bg': '#4CAF50',
  '--btn-primary-hover': '#45a049',
  '--btn-secondary-bg': '#1a2e1a'
},
    cyberpunk: {
  '--bg-gradient-1': '#0a0a0a',
  '--bg-gradient-2': '#ff00ff',
  '--bg-gradient-3': '#00ffff',
  '--bg-gradient-4': '#0a0a0a',
  '--btn-primary-bg': '#ff00ff',
  '--btn-primary-hover': '#ff66ff',
  '--btn-secondary-bg': '#1e1e1e'
},
    sunrise: {
  '--bg-gradient-1': '#ffb347',
  '--bg-gradient-2': '#ffcc70',
  '--bg-gradient-3': '#ffd699',
  '--bg-gradient-4': '#ffb347',
  '--btn-primary-bg': '#ff9966',
  '--btn-primary-hover': '#ff7f50',
  '--btn-secondary-bg': '#ffe6cc'
},
    aurora: {
  '--bg-gradient-1': '#0d0d50',
  '--bg-gradient-2': '#004d99',
  '--bg-gradient-3': '#6600cc',
  '--bg-gradient-4': '#0d0d50',
  '--btn-primary-bg': '#66ccff',
  '--btn-primary-hover': '#3399ff',
  '--btn-secondary-bg': '#1a1a3d'
},
    candy: {
  '--bg-gradient-1': '#ffb6c1',
  '--bg-gradient-2': '#ffd1dc',
  '--bg-gradient-3': '#ffe4e1',
  '--bg-gradient-4': '#ffb6c1',
  '--btn-primary-bg': '#ff69b4',
  '--btn-primary-hover': '#ff1493',
  '--btn-secondary-bg': '#ffe4e1'
},
    neon: {
        '--bg-gradient-1': '#0f0f0f',
        '--bg-gradient-2': '#ff00ff',
        '--bg-gradient-3': '#00ffff',
        '--bg-gradient-4': '#0f0f0f',
        '--btn-primary-bg': '#ff00ff',
        '--btn-primary-hover': '#ff66ff',
        '--btn-secondary-bg': '#1e1e1e'
    }
};

// Apply a theme
function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
        localStorage.setItem('nrg_theme_' + key, theme[key]);
    });

    localStorage.setItem('nrg_theme_selected', themeName);
}

// Reset to default
function applyThemeDefault() {
    Object.keys(themes.default).forEach(key => {
        document.documentElement.style.setProperty(key, themes.default[key]);
        localStorage.setItem('nrg_theme_' + key, themes.default[key]);
    });
    localStorage.setItem('nrg_theme_selected', 'default');
}

// Apply saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('nrg_theme_selected') || 'default';

    if (themes[savedTheme]) {
        Object.keys(themes[savedTheme]).forEach(key => {
            const value = localStorage.getItem('nrg_theme_' + key) || themes[savedTheme][key];
            document.documentElement.style.setProperty(key, value);
        });
    }

    // If a theme dropdown exists, set its value
    const themeChooser = document.getElementById('theme-chooser');
    if (themeChooser) themeChooser.value = savedTheme;

    // Add change listener for dropdown
    if (themeChooser) {
        themeChooser.addEventListener('change', () => {
            applyTheme(themeChooser.value);
            alert(`Theme "${themeChooser.value}" applied.`);
        });
    }
});

// Optional: expose reset function to button click
window.resetTheme = () => {
    applyThemeDefault();
    const themeChooser = document.getElementById('theme-chooser');
    if (themeChooser) themeChooser.value = 'default';
    alert('Theme reset to default.');
};



