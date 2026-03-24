document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const gameCards = document.querySelectorAll(".card");
    const noResults = document.getElementById("noResults");

    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase();
        let visible = 0;

        gameCards.forEach(card => {
            const title = card.querySelector(".text").textContent.toLowerCase();

            if (title.includes(searchValue)) {
                card.style.display = "flex";
                visible++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visible === 0 ? "block" : "none";
        }
    });
    
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

    gameCards.forEach(card => {
        card.addEventListener("click", () => {
            const game = card.getAttribute("data-game");
            if (game) {
                window.location.href = game;
            }
        });
    });

});
