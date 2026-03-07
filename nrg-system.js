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
            ncoins: 0,           // ✅ make sure ncoins exists
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
// XP System
// ============================
function addXp(amount) {
    let profile = getProfile();
    profile.xp += amount;
    saveProfile(profile);
    updateProfileUI();
}

// ============================
// N-Coins System
// ============================
function addCoins(amount) {
    let profile = getProfile();
    profile.ncoins = (profile.ncoins || 0) + amount;
    saveProfile(profile);
    updateCoinsUI();
}

function spendCoins(amount) {
    let profile = getProfile();
    if ((profile.ncoins || 0) >= amount) {
        profile.ncoins -= amount;
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
    const elems = document.querySelectorAll(".ncoins-display");
    elems.forEach(el => el.innerText = profile.ncoins || 0);
}

// ============================
// Achievements System
// ============================
function unlockAchievement(id) {
    let profile = getProfile();
    if (!profile.achievements.includes(id)) {
        profile.achievements.push(id);
        saveProfile(profile);
        showAchievementPopup(id);
    }
}

function showAchievementPopup(id) {
    const popup = document.createElement("div");
    popup.className = "achievement-popup";
    popup.innerText = "🏆 Achievement Unlocked: " + id;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
}

// ============================
// Tracking Games & AI
// ============================
function trackGamePlayed() {
    let profile = getProfile();
    profile.progress.gamesPlayed = (profile.progress.gamesPlayed || 0) + 1;
    addXp(5);
    addCoins(2); // ✅ give N-Coins per game

    // Unlock achievements
    if (profile.progress.gamesPlayed >= 1) unlockAchievement("first_game");
    if (profile.progress.gamesPlayed >= 10) unlockAchievement("gamer_10");
    if (profile.progress.gamesPlayed >= 50) unlockAchievement("gamer_50");

    saveProfile(profile);
    updateProfileUI();
}

function trackAiUsage() {
    let profile = getProfile();
    profile.progress.aiUses = (profile.progress.aiUses || 0) + 1;
    addXp(3);
    addCoins(1); // ✅ give N-Coins per AI use

    if (profile.progress.aiUses >= 1) unlockAchievement("ai_user");
    if (profile.progress.aiUses >= 20) unlockAchievement("ai_20");

    saveProfile(profile);
    updateProfileUI();
}

// ============================
// Profile UI Updates
// ============================
function updateProfileUI() {
    const profile = getProfile();
    document.getElementById('xp').innerText = profile.xp || 0;
    document.getElementById('level').innerText = getLevel(profile.xp);
    document.getElementById('rank').innerText = getRank(getLevel(profile.xp));

    const percent = (profile.xp % 100);
    document.getElementById('xp-fill').style.width = percent + '%';

    updateCoinsUI();
    renderAchievements();
}

// ============================
// Homepage XP
// ============================
function gainHomepageXp() {
    const lastXp = localStorage.getItem('nrg_last_home_xp') || 0;
    const now = Date.now();
    const cooldown = 5 * 60 * 1000;

    if(now - lastXp >= cooldown) {
        addXp(10);
        localStorage.setItem('nrg_last_home_xp', now);
    }
}

window.addEventListener('load', () => {
    if(window.location.pathname.endsWith("index.html")) {
        gainHomepageXp();
    }
});

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
    }
}
