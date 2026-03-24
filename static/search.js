const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();

    cards.forEach(card => {
        const title = card.querySelector(".text").textContent.toLowerCase();

        if (title.includes(searchValue)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

// Place game work
document.querySelectorAll(".play-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = button.closest(".card");
        const game = card.getAttribute("data-game");
        if (game) {
            window.location.href = game;
        }
    });
});

// Click card, game open
cards.forEach(card => {
    card.addEventListener("click", () => {
        const game = card.getAttribute("data-game");
        if (game) {
            window.location.href = game;
        }
    });
});
