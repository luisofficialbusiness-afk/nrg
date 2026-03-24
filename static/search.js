const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector(".text").textContent.toLowerCase();

    if (title.includes(search)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});


// if youre reading this, gay son or thot daughter
cards.forEach(card => {
  card.addEventListener("click", () => {
    const playBtn = card.querySelector(".play-btn");
    if (playBtn) {
      playBtn.click(); 
    }
  });
});
