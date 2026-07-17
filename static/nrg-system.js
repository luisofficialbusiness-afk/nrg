import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAKPXLTU0z18tsn80JCXJhJ62EEjDl7lqY",
  authDomain:        "nrg-accounts.firebaseapp.com",
  projectId:         "nrg-accounts",
  storageBucket:     "nrg-accounts.firebasestorage.app",
  messagingSenderId: "969467601192",
  appId:             "1:969467601192:web:bd312dd3d58e4b6b7c701d"
};

// reuse existing Firebase app if already initialised on this page
const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);


const LEVEL_THRESHOLDS = [0, 0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000];

export function xpForLevel(level) {
  return LEVEL_THRESHOLDS[level] ?? (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length + 1) * 3000);
}

export function levelFromXP(xp) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i; // walk up until xp no longer qualifies
    else break;
  }
  return level;
}

export function xpProgressInLevel(xp) {
  const level    = levelFromXP(xp);
  const current  = xpForLevel(level);     // XP at start of this level
  const next     = xpForLevel(level + 1); // XP needed for next level
  const progress = xp - current;
  const needed   = next - current;
  return { level, progress, needed, pct: Math.min(100, Math.floor((progress / needed) * 100)) };
}

// returns the user's active XP multiplier (1 if no boost active or boost expired)
async function getXPMultiplier(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return 1;
  const d = snap.data();
  if (!d.xpBoostActive || !d.xpBoostExpiry) return 1;
  const expiry = new Date(d.xpBoostExpiry).getTime();
  if (Date.now() > expiry) {
    await updateDoc(doc(db, "users", uid), { xpBoostActive: false, xpBoostExpiry: null, xpBoostMult: 1 });
    return 1;
  }
  return d.xpBoostMult || 1;
}

// awards XP to the current user, recalculates level, writes both back
export async function addXP(amount) {
  const user = auth.currentUser;
  if (!user) return;
  const mult     = await getXPMultiplier(user.uid);
  const actual   = Math.floor(amount * mult); // apply boost multiplier
  const snap     = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;
  const newXP    = (snap.data().xp || 0) + actual;
  const newLevel = levelFromXP(newXP);
  await updateDoc(doc(db, "users", user.uid), { xp: newXP, level: newLevel });
  return { xp: newXP, level: newLevel, gained: actual };
}

// adds coins to the current user
export async function addCoins(amount) {
  const user = auth.currentUser;
  if (!user) return;
  await updateDoc(doc(db, "users", user.uid), { coins: increment(amount) });
}

// removes coins — returns false if not enough balance
export async function spendCoins(amount) {
  const user = auth.currentUser;
  if (!user) return false;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return false;
  const current = snap.data().coins || 0;
  if (current < amount) return false; // not enough coins
  await updateDoc(doc(db, "users", user.uid), { coins: increment(-amount) });
  return true;
}

// activates an XP boost item — duration in minutes, multiplier e.g. 2 for 2x
export async function activateXPBoost(durationMinutes, multiplier) {
  const user = auth.currentUser;
  if (!user) return;
  const expiry = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
  await updateDoc(doc(db, "users", user.uid), {
    xpBoostActive: true,
    xpBoostExpiry: expiry,
    xpBoostMult:   multiplier
  });
}

// checks and handles the daily login reward — call once on page load
// returns { claimed, coins, streak } or null if already claimed today
export async function claimDailyReward() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return null;
  const d         = snap.data();
  const today     = new Date().toDateString(); // e.g. "Mon May 20 2026"
  const lastLogin = d.lastLoginDate || "";
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastLogin === today) return { claimed: false }; // already claimed today

  // streak continues if last login was yesterday, otherwise resets to 1
  const streak     = lastLogin === yesterday ? (d.loginStreak || 0) + 1 : 1;
  const coinsEarned = 30; // flat 30 coins per day

  await updateDoc(doc(db, "users", user.uid), {
    lastLoginDate: today,
    loginStreak:   streak,
    coins:         increment(coinsEarned)
  });

  return { claimed: true, coins: coinsEarned, streak };
}

// returns current user doc data or null
export async function getUserData() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data() : null;
}

// waits for auth to resolve then calls callback with user (or null)
export function onReady(callback) {
  return onAuthStateChanged(auth, callback);
}

// expose on window so non-module scripts (games.html legacy scripts) can still call them
window.NRGSystem = { addXP, addCoins, spendCoins, activateXPBoost, claimDailyReward, getUserData, levelFromXP, xpForLevel, xpProgressInLevel };

(function() {
  var THEMES = {
    midnight: { bg:'#0a0a0a', surface:'#111', surface2:'#1a1a1a', border:'#2a2a2a', accent:'#c50cf9', text:'#e8e8e8', textDim:'#666', textMuted:'#3a3a3a' },
    neon:     { bg:'#050510', surface:'#0d0d1f', surface2:'#14142e', border:'#1e1e3f', accent:'#4f9cf9', text:'#e8f0ff', textDim:'#5a6a88', textMuted:'#2a3048' },
    galaxy:   { bg:'#06020f', surface:'#100820', surface2:'#180c2e', border:'#2a1540', accent:'#b57bee', text:'#eee8ff', textDim:'#6a5a88', textMuted:'#2e1e44' },
    ocean:    { bg:'#020a14', surface:'#061622', surface2:'#0b2233', border:'#0e3040', accent:'#00c8ff', text:'#d8f4ff', textDim:'#4a7a99', textMuted:'#0d2233' },
    crimson:  { bg:'#0f0005', surface:'#1a0008', surface2:'#220010', border:'#3a0018', accent:'#ff2255', text:'#ffe8ec', textDim:'#884455', textMuted:'#3a1020' },
    gold:     { bg:'#0a0800', surface:'#141000', surface2:'#1e1800', border:'#302400', accent:'#f5c518', text:'#fff8e0', textDim:'#886633', textMuted:'#2e2200' },
    forest:   { bg:'#020a04', surface:'#071208', surface2:'#0d1e10', border:'#142e18', accent:'#39d98a', text:'#d8ffe8', textDim:'#4a8860', textMuted:'#0d2214' },
    sakura:   { bg:'#0f0508', surface:'#1a0810', surface2:'#220e18', border:'#381a28', accent:'#ff6b9d', text:'#ffe8f0', textDim:'#885566', textMuted:'#2e0e1a' },
  };
  var saved = localStorage.getItem('nrg_theme');
  var t = THEMES[saved] || THEMES.midnight;
  function rgba(hex, a) {
    hex = hex.replace('#','');
    if (hex.length===3) hex=hex.split('').map(function(c){return c+c;}).join('');
    var n=parseInt(hex,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }
  var s = document.documentElement.style;
  s.setProperty('--bg', t.bg);
  s.setProperty('--surface', t.surface);
  s.setProperty('--surface2', t.surface2);
  s.setProperty('--surface3', t.surface2);
  s.setProperty('--border', t.border);
  s.setProperty('--accent', t.accent);
  s.setProperty('--accent-dim', rgba(t.accent, 0.10));
  s.setProperty('--accent-glow', rgba(t.accent, 0.25));
  s.setProperty('--text', t.text);
  s.setProperty('--text-dim', t.textDim);
  s.setProperty('--text-muted', t.textMuted);
})();
