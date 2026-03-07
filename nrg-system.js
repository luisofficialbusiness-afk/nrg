// ============================
// NRG PROFILE SYSTEM
// ============================

function getProfile() {
  let profile = JSON.parse(localStorage.getItem("nrg_profile"));

  if (!profile) {
    profile = {
      username: "Guest",
      pfp: null,
      banner: null,
      xp: 0,
      nCoins: 0,
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

// ============================
// XP, Progress & Achievements
// ============================

function addXP(amount) {
  let profile = getProfile();
  profile.xp = (profile.xp || 0) + amount;
  saveProfile(profile);
  updateProfileUI();
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
    showAchievementPopup(id);
  }
}

function checkAchievements() {
  let profile = getProfile();
  const level = getLevel(profile.xp);

  // Game achievements
  if (profile.progress.gamesPlayed >= 1) unlockAchievement("first_game");
  if (profile.progress.gamesPlayed >= 10) unlockAchievement("gamer_10");
  if (profile.progress.gamesPlayed >= 50) unlockAchievement("gamer_50");

  // AI achievements
  if (profile.progress.aiUses >= 1) unlockAchievement("ai_user");
  if (profile.progress.aiUses >= 20) unlockAchievement("ai_20");

  // XP achievements
  if (profile.xp >= 100) unlockAchievement("xp_100");
  if (profile.xp >= 500) unlockAchievement("xp_500");
  if (profile.xp >= 1000) unlockAchievement("xp_1000");

  // Level achievements
  if (level >= 5) unlockAchievement("level_5");
  if (level >= 10) unlockAchievement("level_10");
  if (level >= 25) unlockAchievement("level_25");

  // Coins achievements
  if (profile.nCoins >= 100) unlockAchievement("coins_100");
  if (profile.nCoins >= 500) unlockAchievement("coins_500");

  // Visit achievements
  if (profile.progress.visits >= 10) unlockAchievement("visitor_10");
}

function showAchievementPopup(id) {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.innerText = `🏆 Achievement Unlocked: ${id}`;
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 2500);
}

// ============================
// N-Coins System
// ============================

function addCoins(amount) {
  let profile = getProfile();
  profile.nCoins = (profile.nCoins || 0) + amount;
  saveProfile(profile);
  updateCoinsUI();
}

function spendCoins(amount) {
  let profile = getProfile();
  if ((profile.nCoins || 0) >= amount) {
    profile.nCoins -= amount;
    saveProfile(profile);
    updateCoinsUI();
    return true;
  } else {
    alert("Not enough N-Coins!");
    return false;
  }
}

function updateCoinsUI() {
  const profile = getProfile();
  const coinsElements = document.querySelectorAll(".ncoins-display");
  coinsElements.forEach(el => el.innerText = profile.nCoins || 0);
}

// ============================
// Universal Tracking
// ============================

function trackGamePlayed() {
  let profile = getProfile();
  profile.progress.gamesPlayed = (profile.progress.gamesPlayed || 0) + 1;
  saveProfile(profile);

  addXP(5);
  addCoins(2);
  checkAchievements();
}

function trackAiUsage() {
  let profile = getProfile();
  profile.progress.aiUses = (profile.progress.aiUses || 0) + 1;
  saveProfile(profile);

  addXP(3);
  addCoins(1);
  checkAchievements();
}

// ============================
// Homepage XP & Daily Bonus
// ============================

function gainHomepageXp() {
  const lastXp = localStorage.getItem('nrg_last_home_xp') || 0;
  const now = Date.now();
  const cooldown = 5 * 60 * 1000;

  if (now - lastXp >= cooldown) {
    addXP(10);
    localStorage.setItem('nrg_last_home_xp', now);
    console.log("You earned 10 XP from the homepage!");
  } else {
    const remaining = Math.ceil((cooldown - (now - lastXp)) / 1000);
    console.log(`Wait ${remaining} more seconds before earning XP again.`);
  }
}

function dailyBonus() {
  const lastBonus = localStorage.getItem('nrg_last_daily_bonus') || 0;
  const now = Date.now();
  const oneDay = 24*60*60*1000;

  if(now - lastBonus >= oneDay) {
    addCoins(50);
    localStorage.setItem('nrg_last_daily_bonus', now);
    alert("Daily bonus: +50 N-Coins!");
  } else {
    console.log("Daily bonus already claimed.");
  }
}

// ============================
// UI Updates
// ============================

function updateProfileUI() {
  const profile = getProfile();
  document.getElementById('xp').innerText = profile.xp || 0;
  const level = getLevel(profile.xp);
  document.getElementById('level').innerText = level;
  document.getElementById('rank').innerText = getRank(level);

  document.getElementById('xp-fill').style.width = (profile.xp % 100) + '%';
  renderAchievements();
  updateCoinsUI();
}

function renderAchievements() {
  const profile = getProfile();
  const grid = document.getElementById("achievements-grid");
  if (!grid) return;

  const achievementList = {
    first_game: "🎮 First Game",
    gamer_10: "🎮 Played 10 Games",
    gamer_50: "🎮 Played 50 Games",
    ai_user: "🤖 AI Beginner",
    ai_20: "🤖 AI Expert (20 Uses)",
    xp_100: "⭐ 100 XP",
    xp_500: "⭐ 500 XP",
    xp_1000: "⭐ 1000 XP",
    level_5: "🔥 Level 5",
    level_10: "🔥 Level 10",
    level_25: "🔥 Level 25",
    coins_100: "💰 100 N-Coins",
    coins_500: "💰 500 N-Coins",
    visitor_10: "📅 10 Visits"
  };

  grid.innerHTML = "";
  for (let id in achievementList) {
    const unlocked = profile.achievements.includes(id);
    const div = document.createElement("div");
    div.className = unlocked ? "ach unlocked" : "ach locked";
    div.innerText = achievementList[id];
    grid.appendChild(div);
  }
}

// ============================
// Expose functions globally
// ============================

window.addXP = addXP;
window.addProgress = addProgress;
window.addCoins = addCoins;
window.trackGamePlayed = trackGamePlayed;
window.trackAiUsage = trackAiUsage;
window.dailyBonus = dailyBonus;
window.getProfile = getProfile;
window.saveProfile = saveProfile;
window.updateProfileUI = updateProfileUI;
window.getLevel = getLevel;
window.getRank = getRank;
window.unlockAchievement = unlockAchievement;
window.checkAchievements = checkAchievements;
window.renderAchievements = renderAchievements;

