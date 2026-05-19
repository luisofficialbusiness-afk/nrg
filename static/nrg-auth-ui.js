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
  authDomain:        "nrg-accounts.firebaseapp.com",
  projectId:         "nrg-accounts",
  storageBucket:     "nrg-accounts.firebasestorage.app",
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
      theme:       localStorage.getItem("nrg_theme_selected") || "midnight",
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
  if (document.getElementById("nrg-auth-styles")) return;
  const style = document.createElement("style");
  style.id = "nrg-auth-styles";
  style.textContent = `
    .nrg-auth-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
      opacity: 0; pointer-events: none;
      transition: opacity 0.18s;
    }
    .nrg-auth-overlay.open { opacity: 1; pointer-events: all; }

    .nrg-auth-box {
      background: var(--surface, #111);
      border: 1px solid var(--border, #2a2a2a);
      border-top: 2px solid var(--accent, #c50cf9);
      border-radius: 5px;
      width: 90%; max-width: 370px;
      padding: 26px;
      font-family: 'DM Sans', var(--sans, sans-serif);
    }

    .nrg-auth-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 18px; padding-bottom: 12px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .nrg-auth-title {
      font-family: 'Space Mono', var(--mono, monospace);
      font-size: 12px; font-weight: 700;
      color: var(--text, #e8e8e8); letter-spacing: 0.06em;
    }
    .nrg-auth-close {
      background: none; border: none;
      color: var(--text-dim, #666); cursor: pointer;
      font-size: 20px; line-height: 1; padding: 0 2px;
      transition: color 0.13s;
    }
    .nrg-auth-close:hover { color: var(--text, #e8e8e8); }

    .nrg-auth-tabs {
      display: flex; margin-bottom: 18px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .nrg-auth-tab {
      flex: 1; padding: 8px 0; text-align: center;
      font-family: 'Space Mono', monospace;
      font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--text-muted, #3a3a3a); cursor: pointer;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      transition: color 0.13s, border-color 0.13s;
    }
    .nrg-auth-tab.active {
      color: var(--accent, #c50cf9);
      border-bottom-color: var(--accent, #c50cf9);
    }

    .nrg-auth-field { margin-bottom: 12px; }
    .nrg-auth-field label {
      display: block; font-size: 11px;
      color: var(--text-dim, #666); margin-bottom: 5px;
    }
    .nrg-auth-field input {
      width: 100%;
      background: var(--surface2, #1a1a1a);
      border: 1px solid var(--border, #2a2a2a);
      color: var(--text, #e8e8e8);
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      padding: 9px 12px; border-radius: 4px; outline: none;
      box-sizing: border-box; transition: border-color 0.15s;
    }
    .nrg-auth-field input:focus { border-color: var(--accent, #c50cf9); }
    .nrg-auth-field input::placeholder { color: var(--text-muted, #3a3a3a); }

    .nrg-auth-btn {
      width: 100%; padding: 10px; border-radius: 4px; border: none;
      font-family: 'Space Mono', monospace;
      font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
      cursor: pointer; margin-bottom: 8px;
      box-sizing: border-box; transition: opacity 0.13s, border-color 0.13s, color 0.13s;
    }
    .nrg-auth-btn.primary { background: var(--accent, #c50cf9); color: #000; }
    .nrg-auth-btn.primary:hover { opacity: 0.86; }
    .nrg-auth-btn.secondary {
      background: none; color: var(--text-dim, #666);
      border: 1px solid var(--border, #2a2a2a);
    }
    .nrg-auth-btn.secondary:hover {
      border-color: var(--text-dim, #666);
      color: var(--text, #e8e8e8);
    }

    .nrg-auth-divider {
      display: flex; align-items: center; gap: 10px;
      margin: 12px 0; color: var(--text-muted, #3a3a3a);
      font-size: 10px; font-family: 'Space Mono', monospace;
    }
    .nrg-auth-divider::before,
    .nrg-auth-divider::after {
      content: ""; flex: 1; height: 1px;
      background: var(--border, #2a2a2a);
    }

    .nrg-auth-msg {
      font-size: 11px; text-align: center; margin-top: 8px;
      min-height: 16px; font-family: 'Space Mono', monospace;
      letter-spacing: 0.04em;
    }
    .nrg-auth-msg.error   { color: #ff4f4f; }
    .nrg-auth-msg.success { color: #39d98a; }
    .nrg-auth-msg.loading { color: var(--text-muted, #3a3a3a); }

    .nrg-auth-forgot {
      background: none; border: none; cursor: pointer;
      font-family: 'Space Mono', monospace;
      font-size: 10px; letter-spacing: 0.08em;
      color: var(--text-muted, #3a3a3a); margin-top: 2px;
      display: block; transition: color 0.13s;
    }
    .nrg-auth-forgot:hover { color: var(--accent, #c50cf9); }

    /* topbar login btn */
    .nrg-login-btn {
      font-family: 'Space Mono', monospace;
      font-size: 9px; letter-spacing: 0.15em;
      padding: 6px 14px; border-radius: 4px;
      border: 1px solid var(--border, #2a2a2a);
      background: none; color: var(--text-dim, #666);
      cursor: pointer; transition: border-color 0.13s, color 0.13s;
    }
    .nrg-login-btn:hover {
      border-color: var(--accent, #c50cf9);
      color: var(--accent, #c50cf9);
    }

    /* topbar user btn */
    .nrg-user-btn {
      display: none; align-items: center; gap: 8px;
      background: var(--surface2, #1a1a1a);
      border: 1px solid var(--border, #2a2a2a);
      color: var(--text-dim, #666);
      font-family: 'Space Mono', monospace; font-size: 9px;
      letter-spacing: 0.1em; padding: 5px 12px; border-radius: 4px;
      cursor: pointer; position: relative;
      transition: border-color 0.13s, color 0.13s;
    }
    .nrg-user-btn:hover { border-color: var(--text-dim, #666); color: var(--text, #e8e8e8); }
    .nrg-user-btn.visible { display: flex; }

    .nrg-u-avatar {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--accent, #c50cf9);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: #000; font-weight: 700;
      flex-shrink: 0; overflow: hidden;
    }
    .nrg-u-avatar img { width: 100%; height: 100%; object-fit: cover; }

    .nrg-u-dropdown {
      position: absolute; top: calc(100% + 6px); right: 0;
      background: var(--surface, #111);
      border: 1px solid var(--border, #2a2a2a);
      border-radius: 4px; min-width: 175px;
      display: none; flex-direction: column; z-index: 100;
    }
    .nrg-u-dropdown.open { display: flex; }

    .nrg-u-header {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border, #2a2a2a);
    }
    .nrg-u-dname {
      display: block; font-size: 12px; font-weight: 500;
      color: var(--text, #e8e8e8); margin-bottom: 2px;
      font-family: 'DM Sans', sans-serif;
    }
    .nrg-u-email {
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: var(--text-dim, #666); display: block;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 155px;
    }
    .nrg-u-item {
      padding: 9px 14px; border: none; background: none; width: 100%;
      text-align: left; cursor: pointer;
      font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
      color: var(--text-dim, #666); transition: background 0.1s, color 0.1s;
    }
    .nrg-u-item:hover { background: var(--surface2, #1a1a1a); color: var(--text, #e8e8e8); }
    .nrg-u-item.danger:hover { color: #ff4f4f; }
    .nrg-u-sep { height: 1px; background: var(--border, #2a2a2a); margin: 2px 0; }
  `;
  document.head.appendChild(style);
}


