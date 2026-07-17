import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey:            "AIzaSyAKPXLTU0z18tsn80JCXJhJ62EEjDl7lqY",
  authDomain:        "sams-proxy-accounts.firebaseapp.com",
  projectId:         "sams-proxy-accounts",
  storageBucket:     "sams-proxy-accounts.firebasestorage.app",
  messagingSenderId: "969467601192",
  appId:             "1:969467601192:web:bd312dd3d58e4b6b7c701d"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);


async function createUserDoc(user) {
  const ref  = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || user.email.split("@")[0],
      photoURL:    user.photoURL    || null,
      createdAt:   serverTimestamp(),
      theme:       localStorage.getItem("sams_proxy_theme") || "midnight",
      favorites:   [],
      recentGames: []
    });
  }
}

async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}


async function doSignUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  // FIX: pass cred.user directly after awaiting updateProfile so displayName is set on the live object
  await createUserDoc(cred.user);
  return cred.user;
}

async function doLogIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await createUserDoc(cred.user);
  return cred.user;
}

async function doGoogleLogin() {
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  await createUserDoc(cred.user);
  return cred.user;
}

async function doLogOut() {
  await signOut(auth);
}

async function doResetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}


function friendlyError(code) {
  const map = {
    "auth/invalid-email":          "invalid email address.",
    "auth/user-not-found":         "no account with that email.",
    "auth/wrong-password":         "incorrect password.",
    "auth/invalid-credential":     "incorrect email or password.",
    "auth/email-already-in-use":   "email already registered — try logging in.",
    "auth/weak-password":          "password must be at least 6 characters.",
    "auth/too-many-requests":      "too many attempts — try again later.",
    "auth/popup-closed-by-user":   "popup closed before completing.",
    "auth/network-request-failed": "network error — check your connection.",
    "auth/cancelled-popup-request":"popup already open.",
  };
  return map[code] || `something went wrong (${code}).`;
}


