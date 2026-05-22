(function () {
    var savedTitle = localStorage.getItem("nrg_cloak_title");
    var savedIcon  = localStorage.getItem("nrg_cloak_icon");
    if (savedTitle) document.title = savedTitle;
    if (savedIcon)  _setFavicon(savedIcon);
})();

function _setFavicon(url) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = url;
}
window.setFavicon = _setFavicon;

function applyCloak(title, icon) {
    if (title) { localStorage.setItem("nrg_cloak_title", title); document.title = title; }
    if (icon)  { localStorage.setItem("nrg_cloak_icon",  icon);  _setFavicon(icon); }
}
function resetCloak() {
    localStorage.removeItem("nrg_cloak_title");
    localStorage.removeItem("nrg_cloak_icon");
    location.reload();
}


if (!localStorage.getItem("nrg_panic_key")) localStorage.setItem("nrg_panic_key", "\\");
if (!localStorage.getItem("nrg_panic_url")) localStorage.setItem("nrg_panic_url", "https://google.com");

document.addEventListener("keydown", function (e) {
    var k = localStorage.getItem("nrg_panic_key");
    if (k && e.key === k) window.location.href = localStorage.getItem("nrg_panic_url") || "https://google.com";
});


var themes = {

    midnight: {
        label: "Midnight",
        colors: ["#0a0a0a","#111827","#1e293b"],
        vars: {
            "--bg":                  "#0a0a0a",
            "--surface":             "#111111",
            "--surface2":            "#1a1a1a",
            "--surface3":            "#222222",
            "--border":              "#2a2a2a",
            "--text":                "#e8e8e8",
            "--text-dim":            "#666666",
            "--text-muted":          "#3a3a3a",
            "--accent":              "#c50cf9",
            "--accent-dim":          "rgba(197,12,249,0.10)",
            "--accent-glow":         "rgba(197,12,249,0.25)",
            "--bg-gradient-1":       "#0a0a0a",
            "--bg-gradient-2":       "#111827",
            "--bg-gradient-3":       "#1e293b",
            "--bg-gradient-4":       "#0a0a0a",
            "--btn-primary-bg":      "#c50cf9",
            "--btn-primary-hover":   "#a800d4",
            "--btn-secondary-bg":    "#1e1e2e",
            "--card-bg":             "#1a1a1a",
            "--card-hover-bg":       "#c50cf9",
            "--card-text":           "#e8e8e8",
            "--nav-icon-color":      "#c50cf9"
        }
    },

    slate: {
        label: "Slate",
        colors: ["#0f172a","#1e293b","#334155"],
        vars: {
            "--bg":                  "#0f172a",
            "--surface":             "#141f35",
            "--surface2":            "#1e293b",
            "--surface3":            "#263348",
            "--border":              "#334155",
            "--text":                "#e2e8f0",
            "--text-dim":            "#64748b",
            "--text-muted":          "#334155",
            "--accent":              "#38bdf8",
            "--accent-dim":          "rgba(56,189,248,0.10)",
            "--accent-glow":         "rgba(56,189,248,0.25)",
            "--bg-gradient-1":       "#0f172a",
            "--bg-gradient-2":       "#1e293b",
            "--bg-gradient-3":       "#334155",
            "--bg-gradient-4":       "#0f172a",
            "--btn-primary-bg":      "#38bdf8",
            "--btn-primary-hover":   "#0ea5e9",
            "--btn-secondary-bg":    "#1e293b",
            "--card-bg":             "#1e293b",
            "--card-hover-bg":       "#38bdf8",
            "--card-text":           "#e2e8f0",
            "--nav-icon-color":      "#38bdf8"
        }
    },

    ember: {
        label: "Ember",
        colors: ["#150a00","#2d1200","#7c2d12"],
        vars: {
            "--bg":                  "#150a00",
            "--surface":             "#1e0f00",
            "--surface2":            "#2d1200",
            "--surface3":            "#3d1a00",
            "--border":              "#4a2000",
            "--text":                "#fde8d8",
            "--text-dim":            "#a06040",
            "--text-muted":          "#4a2800",
            "--accent":              "#f97316",
            "--accent-dim":          "rgba(249,115,22,0.12)",
            "--accent-glow":         "rgba(249,115,22,0.28)",
            "--bg-gradient-1":       "#150a00",
            "--bg-gradient-2":       "#2d1200",
            "--bg-gradient-3":       "#7c2d12",
            "--bg-gradient-4":       "#150a00",
            "--btn-primary-bg":      "#f97316",
            "--btn-primary-hover":   "#ea6700",
            "--btn-secondary-bg":    "#2d1200",
            "--card-bg":             "#2d1200",
            "--card-hover-bg":       "#f97316",
            "--card-text":           "#fde8d8",
            "--nav-icon-color":      "#f97316"
        }
    },

    void: {
        label: "Void",
        colors: ["#000000","#050505","#0d0d0d"],
        vars: {
            "--bg":                  "#000000",
            "--surface":             "#080808",
            "--surface2":            "#0f0f0f",
            "--surface3":            "#161616",
            "--border":              "#1f1f1f",
            "--text":                "#cccccc",
            "--text-dim":            "#555555",
            "--text-muted":          "#2a2a2a",
            "--accent":              "#ffffff",
            "--accent-dim":          "rgba(255,255,255,0.07)",
            "--accent-glow":         "rgba(255,255,255,0.15)",
            "--bg-gradient-1":       "#000",
            "--bg-gradient-2":       "#050505",
            "--bg-gradient-3":       "#0d0d0d",
            "--bg-gradient-4":       "#000",
            "--btn-primary-bg":      "#ffffff",
            "--btn-primary-hover":   "#cccccc",
            "--btn-secondary-bg":    "#111",
            "--card-bg":             "#0f0f0f",
            "--card-hover-bg":       "#ffffff",
            "--card-text":           "#cccccc",
            "--nav-icon-color":      "#ffffff"
        }
    },

    forest: {
        label: "Forest",
        colors: ["#052e16","#14532d","#166534"],
        vars: {
            "--bg":                  "#052e16",
            "--surface":             "#083d1e",
            "--surface2":            "#0d4d26",
            "--surface3":            "#135e2e",
            "--border":              "#1a7a3a",
            "--text":                "#dcfce7",
            "--text-dim":            "#4ade80",
            "--text-muted":          "#14532d",
            "--accent":              "#4ade80",
            "--accent-dim":          "rgba(74,222,128,0.10)",
            "--accent-glow":         "rgba(74,222,128,0.28)",
            "--bg-gradient-1":       "#052e16",
            "--bg-gradient-2":       "#14532d",
            "--bg-gradient-3":       "#166534",
            "--bg-gradient-4":       "#052e16",
            "--btn-primary-bg":      "#4ade80",
            "--btn-primary-hover":   "#22c55e",
            "--btn-secondary-bg":    "#0d2b18",
            "--card-bg":             "#0d4d26",
            "--card-hover-bg":       "#4ade80",
            "--card-text":           "#dcfce7",
            "--nav-icon-color":      "#4ade80"
        }
    },

    abyss: {
        label: "Abyss",
        colors: ["#020617","#0c1445","#1e1b4b"],
        vars: {
            "--bg":                  "#020617",
            "--surface":             "#070d2a",
            "--surface2":            "#0c1445",
            "--surface3":            "#131b58",
            "--border":              "#1e2566",
            "--text":                "#e0e7ff",
            "--text-dim":            "#6366f1",
            "--text-muted":          "#1e2566",
            "--accent":              "#818cf8",
            "--accent-dim":          "rgba(129,140,248,0.10)",
            "--accent-glow":         "rgba(129,140,248,0.28)",
            "--bg-gradient-1":       "#020617",
            "--bg-gradient-2":       "#0c1445",
            "--bg-gradient-3":       "#1e1b4b",
            "--bg-gradient-4":       "#020617",
            "--btn-primary-bg":      "#818cf8",
            "--btn-primary-hover":   "#6366f1",
            "--btn-secondary-bg":    "#0e1130",
            "--card-bg":             "#0c1445",
            "--card-hover-bg":       "#818cf8",
            "--card-text":           "#e0e7ff",
            "--nav-icon-color":      "#818cf8"
        }
    },

    rose: {
        label: "Rose",
        colors: ["#1a0010","#3b0020","#881337"],
        vars: {
            "--bg":                  "#1a0010",
            "--surface":             "#220015",
            "--surface2":            "#2e001c",
            "--surface3":            "#3d0025",
            "--border":              "#5a0035",
            "--text":                "#ffe4e6",
            "--text-dim":            "#f43f5e",
            "--text-muted":          "#4c0026",
            "--accent":              "#fb7185",
            "--accent-dim":          "rgba(251,113,133,0.10)",
            "--accent-glow":         "rgba(251,113,133,0.28)",
            "--bg-gradient-1":       "#1a0010",
            "--bg-gradient-2":       "#3b0020",
            "--bg-gradient-3":       "#881337",
            "--bg-gradient-4":       "#1a0010",
            "--btn-primary-bg":      "#fb7185",
            "--btn-primary-hover":   "#f43f5e",
            "--btn-secondary-bg":    "#1e0010",
            "--card-bg":             "#2e001c",
            "--card-hover-bg":       "#fb7185",
            "--card-text":           "#ffe4e6",
            "--nav-icon-color":      "#fb7185"
        }
    },

    ash: {
        label: "Ash",
        colors: ["#111110","#1c1c1b","#292927"],
        vars: {
            "--bg":                  "#111110",
            "--surface":             "#161615",
            "--surface2":            "#1c1c1b",
            "--surface3":            "#222221",
            "--border":              "#2e2e2d",
            "--text":                "#d4d4d4",
            "--text-dim":            "#737373",
            "--text-muted":          "#3a3a38",
            "--accent":              "#d4d4d4",
            "--accent-dim":          "rgba(212,212,212,0.08)",
            "--accent-glow":         "rgba(212,212,212,0.18)",
            "--bg-gradient-1":       "#111110",
            "--bg-gradient-2":       "#1c1c1b",
            "--bg-gradient-3":       "#292927",
            "--bg-gradient-4":       "#111110",
            "--btn-primary-bg":      "#d4d4d4",
            "--btn-primary-hover":   "#a3a3a3",
            "--btn-secondary-bg":    "#1a1a18",
            "--card-bg":             "#1c1c1b",
            "--card-hover-bg":       "#d4d4d4",
            "--card-text":           "#d4d4d4",
            "--nav-icon-color":      "#d4d4d4"
        }
    },

    neon: {
        label: "Neon",
        colors: ["#09001a","#12003b","#1a0060"],
        vars: {
            "--bg":                  "#09001a",
            "--surface":             "#0e0025",
            "--surface2":            "#14003a",
            "--surface3":            "#1a0050",
            "--border":              "#2d0080",
            "--text":                "#f0e6ff",
            "--text-dim":            "#b300ff",
            "--text-muted":          "#2d0060",
            "--accent":              "#ff00ff",
            "--accent-dim":          "rgba(255,0,255,0.10)",
            "--accent-glow":         "rgba(255,0,255,0.30)",
            "--bg-gradient-1":       "#09001a",
            "--bg-gradient-2":       "#12003b",
            "--bg-gradient-3":       "#1a0060",
            "--bg-gradient-4":       "#09001a",
            "--btn-primary-bg":      "#ff00ff",
            "--btn-primary-hover":   "#e600e6",
            "--btn-secondary-bg":    "#100020",
            "--card-bg":             "#14003a",
            "--card-hover-bg":       "#ff00ff",
            "--card-text":           "#f0e6ff",
            "--nav-icon-color":      "#ff00ff"
        }
    },

    copper: {
        label: "Copper",
        colors: ["#1a0f00","#2d1f00","#7c4a03"],
        vars: {
            "--bg":                  "#1a0f00",
            "--surface":             "#221400",
            "--surface2":            "#2d1f00",
            "--surface3":            "#3d2900",
            "--border":              "#5a3d00",
            "--text":                "#fef3c7",
            "--text-dim":            "#d97706",
            "--text-muted":          "#4a3000",
            "--accent":              "#d97706",
            "--accent-dim":          "rgba(217,119,6,0.12)",
            "--accent-glow":         "rgba(217,119,6,0.28)",
            "--bg-gradient-1":       "#1a0f00",
            "--bg-gradient-2":       "#2d1f00",
            "--bg-gradient-3":       "#7c4a03",
            "--bg-gradient-4":       "#1a0f00",
            "--btn-primary-bg":      "#d97706",
            "--btn-primary-hover":   "#b45309",
            "--btn-secondary-bg":    "#1f1200",
            "--card-bg":             "#2d1f00",
            "--card-hover-bg":       "#d97706",
            "--card-text":           "#fef3c7",
            "--nav-icon-color":      "#d97706"
        }
    },

    arctic: {
        label: "Arctic",
        colors: ["#ecfeff","#cffafe","#a5f3fc"],
        vars: {
            "--bg":                  "#f0feff",
            "--surface":             "#e8fdfF",
            "--surface2":            "#cffafe",
            "--surface3":            "#b8f5fc",
            "--border":              "#7de8f5",
            "--text":                "#0e4f5c",
            "--text-dim":            "#0891b2",
            "--text-muted":          "#a5d8e0",
            "--accent":              "#0891b2",
            "--accent-dim":          "rgba(8,145,178,0.10)",
            "--accent-glow":         "rgba(8,145,178,0.25)",
            "--bg-gradient-1":       "#ecfeff",
            "--bg-gradient-2":       "#cffafe",
            "--bg-gradient-3":       "#a5f3fc",
            "--bg-gradient-4":       "#ecfeff",
            "--btn-primary-bg":      "#0891b2",
            "--btn-primary-hover":   "#0e7490",
            "--btn-secondary-bg":    "#e0f7fa",
            "--card-bg":             "#cffafe",
            "--card-hover-bg":       "#0891b2",
            "--card-text":           "#0e4f5c",
            "--nav-icon-color":      "#0891b2"
        }
    },

    carbon: {
        label: "Carbon",
        colors: ["#141414","#1f1f1f","#2c2c2c"],
        vars: {
            "--bg":                  "#141414",
            "--surface":             "#191919",
            "--surface2":            "#1f1f1f",
            "--surface3":            "#272727",
            "--border":              "#333333",
            "--text":                "#e5e5e5",
            "--text-dim":            "#888888",
            "--text-muted":          "#404040",
            "--accent":              "#ef4444",
            "--accent-dim":          "rgba(239,68,68,0.10)",
            "--accent-glow":         "rgba(239,68,68,0.28)",
            "--bg-gradient-1":       "#141414",
            "--bg-gradient-2":       "#1f1f1f",
            "--bg-gradient-3":       "#2c2c2c",
            "--bg-gradient-4":       "#141414",
            "--btn-primary-bg":      "#ef4444",
            "--btn-primary-hover":   "#dc2626",
            "--btn-secondary-bg":    "#1a1a1a",
            "--card-bg":             "#1f1f1f",
            "--card-hover-bg":       "#ef4444",
            "--card-text":           "#e5e5e5",
            "--nav-icon-color":      "#ef4444"
        }
    }
};


