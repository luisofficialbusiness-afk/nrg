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
      nCoins: 0,           // ← Added N-Coins to default profile
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

    profile.progress.gamesPlayed = (profile.progress.gamesPlayed || 0) + 1;

    // Give XP for playing a game
    addXp(5);

    // Give N-Coins for playing a game
    addCoins(2);

    // Unlock achievements
    unlockAchievement('first_game');
    if(profile.progress.gamesPlayed >= 10) unlockAchievement('gamer_10');
    if(profile.progress.gamesPlayed >= 50) unlockAchievement('gamer_50');

    saveProfile(profile);
}

// Call this whenever AI feature is used
function trackAiUsage() {
    let profile = getProfile();

    profile.progress.aiUses = (profile.progress.aiUses || 0) + 1;

    // Give XP for using AI
    addXp(3);

    // Give N-Coins for AI usage
    addCoins(1);

    // Unlock achievements
    if(profile.progress.aiUses >= 1) unlockAchievement('ai_user');
    if(profile.progress.aiUses >= 20) unlockAchievement('ai_20');

    saveProfile(profile);
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
    updateCoinsUI(); // ← Update N-Coins counter
}



// ================================
// N-Coins System
// ================================

// Add N-Coins
function addCoins(amount) {
    let profile = getProfile();
    profile.nCoins = (profile.nCoins || 0) + amount;
    saveProfile(profile);
    updateCoinsUI();
}

// Remove / spend N-Coins
function spendCoins(amount) {
    let profile = getProfile();
    if ((profile.nCoins || 0) >= amount) {
        profile.nCoins -= amount;
        saveProfile(profile);
        updateCoinsUI();
        return true; // purchase successful
    } else {
        alert("Not enough N-Coins!");
        return false; // not enough coins
    }
}

// Update N-Coins display in UI
function updateCoinsUI() {
    const profile = getProfile();
    const coinsElements = document.querySelectorAll(".ncoins-display");
    coinsElements.forEach(el => el.innerText = profile.nCoins || 0);
}

// Optional: daily bonus N-Coins
function dailyBonus() {
    const lastBonus = localStorage.getItem('nrg_last_daily_bonus') || 0;
    const now = Date.now();
    const oneDay = 24*60*60*1000;

    if(now - lastBonus >= oneDay) {
        addCoins(50); // Give 50 N-Coins once per day
        localStorage.setItem('nrg_last_daily_bonus', now);
        alert("Daily bonus: +50 N-Coins!");
    } else {
        console.log("Daily bonus already claimed.");
    }
}



window.addXP = function(amount) {
  let profile = getProfile();
  profile.xp = (profile.xp || 0) + amount;
  saveProfile(profile);
  updateProfileUI();
};

window.addProgress = function(type) {
  let profile = getProfile();
  if (profile.progress[type] !== undefined) {
    profile.progress[type]++;
    saveProfile(profile);
    checkAchievements();
  }
};

window.addCoins = function(amount) {
  let profile = getProfile();
  profile.nCoins = (profile.nCoins || 0) + amount;
  saveProfile(profile);
  updateCoinsUI();
};
