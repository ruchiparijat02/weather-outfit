// public/app.js
// Runs in the browser. Talks ONLY to our own server, never to OpenWeatherMap.
// That's why there is no API key anywhere in this file.

const form = document.getElementById("search");
const input = document.getElementById("city");
const button = form.querySelector("button");
const errorBox = document.getElementById("error");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();           // stop the page from reloading
  const city = input.value.trim();

  errorBox.hidden = true;
  result.hidden = true;
  button.disabled = true;
  button.textContent = "Loading…";

  try {
    // GET request to OUR server
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (!res.ok) {
      // Our server sent { error: "..." } with a 4xx/5xx code
      showError(data.error || `Something went wrong (${res.status}).`);
      return;
    }

    document.getElementById("place").textContent = `${data.city}${data.country ? ", " + data.country : ""}`;
    document.getElementById("temp").textContent = `${data.temp}°C`;
    document.getElementById("desc").textContent = `${data.description} · feels like ${data.feelsLike}°C`;
    document.getElementById("tip").textContent = data.tip;
    const icon = document.getElementById("icon");
    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    icon.alt = data.description;
    result.hidden = false;
  } catch {
    // Our own server isn't reachable (e.g. it was stopped)
    showError("Can't reach the server. Is it running? (npm start)");
  } finally {
    button.disabled = false;
    button.textContent = "Search";
  }
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}