(function restoreTheme() {
    var name  = localStorage.getItem("nrg_theme_selected") || "midnight";
    var theme = themes[name];
    if (!theme) return;
    Object.keys(theme.vars).forEach(function(key) {
        var saved = localStorage.getItem("nrg_theme_" + key);
        document.documentElement.style.setProperty(key, saved || theme.vars[key]);
    });
})();


function applyTheme(name) {
    var theme = themes[name];
    if (!theme) return;
    Object.keys(theme.vars).forEach(function(key) {
        document.documentElement.style.setProperty(key, theme.vars[key]);
        localStorage.setItem("nrg_theme_" + key, theme.vars[key]);
    });
    localStorage.setItem("nrg_theme_selected", name);
}

function applyThemeDefault() { applyTheme("midnight"); }

window.resetTheme = function() {
    _selectedTheme = "midnight";
    applyTheme("midnight");
    buildThemeGrid();
    if (typeof toast === "function") toast("theme reset");
};


var _selectedTheme = localStorage.getItem("nrg_theme_selected") || "midnight";

function buildThemeGrid() {
    var grid = document.getElementById("theme-grid");
    if (!grid) return;
    grid.innerHTML = "";
    Object.keys(themes).forEach(function(key) {
        var t    = themes[key];
        var card = document.createElement("div");
        card.className = "theme-card" + (key === _selectedTheme ? " selected" : "");
        card.setAttribute("data-theme-key", key);
        card.onclick = function() {
            _selectedTheme = key;
            document.querySelectorAll(".theme-card").forEach(function(c) { c.classList.remove("selected"); });
            card.classList.add("selected");
        };
        var gradient = "linear-gradient(135deg," + t.colors[0] + " 0%," + t.colors[1] + " 50%," + t.colors[2] + " 100%)";
        card.innerHTML =
            '<div class="theme-swatch" style="background:' + gradient + '"></div>' +
            '<div class="theme-name">' + t.label + '</div>';
        grid.appendChild(card);
    });
}

