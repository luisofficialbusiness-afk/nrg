function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();


  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  const timeEl = document.getElementById("time");
  if (timeEl) {
    timeEl.textContent = `Time: ${hours}:${minutes}:${seconds} ${ampm}`;
  }
}


async function updateBattery() {
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      const level = Math.round(battery.level * 100);
      document.getElementById("battery").textContent = `Battery: ${level}%`;
    } else {
      document.getElementById("battery").textContent = "Battery: N/A";
    }
  } catch {
    document.getElementById("battery").textContent = "Battery: N/A";
  }
}


async function updatePing() {
  const start = performance.now();
  try {
    await fetch(window.location.href, { cache: "no-store" });
    const ping = Math.round(performance.now() - start);
    document.getElementById("ping").textContent = `Ping: ${ping}ms`;
  } catch {
    document.getElementById("ping").textContent = "Ping: N/A";
  }
}


async function updateTemperature() {
  try {
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    const lat = ipData.latitude;
    const lon = ipData.longitude;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    const temp = weatherData.current_weather.temperature;
    document.getElementById("temperature").textContent = `Temp: ${temp}°C`;
  } catch {
    document.getElementById("temperature").textContent = "Temp: N/A";
  }
}


setInterval(updateTime, 1000);
setInterval(updatePing, 5000);
setInterval(updateBattery, 60000);
setInterval(updateTemperature, 600000);


updateTime();
updatePing();
updateBattery();
updateTemperature();
 
  document.querySelectorAll('.sidebar .nav-icon').forEach(icon => {
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

});
