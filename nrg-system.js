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
