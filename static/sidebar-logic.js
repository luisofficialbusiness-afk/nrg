document.querySelectorAll('.sidebar .nav-icon').forEach(icon => {
  const currentPage = window.location.pathname.split("/").pop();
  if (icon.dataset.page === currentPage) icon.classList.add("active");
  icon.addEventListener('click', () => {
    const page = icon.dataset.page;
    if (page) window.location.href = page;
  });
});


function updateBattery() {
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      document.getElementById('battery-status').textContent =
        'Battery: ' + Math.floor(battery.level * 100) + '%';
    });
  } else {
    document.getElementById('battery-status').textContent = 'Battery: N/A';
  }
}

function updatePing() {
  const start = Date.now();
  fetch(window.location.href, { cache: "no-store" })
    .then(() => {
      const ping = Date.now() - start;
      document.getElementById('ping-status').textContent =
        'Ping: ' + ping + ' ms';
    })
    .catch(() => {
      document.getElementById('ping-status').textContent = 'Ping: N/A';
    });
}


async function updateTemperature() {
  try {
    const ipRes = await fetch('https://ip-api.com/json/');
    const ipData = await ipRes.json();

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${ipData.lat}&lon=${ipData.lon}&units=metric&appid=964167d80cb0792b385da69d18946bd1`
    );

    const weatherData = await weatherRes.json();
    const temp = Math.round(weatherData.main.temp);

    document.getElementById('temperature-status').textContent =
      'Temp: ' + temp + '°C';
  } catch {
    document.getElementById('temperature-status').textContent = 'Temp: N/A';
  }
}


setInterval(() => {
  updateBattery();
  updatePing();
}, 5000);


setInterval(updateTemperature, 300000);


updateBattery();
updatePing();
updateTemperature();


document.querySelectorAll('.nav-icon').forEach(button => {
  button.addEventListener('click', () => {
    const page = button.getAttribute('data-page');
    if (page) {
      window.location.href = "/static/" + page;
    }
  });
});

// Highlight active page
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll('.nav-icon').forEach(button => {
  if (button.getAttribute('data-page') === currentPage) {
    button.classList.add('active');
  }
});
