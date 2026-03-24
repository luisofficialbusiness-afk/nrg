document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("gameSearch");
  const games = document.querySelectorAll(".game-card");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();

    games.forEach(game => {
      const gameName = game.getAttribute("data-name").toLowerCase();

      if (gameName.includes(searchValue)) {
        game.style.display = "block";
      } else {
        game.style.display = "none";
      }
    });
  });
});