function _saveThemeToFirestore(themeName) {
    if (!window._nrgFirebase) return;
    var db        = window._nrgFirebase.db;
    var uid       = window._nrgFirebase.uid;
    var updateDoc = window._nrgFirebase.updateDoc;
    var doc       = window._nrgFirebase.doc;
    if (!db || !uid || !updateDoc || !doc) return;
    updateDoc(doc(db, "users", uid), { theme: themeName }).catch(function(){});
}

function applySelectedTheme() {
    applyTheme(_selectedTheme);
    var label = (themes[_selectedTheme] && themes[_selectedTheme].label) || _selectedTheme;
    if (typeof toast === "function") toast("theme: " + label.toLowerCase());
    _saveThemeToFirestore(_selectedTheme);
}

function resetThemeToDefault() {
    _selectedTheme = "midnight";
    applyTheme("midnight");
    buildThemeGrid();
    if (typeof toast === "function") toast("theme reset");
    _saveThemeToFirestore("midnight");
}

// gay son or thot daugher procedure

const MAINTENANCE_MODE = false; 

if (MAINTENANCE_MODE) {
  window.location.replace("maintance.html");
}

(function passiveEarning() {
  var TICK_MS        = 5 * 60 * 1000;
  var XP_PER_TICK    = 5;
  var COINS_PER_TICK = 2;
  var MAX_TICKS_DAY  = 12;
  var DAY_KEY        = "nrg_passive_day";
  var TICKS_KEY      = "nrg_passive_ticks";

  function todayStr() { return new Date().toDateString(); }

  function getTicksToday() {
    if (localStorage.getItem(DAY_KEY) !== todayStr()) {
      localStorage.setItem(DAY_KEY, todayStr());
      localStorage.setItem(TICKS_KEY, "0");
      return 0;
    }
    return parseInt(localStorage.getItem(TICKS_KEY) || "0");
  }

  function incrementTicks() {
    var t = getTicksToday() + 1;
    localStorage.setItem(TICKS_KEY, String(t));
    return t;
  }

  function showPassiveToast(xp, coins, mult) {
    var existing = document.getElementById("nrg-passive-toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.id  = "nrg-passive-toast";
    el.style.cssText = "position:fixed;bottom:24px;left:24px;z-index:99999;background:var(--surface,#111);border:1px solid var(--border,#2a2a2a);border-left:2px solid var(--accent,#c50cf9);border-radius:4px;padding:10px 16px;display:flex;align-items:center;gap:12px;font-family:'Space Mono',monospace;font-size:10px;opacity:0;transform:translateY(8px);transition:opacity 0.25s,transform 0.25s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.4)";
    var boostHtml = mult > 1 ? '<span style="font-size:8px;color:var(--accent,#c50cf9);border:1px solid rgba(197,12,249,0.3);padding:1px 5px;border-radius:2px;margin-left:4px">' + mult + 'x</span>' : "";
    el.innerHTML = '<span style="color:var(--text-muted,#3a3a3a);letter-spacing:0.12em;font-size:8px">PASSIVE</span><span style="color:#c50cf9;font-weight:700">+' + xp + ' XP' + boostHtml + '</span><span style="color:#f5c518;font-weight:700">+' + coins + ' &#9733;</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
    });
    setTimeout(function() {
      el.style.opacity = "0"; el.style.transform = "translateY(8px)";
      setTimeout(function() { if (el.parentNode) el.remove(); }, 300);
    }, 3500);
  }

  function doTick() {
    var fb = window._nrgFirebase;
    if (!fb || !fb.uid || !fb.db || !fb.updateDoc || !fb.doc || !fb.increment) return;
    if (getTicksToday() >= MAX_TICKS_DAY) return;

    var uid = fb.uid, db = fb.db, updateDoc = fb.updateDoc, doc = fb.doc, increment = fb.increment;

    fb.getDoc(doc(db, "users", uid)).then(function(snap) {
      if (!snap.exists()) return;
      var d = snap.data();
      var mult = 1;
      if (d.xpBoostActive && d.xpBoostExpiry && Date.now() < new Date(d.xpBoostExpiry).getTime()) {
        mult = d.xpBoostMult || 1;
      }
      var xpGain = Math.floor(XP_PER_TICK * mult);
      var THRESH = [0,0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000];
      var newXP  = (d.xp || 0) + xpGain;
      var level  = 1;
      for (var i = 1; i < THRESH.length; i++) { if (newXP >= THRESH[i]) level = i; else break; }

      updateDoc(doc(db, "users", uid), { xp: newXP, level: level, coins: increment(COINS_PER_TICK) }).then(function() {
        incrementTicks();
        showPassiveToast(xpGain, COINS_PER_TICK, mult);
      }).catch(function(e) { console.error("passive earn:", e); });
    }).catch(function() {});
  }

  var _attempts = 0;
  function tryStart() {
    _attempts++;
    if (_attempts > 30) return;
    if (!window._nrgFirebase || !window._nrgFirebase.uid) { setTimeout(tryStart, 1000); return; }
    setInterval(doTick, TICK_MS);
  }
  setTimeout(tryStart, 2000);
})();
(function nrgNotifications() {
  var NOTIF_KEY = "nrg_notifications";
  var _queue    = [];
  var _visible  = [];
  var MAX_STACK = 4;
  var GAP       = 12;
  var HEIGHT    = 72;

  function injectStyles() {
    if (document.getElementById("nrg-notif-styles")) return;
    var s = document.createElement("style");
    s.id  = "nrg-notif-styles";
    s.textContent = [
      ".nrg-notif {",
        "position:fixed; right:20px; z-index:999999;",
        "background:var(--surface,#111);",
        "border:1px solid var(--border,#2a2a2a);",
        "border-left:3px solid var(--accent,#c50cf9);",
        "border-radius:5px;",
        "padding:12px 36px 12px 14px;",
        "min-width:260px; max-width:320px;",
        "box-shadow:0 8px 24px rgba(0,0,0,0.5);",
        "font-family:'Space Mono',monospace;",
        "transition:top 0.3s ease, opacity 0.25s, transform 0.25s;",
        "opacity:0; transform:translateX(20px);",
        "pointer-events:all;",
      "}",
      ".nrg-notif.show { opacity:1; transform:translateX(0); }",
      ".nrg-notif.hide { opacity:0; transform:translateX(24px); }",
      ".nrg-notif-close {",
        "position:absolute; top:8px; right:10px;",
        "background:none; border:none; cursor:pointer;",
        "color:var(--text-muted,#3a3a3a); font-size:14px; line-height:1;",
        "transition:color 0.13s; padding:2px;",
      "}",
      ".nrg-notif-close:hover { color:var(--text,#e8e8e8); }",
      ".nrg-notif-type {",
        "font-size:7px; letter-spacing:0.18em; text-transform:uppercase;",
        "margin-bottom:4px; font-weight:700;",
      "}",
      ".nrg-notif-title { font-size:11px; color:var(--text,#e8e8e8); margin-bottom:2px; }",
      ".nrg-notif-body  { font-size:9px; color:var(--text-dim,#666); letter-spacing:0.04em; line-height:1.5; }",
      ".nrg-notif-progress {",
        "position:absolute; bottom:0; left:0; height:2px;",
        "background:var(--accent,#c50cf9); border-radius:0 0 0 4px;",
        "transition:width linear;",
      "}",
      ".nrg-notif.type-friend  { border-left-color:#39d98a; }",
      ".nrg-notif.type-friend  .nrg-notif-type { color:#39d98a; }",
      ".nrg-notif.type-friend  .nrg-notif-progress { background:#39d98a; }",
      ".nrg-notif.type-xp      { border-left-color:#c50cf9; }",
      ".nrg-notif.type-xp      .nrg-notif-type { color:#c50cf9; }",
      ".nrg-notif.type-coins   { border-left-color:#f5c518; }",
      ".nrg-notif.type-coins   .nrg-notif-type { color:#f5c518; }",
      ".nrg-notif.type-coins   .nrg-notif-progress { background:#f5c518; }",
      ".nrg-notif.type-level   { border-left-color:#f5c518; }",
      ".nrg-notif.type-level   .nrg-notif-type { color:#f5c518; }",
      ".nrg-notif.type-level   .nrg-notif-progress { background:#f5c518; }",
      ".nrg-notif.type-system  { border-left-color:#4f9cf9; }",
      ".nrg-notif.type-system  .nrg-notif-type { color:#4f9cf9; }",
      ".nrg-notif.type-system  .nrg-notif-progress { background:#4f9cf9; }",
      ".nrg-notif.type-warning { border-left-color:#ff4f4f; }",
      ".nrg-notif.type-warning .nrg-notif-type { color:#ff4f4f; }",
      ".nrg-notif.type-warning .nrg-notif-progress { background:#ff4f4f; }",
    ].join("");
    document.head.appendChild(s);
  }

  function reposition() {
    var startTop = 20;
    _visible.forEach(function(el, i) {
      el.style.top = (startTop + i * (HEIGHT + GAP)) + "px";
    });
  }

  function removeNotif(el) {
    el.classList.remove("show");
    el.classList.add("hide");
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
      var idx = _visible.indexOf(el);
      if (idx !== -1) _visible.splice(idx, 1);
      reposition();
      if (_queue.length > 0) showNext(_queue.shift());
    }, 280);
  }

  function showNext(opts) {
    injectStyles();
    var duration = opts.duration || 5000;
    var type     = opts.type     || "system";
    var title    = opts.title    || "Notification";
    var body     = opts.body     || "";

    var el = document.createElement("div");
    el.className = "nrg-notif type-" + type;
    el.style.top = "20px";

    el.innerHTML =
      '<button class="nrg-notif-close" title="Close">&#215;</button>' +
      '<div class="nrg-notif-type">' + type + '</div>' +
      '<div class="nrg-notif-title">' + title + '</div>' +
      (body ? '<div class="nrg-notif-body">' + body + '</div>' : '') +
      '<div class="nrg-notif-progress" style="width:100%"></div>';

    document.body.appendChild(el);
    _visible.push(el);
    reposition();

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.classList.add("show");
        var prog = el.querySelector(".nrg-notif-progress");
        if (prog) {
          prog.style.transition = "width " + duration + "ms linear";
          requestAnimationFrame(function() { prog.style.width = "0%"; });
        }
      });
    });

    el.querySelector(".nrg-notif-close").addEventListener("click", function() {
      clearTimeout(el._autoClose);
      removeNotif(el);
    });

    el._autoClose = setTimeout(function() { removeNotif(el); }, duration);
  }

  function push(opts) {
    if (_visible.length >= MAX_STACK) {
      _queue.push(opts);
    } else {
      showNext(opts);
    }
  }

  window.NRGNotify = {
    show: function(opts) { push(opts); },
    friend:  function(title, body) { push({ type: "friend",  title: title, body: body }); },
    xp:      function(title, body) { push({ type: "xp",      title: title, body: body }); },
    coins:   function(title, body) { push({ type: "coins",   title: title, body: body }); },
    level:   function(title, body) { push({ type: "level",   title: title, body: body }); },
    system:  function(title, body) { push({ type: "system",  title: title, body: body }); },
    warning: function(title, body) { push({ type: "warning", title: title, body: body }); },
    test: function() {
      push({ type: "friend",  title: "Friend Request",      body: "@shadow wants to be friends." });
      setTimeout(function() { push({ type: "xp",     title: "XP Earned",  body: "+25 XP from playing Clash of Vikings." }); }, 600);
      setTimeout(function() { push({ type: "level",  title: "Level Up!",  body: "You reached Level 5." }); }, 1200);
      setTimeout(function() { push({ type: "coins",  title: "Coins",      body: "+10 coins from daily reward." }); }, 1800);
      setTimeout(function() { push({ type: "system", title: "Welcome back!", body: "You have 2 unread friend requests." }); }, 2400);
    }
  };

  console.log("%c[NRG] Notification system ready. Run NRGNotify.test() to preview.", "color:#c50cf9;font-family:monospace");
})();