function injectStyles() {
  if (document.getElementById("sams-proxy-auth-styles")) return;
  const style = document.createElement("style");
  style.id = "sams-proxy-auth-styles";
  style.textContent = `
    .sams-proxy-auth-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
      opacity: 0; pointer-events: none;
      transition: opacity 0.18s;
    }
    .sams-proxy-auth-overlay.open { opacity: 1; pointer-events: all; }

    .sams-proxy-auth-box {
      background: var(--surface, #111);
      border: 1px solid var(--border, #2a2a2a);
      border-top: 2px solid var(--accent, #c50cf9);
      border-radius: 5px;
      width: 90%; max-width: 370px;
      padding: 26px;
      font-family: 'DM Sans', var(--sans, sans-serif);
    }

    .sams-proxy-auth-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 18px; padding-bottom: 12px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .sams-proxy-auth-title {
      font-family: 'Space Mono', var(--mono, monospace);
      font-size: 12px; font-weight: 700;
      color: var(--text, #e8e8e8); letter-spacing: 0.06em;
    }
    .sams-proxy-auth-close {
      background: none; border: none;
      color: var(--text-dim, #666); cursor: pointer;
      font-size: 20px; line-height: 1; padding: 0 2px;
      transition: color 0.13s;
    }
    .sams-proxy-auth-close:hover { color: var(--text, #e8e8e8); }

    .sams-proxy-auth-tabs {
      display: flex; margin-bottom: 18px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .sams-proxy-auth-tab {
      flex: 1; padding: 8px 0; text-align: center;
      font-family: 'Space Mono', monospace;
      font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--text-muted, #3a3a3a); cursor: pointer;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      transition: color 0.13s, border-color 0.13s;
    }
    .sams-proxy-auth-tab.active {
      color: var(--accent, #c50cf9);
      border-bottom-color: var(--accent, #c50cf9);
    }

    .sams-proxy-auth-field { margin-bottom: 12px; }
    .sams-proxy-auth-field label {
      display: block; font-size: 11px;
      color: var(--text-dim, #666); margin-bottom: 5px;
    }
    .sams-proxy-auth-field input {
      width: 100%;
      background: var(--surface2, #1a1a1a);
      border: 1px solid var(--border, #2a2a2a);
      color: var(--text, #e8e8e8);
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      padding: 9px 12px; border-radius: 4px; outline: none;
      box-sizing: border-box; transition: border-color 0.15s;
    }
    .sams-proxy-auth-field input:focus { border-color: var(--accent, #c50cf9); }
    .sams-proxy-auth-field input::placeholder { color: var(--text-muted, #3a3a3a); }

    .sams-proxy-auth-btn {
      width: 100%; padding: 10px; border-radius: 4px; border: none;
      font-family: 'Space Mono', monospace;
      font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
      cursor: pointer; margin-bottom: 8px;
      box-sizing: border-box; transition: opacity 0.13s, border-color 0.13s, color 0.13s;
    }
    .sams-proxy-auth-btn.primary { background: var(--accent, #c50cf9); color: #000; }
    .sams-proxy-auth-btn.primary:hover { opacity: 0.86; }
    .sams-proxy-auth-btn.secondary {
      background: none; color: var(--text-dim, #666);
      border: 1px solid var(--border, #2a2a2a);
    }
    .sams-proxy-auth-btn.secondary:hover {
      border-color: var(--text-dim, #666);
      color: var(--text, #e8e8e8);
    }

    .sams-proxy-auth-divider {
      display: flex; align-items: center; gap: 10px;
      margin: 12px 0; color: var(--text-muted, #3a3a3a);
      font-size: 10px; font-family: 'Space Mono', monospace;
    }
    .sams-proxy-auth-divider::before,
    .sams-proxy-auth-divider::after {
      content: ""; flex: 1; height: 1px;
      background: var(--border, #2a2a2a);
    }

    .sams-proxy-auth-msg {
      font-size: 11px; text-align: center; margin-top: 8px;
      min-height: 16px; font-family: 'Space Mono', monospace;
      letter-spacing: 0.04em;
    }
    .sams-proxy-auth-msg.error   { color: #ff4f4f; }
    .sams-proxy-auth-msg.success { color: #39d98a; }
    .sams-proxy-auth-msg.loading { color: var(--text-muted, #3a3a3a); }

    .sams-proxy-auth-forgot {
      background: none; border: none; cursor: pointer;
      font-family: 'Space Mono', monospace;
      font-size: 10px; letter-spacing: 0.08em;
      color: var(--text-muted, #3a3a3a); margin-top: 2px;
      display: block; transition: color 0.13s;
    }
    .sams-proxy-auth-forgot:hover { color: var(--accent, #c50cf9); }

    /* topbar login btn */
    .sams-proxy-login-btn {
      font-family: 'Space Mono', monospace;
      font-size: 9px; letter-spacing: 0.15em;
      padding: 6px 14px; border-radius: 4px;
      border: 1px solid var(--border, #2a2a2a);
      background: none; color: var(--text-dim, #666);
      cursor: pointer; transition: border-color 0.13s, color 0.13s;
    }
    .sams-proxy-login-btn:hover {
      border-color: var(--accent, #c50cf9);
      color: var(--accent, #c50cf9);
    }

    /* topbar user btn */
    .sams-proxy-user-btn {
      display: none; align-items: center; gap: 8px;
      background: var(--surface2, #1a1a1a);
      border: 1px solid var(--border, #2a2a2a);
      color: var(--text-dim, #666);
      font-family: 'Space Mono', monospace; font-size: 9px;
      letter-spacing: 0.1em; padding: 5px 12px; border-radius: 4px;
      cursor: pointer; position: relative;
      transition: border-color 0.13s, color 0.13s;
    }
    .sams-proxy-user-btn:hover { border-color: var(--text-dim, #666); color: var(--text, #e8e8e8); }
    .sams-proxy-user-btn.visible { display: flex; }

    .sams-proxy-u-avatar {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--accent, #c50cf9);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: #000; font-weight: 700;
      flex-shrink: 0; overflow: hidden;
    }
    .sams-proxy-u-avatar img { width: 100%; height: 100%; object-fit: cover; }

    .sams-proxy-u-dropdown {
      position: absolute; top: calc(100% + 6px); right: 0;
      background: var(--surface, #111);
      border: 1px solid var(--border, #2a2a2a);
      border-radius: 4px; min-width: 175px;
      display: none; flex-direction: column; z-index: 100;
    }
    .sams-proxy-u-dropdown.open { display: flex; }

    .sams-proxy-u-header {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .sams-proxy-u-dname {
      display: block; font-size: 12px; font-weight: 500;
      color: var(--text, #e8e8e8); margin-bottom: 2px;
      font-family: 'DM Sans', sans-serif;
    }
    .sams-proxy-u-email {
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: var(--text-dim, #666); display: block;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 155px;
    }
    .sams-proxy-u-item {
      padding: 9px 14px; border: none; background: none; width: 100%;
      text-align: left; cursor: pointer;
      font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
      color: var(--text-dim, #666); transition: background 0.1s, color 0.1s;
    }
    .sams-proxy-u-item:hover { background: var(--surface2, #1a1a1a); color: var(--text, #e8e8e8); }
    .sams-proxy-u-item.danger:hover { color: #ff4f4f; }
    .sams-proxy-u-sep { height: 1px; background: var(--border, #2a2a2a); margin: 2px 0; }
  `;
  document.head.appendChild(style);
}


