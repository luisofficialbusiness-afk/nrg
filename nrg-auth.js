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
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL:    user.photoURL || null,
      createdAt:   serverTimestamp(),
      theme:       localStorage.getItem('nrg_theme_selected') || 'midnight',
      favorites:   [],
      recentGames: []
    });
  }
}

async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

async function signUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  // FIX: pass cred.user directly after awaiting updateProfile so displayName is set
  await createUserDoc(cred.user);
  return cred.user;
}

async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await createUserDoc(cred.user);
  return cred.user;
}

async function logInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred     = await signInWithPopup(auth, provider);
  await createUserDoc(cred.user);
  return cred.user;
}

async function logOut() {
  await signOut(auth);
}

async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

async function saveTheme(themeName) {
  const user = auth.currentUser;
  if (user) await updateUserDoc(user.uid, { theme: themeName });
  localStorage.setItem('nrg_theme_selected', themeName);
}

async function saveFavoriteGame(gameName, add = true) {
  const user = auth.currentUser;
  if (!user) return;
  const data    = await getUserDoc(user.uid);
  const favs    = data?.favorites || [];
  const updated = add
    ? [...new Set([...favs, gameName])]
    : favs.filter(g => g !== gameName);
  await updateUserDoc(user.uid, { favorites: updated });
  return updated;
}

async function getFavorites() {
  const user = auth.currentUser;
  if (!user) return [];
  const data = await getUserDoc(user.uid);
  return data?.favorites || [];
}

function onUser(callback) {
  return onAuthStateChanged(auth, callback);
}

window.NRGAuth = {
  signUp,
  logIn,
  logInWithGoogle,
  logOut,
  resetPassword,
  onUser,
  saveTheme,
  saveFavoriteGame,
  getFavorites,
  getUserDoc,
  get currentUser() { return auth.currentUser; }
};

export {
  auth, db,
  signUp, logIn, logInWithGoogle, logOut, resetPassword,
  onUser, saveTheme, saveFavoriteGame, getFavorites, getUserDoc
};