(function nrgConsoleArt() {
  var lines = [
    " @@@@@@   @@@@@@@  @@@@@@   @@@@@@@  ",
    "@@@       @@@     @@@  @@@  @@@  @@@ ",
    " @@@@@@   @@@@@   @@@  @@@  @@@@@@@  ",
    "     @@@  @@@     @@@  @@@  @@@      ",
    " @@@@@@   @@@@@@@  @@@@@@   @@@      ",
    "",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    " @@@      @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@   @@@@@@@  @@ @@  @@@  @@@ ",
    "     @@@  @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    "",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    " @@@      @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@   @@@@@@@  @@ @@  @@@  @@@ ",
    "     @@@  @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    "",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    " @@@      @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@   @@@@@@@  @@ @@  @@@  @@@ ",
    "     @@@  @@@  @@@  @@@@   @@@  @@@ ",
    "  @@@@@@  @@@  @@@  @@ @@  @@@@@@@  ",
    "",
    " @@@@@@@   @@@@@@  @@@  @@@  @@@   @@@ @@@@@@@  ",
    "  @@@     @@@  @@@ @@@  @@@  @@@   @@@  @@@  @@@",
    "  @@@     @@@@@@@@ @@@@@@@    @@@@@@@   @@@@@@@  ",
    "  @@@     @@@  @@@  @@@  @@@   @@@@@    @@@  @@@ ",
    "  @@@     @@@  @@@  @@@  @@@    @@@     @@@  @@@ ",
    "",
    " @@@@@@   @@@@@@  @@@  @@@  @@@   @@@ @@@@@@@  ",
    "@@@      @@@  @@@ @@@  @@@  @@@   @@@  @@@  @@@",
    " @@@@@   @@@@@@@  @@@@@@@    @@@@@@@   @@@@@@@  ",
    "    @@@  @@@  @@@  @@@  @@@   @@@@@    @@@  @@@ ",
    "@@@@@@@  @@@  @@@  @@@  @@@    @@@     @@@  @@@ ",
  ];

  var purple = "color:#c50cf9;font-family:monospace;font-size:11px;line-height:1.3";
  var reset  = "color:inherit";

  lines.forEach(function(line) {
    if (line === "") {
      console.log("");
    } else {
      console.log("%c" + line, purple);
    }
  });

  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", purple);
  console.log("%c  NRG Platform  |  stop snooping around :)", "color:#666;font-family:monospace;font-size:11px");
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", purple);
})();