function buildModal() {
  const el = document.createElement("div");
  el.className = "sams-proxy-auth-overlay";
  el.id = "sams-proxy-auth-overlay";
  el.innerHTML = `
    <div class="sams-proxy-auth-box">
      <div class="sams-proxy-auth-header">
        <span class="sams-proxy-auth-title" id="sams-proxy-auth-title">Sign in to sams proxy</span>
        <button class="sams-proxy-auth-close" id="sams-proxy-auth-close">×</button>
      </div>
      <div class="sams-proxy-auth-tabs">
        <div class="sams-proxy-auth-tab active" data-tab="login">Login</div>
        <div class="sams-proxy-auth-tab" data-tab="signup">Sign Up</div>
      </div>

      <div id="sams-proxy-pane-login">
        <div class="sams-proxy-auth-field">
          <label>Email</label>
          <input type="email" id="sams-proxy-l-email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="sams-proxy-auth-field">
          <label>Password</label>
          <input type="password" id="sams-proxy-l-pass" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="sams-proxy-auth-btn primary" id="sams-proxy-l-submit">LOGIN</button>
        <button class="sams-proxy-auth-forgot" id="sams-proxy-l-forgot">forgot password?</button>
        <div class="sams-proxy-auth-divider">or</div>
        <button class="sams-proxy-auth-btn secondary" id="sams-proxy-l-google">continue with Google</button>
        <div class="sams-proxy-auth-msg" id="sams-proxy-l-msg"></div>
      </div>

      <div id="sams-proxy-pane-signup" style="display:none">
        <div class="sams-proxy-auth-field">
          <label>Display Name</label>
          <input type="text" id="sams-proxy-s-name" placeholder="your name" autocomplete="name">
        </div>
        <div class="sams-proxy-auth-field">
          <label>Email</label>
          <input type="email" id="sams-proxy-s-email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="sams-proxy-auth-field">
          <label>Password</label>
          <input type="password" id="sams-proxy-s-pass" placeholder="min 6 characters" autocomplete="new-password">
        </div>
        <button class="sams-proxy-auth-btn primary" id="sams-proxy-s-submit">CREATE ACCOUNT</button>
        <div class="sams-proxy-auth-divider">or</div>
        <button class="sams-proxy-auth-btn secondary" id="sams-proxy-s-google">continue with Google</button>
        <div class="sams-proxy-auth-msg" id="sams-proxy-s-msg"></div>
      </div>
    </div>`;
  document.body.appendChild(el);
  return el;
}