function buildModal() {
  const el = document.createElement("div");
  el.className = "nrg-auth-overlay";
  el.id = "nrg-auth-overlay";
  el.innerHTML = `
    <div class="nrg-auth-box">
      <div class="nrg-auth-header">
        <span class="nrg-auth-title" id="nrg-auth-title">Sign in to NRG</span>
        <button class="nrg-auth-close" id="nrg-auth-close">×</button>
      </div>
      <div class="nrg-auth-tabs">
        <div class="nrg-auth-tab active" data-tab="login">Login</div>
        <div class="nrg-auth-tab" data-tab="signup">Sign Up</div>
      </div>

      <div id="nrg-pane-login">
        <div class="nrg-auth-field">
          <label>Email</label>
          <input type="email" id="nrg-l-email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="nrg-auth-field">
          <label>Password</label>
          <input type="password" id="nrg-l-pass" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="nrg-auth-btn primary" id="nrg-l-submit">LOGIN</button>
        <button class="nrg-auth-forgot" id="nrg-l-forgot">forgot password?</button>
        <div class="nrg-auth-divider">or</div>
        <button class="nrg-auth-btn secondary" id="nrg-l-google">continue with Google</button>
        <div class="nrg-auth-msg" id="nrg-l-msg"></div>
      </div>

      <div id="nrg-pane-signup" style="display:none">
        <div class="nrg-auth-field">
          <label>Display Name</label>
          <input type="text" id="nrg-s-name" placeholder="your name" autocomplete="name">
        </div>
        <div class="nrg-auth-field">
          <label>Email</label>
          <input type="email" id="nrg-s-email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="nrg-auth-field">
          <label>Password</label>
          <input type="password" id="nrg-s-pass" placeholder="min 6 characters" autocomplete="new-password">
        </div>
        <button class="nrg-auth-btn primary" id="nrg-s-submit">CREATE ACCOUNT</button>
        <div class="nrg-auth-divider">or</div>
        <button class="nrg-auth-btn secondary" id="nrg-s-google">continue with Google</button>
        <div class="nrg-auth-msg" id="nrg-s-msg"></div>
      </div>
    </div>`;
  document.body.appendChild(el);
  return el;
}

