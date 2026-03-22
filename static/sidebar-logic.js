document.addEventListener("DOMContentLoaded", function () {


  document.querySelectorAll('.nrg-sidebar .nav-icon, .sidebar .nav-icon').forEach(icon => {
    const currentPage = window.location.pathname.split("/").pop();

    if (icon.dataset.page === currentPage) {
      icon.classList.add("active");
    }

    icon.addEventListener('click', () => {
      const page = icon.dataset.page;
      if (page) {
        window.location.href = page;
      }
    });
  });


  
  function updateTime() {
    const now = new Date();
    let use24Hour = localStorage.getItem("timeFormat") === "24";

    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour
    });

    const timeEl = document.getElementById("time-status");
    if (timeEl) {
      timeEl.textContent = "Time: " + timeString;
    }
  }


  
  function updateBattery() {
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const batteryEl = document.getElementById('battery-status');
        if (batteryEl) {
          batteryEl.textContent = 'Battery: ' + Math.floor(battery.level * 100) + '%';
        }
      });
    } else {
      const batteryEl = document.getElementById('battery-status');
      if (batteryEl) {
        batteryEl.textContent = 'Battery: N/A';
      }
    }
  }


  
  function updatePing() {
    const start = Date.now();
    fetch(window.location.href, { cache: "no-store" })
      .then(() => {
        const ping = Date.now() - start;
        const pingEl = document.getElementById('ping-status');
        if (pingEl) {
          pingEl.textContent = 'Ping: ' + ping + ' ms';
        }
      })
      .catch(() => {
        const pingEl = document.getElementById('ping-status');
        if (pingEl) {
          pingEl.textContent = 'Ping: N/A';
        }
      });
  }


  async function updateTemperature() {
    const tempEl = document.getElementById('temperature-status');
    if (!tempEl) return;

    try {
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=964167d80cb0792b385da69d18946bd1`
        );

        const weatherData = await weatherRes.json();
        const temp = Math.round(weatherData.main.temp);

        tempEl.textContent = 'Temp: ' + temp + '°C';
      }, async () => {

        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();

          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${ipData.latitude}&lon=${ipData.longitude}&units=metric&appid=964167d80cb0792b385da69d18946bd1`
          );

          const weatherData = await weatherRes.json();
          const temp = Math.round(weatherData.main.temp);

          tempEl.textContent = 'Temp: ' + temp + '°C';
        } catch {
          tempEl.textContent = 'Temp: N/A';
        }
      });

    } catch {
      tempEl.textContent = 'Temp: N/A';
    }
  }


  setInterval(updateTime, 1000);
  setInterval(() => {
    updateBattery();
    updatePing();
  }, 5000);

  setInterval(updateTemperature, 300000);


  updateTime();
  updateBattery();
  updatePing();
  updateTemperature();

});
