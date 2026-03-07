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