function buildTopbarBtn() {
  const target = document.querySelector(".topbar-right") || document.querySelector(".topbar");
  if (!target) return;

  const loginBtn = document.createElement("button");
  loginBtn.className = "sams-proxy-login-btn";
  loginBtn.id = "sams-proxy-topbar-login";
  loginBtn.textContent = "LOGIN";
  target.prepend(loginBtn);

  const userBtn = document.createElement("div");
  userBtn.className = "sams-proxy-user-btn";
  userBtn.id = "sams-proxy-topbar-user";
  userBtn.innerHTML = `
    <div class="sams-proxy-u-avatar" id="sams-proxy-u-avatar">?</div>
    <span id="sams-proxy-u-name">user</span>
    <div class="sams-proxy-u-dropdown" id="sams-proxy-u-dropdown">
      <div class="sams-proxy-u-header">
        <strong class="sams-proxy-u-dname" id="sams-proxy-u-dname">—</strong>
        <span class="sams-proxy-u-email" id="sams-proxy-u-email">—</span>
      </div>
      <button class="sams-proxy-u-item" id="sams-proxy-u-account">account</button>
      <button class="sams-proxy-u-item" id="sams-proxy-u-settings">settings</button>
      <button class="sams-proxy-u-item" id="sams-proxy-u-favs">favorites</button>
      <div class="sams-proxy-u-sep"></div>
      <button class="sams-proxy-u-item danger" id="sams-proxy-u-logout">log out</button>
    </div>`;
  target.prepend(userBtn);
}


function $ (id) { return document.getElementById(id); }

function setMsg(id, text, type) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.className = "sams-proxy-auth-msg " + type;
}

function openModal(tab = "login") {
  $("sams-proxy-auth-overlay")?.classList.add("open");
  switchTab(tab);
}

function closeModal() {
  $("sams-proxy-auth-overlay")?.classList.remove("open");
  ["sams-proxy-l-msg","sams-proxy-s-msg"].forEach(id => {
    const el = $(id); if (el) { el.textContent = ""; el.className = "sams-proxy-auth-msg"; }
  });
}

