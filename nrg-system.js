// ============================
// NRG PROFILE SYSTEM
// ============================

function getProfile() {
  let profile = JSON.parse(localStorage.getItem("nrg_profile"));

  if (!profile) {
    profile = {
      username: "Guest",
      pfp: null,
      xp: 0,
      achievements: [],
      progress: {
        gamesPlayed: 0,
        aiUses: 0,
        visits: 0
      }
    };
    localStorage.setItem("nrg_profile", JSON.stringify(profile));
  }

  return profile;
}

function saveProfile(profile) {
  localStorage.setItem("nrg_profile", JSON.stringify(profile));
}

function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function addXP(amount) {
  let profile = getProfile();
  profile.xp += amount;
  saveProfile(profile);
  checkAchievements();
}

function addProgress(type) {
  let profile = getProfile();
  if (profile.progress[type] !== undefined) {
    profile.progress[type]++;
    saveProfile(profile);
    checkAchievements();
  }
}

function unlockAchievement(id) {
  let profile = getProfile();

  if (!profile.achievements.includes(id)) {
    profile.achievements.push(id);
    saveProfile(profile);
    showAchievementPopup();
  }
}

function checkAchievements() {
  let profile = getProfile();
  let level = getLevel(profile.xp);

  if (profile.progress.gamesPlayed >= 1)
    unlockAchievement("first_game");

  if (profile.progress.aiUses >= 5)
    unlockAchievement("ai_user");

  if (profile.xp >= 100)
    unlockAchievement("xp_100");

  if (level >= 5)
    unlockAchievement("level_5");
}

function showAchievementPopup() {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.innerText = "🏆 Achievement Unlocked!";
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2500);
}


function getRank(level) {
  if (level >= 100) return "NRG Legend";
  if (level >= 75) return "Ascended";
  if (level >= 50) return "NRG Master";
  if (level >= 40) return "Veteran";
  if (level >= 30) return "Elite";
  if (level >= 20) return "Specialist";
  if (level >= 15) return "Operator";
  if (level >= 10) return "Explorer";
  if (level >= 5) return "Rising";
  return "Rookie";
}


function gainHomepageXp() {
    const lastXp = localStorage.getItem('nrg_last_home_xp') || 0;
    const now = Date.now();
    const cooldown = 5 * 60 * 1000; 

    if(now - lastXp >= cooldown) {
        addXp(10); 
        localStorage.setItem('nrg_last_home_xp', now);
        console.log("You earned 10 XP from the homepage!");
    } else {
        const remaining = Math.ceil((cooldown - (now - lastXp)) / 1000);
        console.log(`Wait ${remaining} more seconds before earning XP again.`);
    }
}

window.addEventListener('load', () => {
    if(window.location.pathname.endsWith("index.html")) {
        gainHomepageXp();
    }
});



// ================================
// NRG Universal Tracking System
// ================================

// Call this whenever a game is completed
function trackGamePlayed() {
    let profile = getProfile();

    profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;

    // Give XP for playing a game
    addXp(5);

    // Give N-Coins for playing a game (optional)
    profile.nCoins = (profile.nCoins || 0) + 2;

    // Unlock achievements
    unlockAchievement(profile, 'first_game', profile.gamesPlayed >= 1);
    unlockAchievement(profile, 'gamer_10', profile.gamesPlayed >= 10);
    unlockAchievement(profile, 'gamer_50', profile.gamesPlayed >= 50);

    saveProfile(profile);
}

// Call this whenever AI feature is used
function trackAiUsage() {
    let profile = getProfile();

    profile.aiUses = (profile.aiUses || 0) + 1;

    // Give XP for using AI
    addXp(3);

    // Optional: give N-Coins
    profile.nCoins = (profile.nCoins || 0) + 1;

    // Unlock achievements
    unlockAchievement(profile, 'ai_user', profile.aiUses >= 1);
    unlockAchievement(profile, 'ai_20', profile.aiUses >= 20);

    saveProfile(profile);
}

// Helper to unlock achievements
function unlockAchievement(profile, id, condition) {
    if(condition && !profile.achievements.includes(id)) {
        profile.achievements.push(id);
        console.log(`Achievement unlocked: ${id}`);
    }
}

// Simple XP addition function
function addXp(amount) {
    let profile = getProfile();
    profile.xp = (profile.xp || 0) + amount;
    saveProfile(profile);
    updateProfileUI();
}

// Optional: Update the profile UI after changes
function updateProfileUI() {
    const profile = getProfile();
    document.getElementById('xp').innerText = profile.xp || 0;

    const level = getLevel(profile.xp);
    document.getElementById('level').innerText = level;
    document.getElementById('rank').innerText = getRank(level);

    const percent = (profile.xp % 100);
    document.getElementById('xp-fill').style.width = percent + '%';

    renderAchievements();
}

// Example usage:
// trackGamePlayed(); // Call after finishing a game
// trackAiUsage();    // Call whenever AI is used
