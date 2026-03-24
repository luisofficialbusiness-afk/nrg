const searchInput = document.getElementById("searchInput");
const gameCards = document.querySelectorAll(".card");

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();

  gameCards.forEach(card => {
    const title = card.querySelector(".text").textContent.toLowerCase();

    if (title.includes(search)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});

// gay son or thot daughter
gameCards.forEach(card => {
  card.addEventListener("click", () => {
    const playBtn = card.querySelector(".play-btn");
    if (playBtn) playBtn.click();
  });
});