function buildTopbarBtn() {
  const target = document.querySelector(".topbar-right") || document.querySelector(".topbar");
  if (!target) return;

  const loginBtn = document.createElement("button");
  loginBtn.className = "nrg-login-btn";
  loginBtn.id = "nrg-topbar-login";
  loginBtn.textContent = "LOGIN";
  target.prepend(loginBtn);

  const userBtn = document.createElement("div");
  userBtn.className = "nrg-user-btn";
  userBtn.id = "nrg-topbar-user";
  userBtn.innerHTML = `
    <div class="nrg-u-avatar" id="nrg-u-avatar">?</div>
    <span id="nrg-u-name">user</span>
    <div class="nrg-u-dropdown" id="nrg-u-dropdown">
      <div class="nrg-u-header">
        <strong class="nrg-u-dname" id="nrg-u-dname">—</strong>
        <span class="nrg-u-email" id="nrg-u-email">—</span>
      </div>
      <button class="nrg-u-item" id="nrg-u-account">account</button>
      <button class="nrg-u-item" id="nrg-u-settings">settings</button>
      <button class="nrg-u-item" id="nrg-u-favs">favorites</button>
      <div class="nrg-u-sep"></div>
      <button class="nrg-u-item danger" id="nrg-u-logout">log out</button>
    </div>`;
  target.prepend(userBtn);
}


function $ (id) { return document.getElementById(id); }

function setMsg(id, text, type) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.className = "nrg-auth-msg " + type;
}

function openModal(tab = "login") {
  $("nrg-auth-overlay")?.classList.add("open");
  switchTab(tab);
}

function closeModal() {
  $("nrg-auth-overlay")?.classList.remove("open");
  ["nrg-l-msg","nrg-s-msg"].forEach(id => {
    const el = $(id); if (el) { el.textContent = ""; el.className = "nrg-auth-msg"; }
  });
}

