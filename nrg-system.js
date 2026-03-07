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

function showAchievementPopup(name) {
    const popup = document.createElement("div");
    popup.className = "achievement-popup";
    popup.innerText = `🏆 Achievement Unlocked: ${name}!`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2500);
}

// ============================
// Core Adders
// ============================

function addXP(amount) {
    let profile = getProfile();
    profile.xp = (profile.xp || 0) + amount;
    saveProfile(profile);
    updateProfileUI();
    checkAchievements();
}

function addProgress(type, amount = 1) {
    let profile = getProfile();
    if (profile.progress[type] !== undefined) {
        profile.progress[type] += amount;
        saveProfile(profile);
        updateProfileUI();
        checkAchievements();
    }
}

function addCoins(amount) {
    let profile = getProfile();
    profile.nCoins = (profile.nCoins || 0) + amount;
    saveProfile(profile);
    updateCoinsUI();
    checkAchievements();
}

// ============================
// Spend Coins
// ============================

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

// ============================
// Achievements System
// ============================

function unlockAchievement(id) {
    let profile = getProfile();

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

    if (!profile.achievements.includes(id) && achievementList[id]) {
        profile.achievements.push(id);
        saveProfile(profile);
        showAchievementPopup(achievementList[id]);
    }
}

function checkAchievements() {
    let profile = getProfile();
    let level = getLevel(profile.xp);

    // Games
    if (profile.progress.gamesPlayed >= 1) unlockAchievement("first_game");
    if (profile.progress.gamesPlayed >= 10) unlockAchievement("gamer_10");
    if (profile.progress.gamesPlayed >= 50) unlockAchievement("gamer_50");

    // AI uses
    if (profile.progress.aiUses >= 1) unlockAchievement("ai_user");
    if (profile.progress.aiUses >= 20) unlockAchievement("ai_20");

    // XP
    if (profile.xp >= 100) unlockAchievement("xp_100");
    if (profile.xp >= 500) unlockAchievement("xp_500");
    if (profile.xp >= 1000) unlockAchievement("xp_1000");

    // Levels
    if (level >= 5) unlockAchievement("level_5");
    if (level >= 10) unlockAchievement("level_10");
    if (level >= 25) unlockAchievement("level_25");

    // Coins
    if (profile.nCoins >= 100) unlockAchievement("coins_100");
    if (profile.nCoins >= 500) unlockAchievement("coins_500");

    // Visits
    if (profile.progress.visits >= 10) unlockAchievement("visitor_10");
}

// ============================
// Profile UI Updates
// ============================

function updateProfileUI() {
    const profile = getProfile();
    document.getElementById('xp').innerText = profile.xp || 0;
    document.getElementById('level').innerText = getLevel(profile.xp);
    document.getElementById('rank').innerText = getRank(getLevel(profile.xp));

    const percent = profile.xp % 100;
    document.getElementById('xp-fill').style.width = percent + '%';

    renderAchievements();
    updateCoinsUI();
}

function updateCoinsUI() {
    const profile = getProfile();
    const coinsElements = document.querySelectorAll(".ncoins-display, #ncoins");
    coinsElements.forEach(el => el.innerText = profile.nCoins || 0);
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
        let div = document.createElement("div");
        div.className = profile.achievements.includes(id) ? "ach unlocked" : "ach locked";
        div.innerText = achievementList[id];
        grid.appendChild(div);
    }
}

// ============================
// Game Tracking
// ============================

function trackGamePlayed() {
    addProgress("gamesPlayed");
    addXP(5);
    addCoins(2);
}

function trackAiUsage() {
    addProgress("aiUses");
    addXP(3);
    addCoins(1);
}

// ============================
// Daily Bonus
// ============================

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
// Expose global functions for console/testing
// ============================

window.addXP = addXP;
window.addCoins = addCoins;
window.addProgress = addProgress;
window.trackGamePlayed = trackGamePlayed;
window.trackAiUsage = trackAiUsage;
window.dailyBonus = dailyBonus;
window.getProfile = getProfile;
window.saveProfile = saveProfile;
window.updateProfileUI = updateProfileUI;

// Update UI on load
window.addEventListener('load', updateProfileUI);