function switchTab(tab) {
  document.querySelectorAll(".sams-proxy-auth-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
  $("sams-proxy-pane-login").style.display  = tab === "login"  ? "" : "none";
  $("sams-proxy-pane-signup").style.display = tab === "signup" ? "" : "none";
  $("sams-proxy-auth-title").textContent = tab === "login" ? "Sign in to sams proxy" : "Create sams proxy account";
}

function setLoading(btnId, msgId, loading, label) {
  const btn = $(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? "..." : label;
  if (!loading && msgId) {
    const el = $(msgId); if (el) { el.textContent = ""; el.className = "sams-proxy-auth-msg"; }
  }
}

function updateTopbar(user) {
  const loginBtn = $("sams-proxy-topbar-login");
  const userBtn  = $("sams-proxy-topbar-user");
  if (!loginBtn || !userBtn) return;

  if (user) {
    loginBtn.style.display = "none";
    userBtn.classList.add("visible");

    const av = $("sams-proxy-u-avatar");
    if (user.photoURL) {
      av.innerHTML = `<img src="${user.photoURL}" alt="">`;
    } else {
      av.textContent = (user.displayName || user.email || "?")[0].toUpperCase();
    }
    const name = user.displayName || user.email.split("@")[0];
    $("sams-proxy-u-name").textContent  = name;
    $("sams-proxy-u-dname").textContent = name;
    $("sams-proxy-u-email").textContent = user.email;

    getUserDoc(user.uid).then(data => {
      if (data?.theme) {
        const local = localStorage.getItem('sams_proxy_theme');
        const themeToUse = local || data.theme;
        localStorage.setItem('sams_proxy_theme', themeToUse);
        if (typeof applyTheme === 'function') applyTheme(themeToUse);
      }
    }).catch(() => {});

  } else {
    loginBtn.style.display = "";
    userBtn.classList.remove("visible");
  }
}

function init() {
  injectStyles();
  buildModal();
  buildTopbarBtn();


  document.querySelectorAll(".sams-proxy-auth-tab").forEach(t =>
    t.addEventListener("click", () => switchTab(t.dataset.tab))
  );

  $("sams-proxy-auth-close").addEventListener("click", closeModal);
  $("sams-proxy-auth-overlay").addEventListener("click", e => {
    if (e.target === $("sams-proxy-auth-overlay")) closeModal();
  });


  $("sams-proxy-l-pass").addEventListener("keydown", e => { if (e.key === "Enter") $("sams-proxy-l-submit").click(); });
  $("sams-proxy-s-pass").addEventListener("keydown", e => { if (e.key === "Enter") $("sams-proxy-s-submit").click(); });

  $("sams-proxy-topbar-login").addEventListener("click", () => openModal("login"));


  $("sams-proxy-l-submit").addEventListener("click", async () => {
    const email = $("sams-proxy-l-email").value.trim();
    const pass  = $("sams-proxy-l-pass").value;
    if (!email || !pass) { setMsg("sams-proxy-l-msg", "fill in all fields.", "error"); return; }
    setLoading("sams-proxy-l-submit", null, true, "LOGIN");
    try {
      await doLogIn(email, pass);
      closeModal();
    } catch(e) {
      setMsg("sams-proxy-l-msg", friendlyError(e.code), "error");
    } finally {
      setLoading("sams-proxy-l-submit", null, false, "LOGIN");
    }
  });


  $("sams-proxy-s-submit").addEventListener("click", async () => {
    const name  = $("sams-proxy-s-name").value.trim();
    const email = $("sams-proxy-s-email").value.trim();
    const pass  = $("sams-proxy-s-pass").value;
    if (!name || !email || !pass) { setMsg("sams-proxy-s-msg", "fill in all fields.", "error"); return; }
    if (pass.length < 6) { setMsg("sams-proxy-s-msg", "password must be at least 6 characters.", "error"); return; }
    setLoading("sams-proxy-s-submit", null, true, "CREATE ACCOUNT");
    try {
      await doSignUp(email, pass, name);
      setMsg("sams-proxy-s-msg", "account created! welcome to sams proxy.", "success");
      setTimeout(closeModal, 1200);
    } catch(e) {
      setMsg("sams-proxy-s-msg", friendlyError(e.code), "error");
    } finally {
      setLoading("sams-proxy-s-submit", null, false, "CREATE ACCOUNT");
    }
  });


  async function handleGoogle(msgId) {
    try {
      await doGoogleLogin();
      closeModal();
    } catch(e) {
      if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
        setMsg(msgId, friendlyError(e.code), "error");
      }
    }
  }
  $("sams-proxy-l-google").addEventListener("click", () => handleGoogle("sams-proxy-l-msg"));
  $("sams-proxy-s-google").addEventListener("click", () => handleGoogle("sams-proxy-s-msg"));


  $("sams-proxy-l-forgot").addEventListener("click", async () => {
    const email = $("sams-proxy-l-email").value.trim();
    if (!email) { setMsg("sams-proxy-l-msg", "enter your email above first.", "error"); return; }
    try {
      await doResetPassword(email);
      setMsg("sams-proxy-l-msg", "reset email sent — check your inbox.", "success");
    } catch(e) {
      setMsg("sams-proxy-l-msg", friendlyError(e.code), "error");
    }
  });


  $("sams-proxy-topbar-user").addEventListener("click", e => {
    e.stopPropagation();
    $("sams-proxy-u-dropdown").classList.toggle("open");
  });
  document.addEventListener("click", () => $("sams-proxy-u-dropdown")?.classList.remove("open"));

  $("sams-proxy-u-logout").addEventListener("click",   async () => { await doLogOut(); });
  $("sams-proxy-u-account").addEventListener("click",  () => { window.location.href = "/accounts.html"; });
  $("sams-proxy-u-settings").addEventListener("click", () => { window.location.href = "/settings.html"; });
  $("sams-proxy-u-favs").addEventListener("click",     () => { window.location.href = "/games.html?favorites=1"; });


  onAuthStateChanged(auth, updateTopbar);


  window.SamsProxyAuth = {
    open:    openModal,
    close:   closeModal,
    logOut:  doLogOut,
    get currentUser() { return auth.currentUser; }
  };
}

init();