function switchTab(tab) {
  document.querySelectorAll(".nrg-auth-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
  $("nrg-pane-login").style.display  = tab === "login"  ? "" : "none";
  $("nrg-pane-signup").style.display = tab === "signup" ? "" : "none";
  $("nrg-auth-title").textContent = tab === "login" ? "Sign in to NRG" : "Create NRG account";
}

function setLoading(btnId, msgId, loading, label) {
  const btn = $(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? "..." : label;
  if (!loading && msgId) {
    const el = $(msgId); if (el) { el.textContent = ""; el.className = "nrg-auth-msg"; }
  }
}

function updateTopbar(user) {
  const loginBtn = $("nrg-topbar-login");
  const userBtn  = $("nrg-topbar-user");
  if (!loginBtn || !userBtn) return;

  if (user) {
    loginBtn.style.display = "none";
    userBtn.classList.add("visible");

    const av = $("nrg-u-avatar");
    if (user.photoURL) {
      av.innerHTML = `<img src="${user.photoURL}" alt="">`;
    } else {
      av.textContent = (user.displayName || user.email || "?")[0].toUpperCase();
    }
    const name = user.displayName || user.email.split("@")[0];
    $("nrg-u-name").textContent  = name;
    $("nrg-u-dname").textContent = name;
    $("nrg-u-email").textContent = user.email;

    getUserDoc(user.uid).then(data => {
      if (data?.theme && typeof applyTheme === "function") applyTheme(data.theme);
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


  document.querySelectorAll(".nrg-auth-tab").forEach(t =>
    t.addEventListener("click", () => switchTab(t.dataset.tab))
  );

  $("nrg-auth-close").addEventListener("click", closeModal);
  $("nrg-auth-overlay").addEventListener("click", e => {
    if (e.target === $("nrg-auth-overlay")) closeModal();
  });


  $("nrg-l-pass").addEventListener("keydown", e => { if (e.key === "Enter") $("nrg-l-submit").click(); });
  $("nrg-s-pass").addEventListener("keydown", e => { if (e.key === "Enter") $("nrg-s-submit").click(); });

  $("nrg-topbar-login").addEventListener("click", () => openModal("login"));


  $("nrg-l-submit").addEventListener("click", async () => {
    const email = $("nrg-l-email").value.trim();
    const pass  = $("nrg-l-pass").value;
    if (!email || !pass) { setMsg("nrg-l-msg", "fill in all fields.", "error"); return; }
    setLoading("nrg-l-submit", null, true, "LOGIN");
    try {
      await doLogIn(email, pass);
      closeModal();
    } catch(e) {
      setMsg("nrg-l-msg", friendlyError(e.code), "error");
    } finally {
      setLoading("nrg-l-submit", null, false, "LOGIN");
    }
  });


  $("nrg-s-submit").addEventListener("click", async () => {
    const name  = $("nrg-s-name").value.trim();
    const email = $("nrg-s-email").value.trim();
    const pass  = $("nrg-s-pass").value;
    if (!name || !email || !pass) { setMsg("nrg-s-msg", "fill in all fields.", "error"); return; }
    if (pass.length < 6) { setMsg("nrg-s-msg", "password must be at least 6 characters.", "error"); return; }
    setLoading("nrg-s-submit", null, true, "CREATE ACCOUNT");
    try {
      await doSignUp(email, pass, name);
      setMsg("nrg-s-msg", "account created! welcome to NRG.", "success");
      setTimeout(closeModal, 1200);
    } catch(e) {
      setMsg("nrg-s-msg", friendlyError(e.code), "error");
    } finally {
      setLoading("nrg-s-submit", null, false, "CREATE ACCOUNT");
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
  $("nrg-l-google").addEventListener("click", () => handleGoogle("nrg-l-msg"));
  $("nrg-s-google").addEventListener("click", () => handleGoogle("nrg-s-msg"));


  $("nrg-l-forgot").addEventListener("click", async () => {
    const email = $("nrg-l-email").value.trim();
    if (!email) { setMsg("nrg-l-msg", "enter your email above first.", "error"); return; }
    try {
      await doResetPassword(email);
      setMsg("nrg-l-msg", "reset email sent — check your inbox.", "success");
    } catch(e) {
      setMsg("nrg-l-msg", friendlyError(e.code), "error");
    }
  });


  $("nrg-topbar-user").addEventListener("click", e => {
    e.stopPropagation();
    $("nrg-u-dropdown").classList.toggle("open");
  });
  document.addEventListener("click", () => $("nrg-u-dropdown")?.classList.remove("open"));

  $("nrg-u-logout").addEventListener("click",   async () => { await doLogOut(); });
  $("nrg-u-account").addEventListener("click",  () => { window.location.href = "/nrg-auth-ui.html"; });
  $("nrg-u-settings").addEventListener("click", () => { window.location.href = "/settings.html"; });
  $("nrg-u-favs").addEventListener("click",     () => { window.location.href = "/games.html?favorites=1"; });


  onAuthStateChanged(auth, updateTopbar);


  window.NRGAuth = {
    open:    openModal,
    close:   closeModal,
    logOut:  doLogOut,
    get currentUser() { return auth.currentUser; }
  };
}

init();