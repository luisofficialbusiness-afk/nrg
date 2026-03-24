document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("gameSearch");
  const games = document.querySelectorAll(".game-card");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();

    games.forEach(game => {
      const titleElement = game.querySelector(".text");
      const gameName = titleElement.textContent.toLowerCase();

      if (gameName.includes(searchValue)) {
        game.style.display = "block";
      } else {
        game.style.display = "none";
      }
    });
  });

  // Press Enter = open first visible game
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      for (let game of games) {
        if (game.style.display !== "none") {
          game.click();
          break;
        }
      }
    }
  });
});
