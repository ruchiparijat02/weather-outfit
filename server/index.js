// server/index.js
// Our "kitchen". The only file that knows the API key.

// 1. Load the .env file so process.env.WEATHER_API_KEY is available.
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.WEATHER_API_KEY;

// Warn early if the key is missing, so the demo doesn't fail silently.
if (!KEY || KEY === "your_key_here") {
  console.warn("⚠  WEATHER_API_KEY is missing. Copy .env.example to .env and add your key.");
}

// 2. Serve the frontend (public/index.html, style.css, app.js).
app.use(express.static(path.join(__dirname, "..", "public")));

// 3. Outfit rule from our plan.
function outfitTip(temp, sky) {
  let tip;
  if (temp < 15) tip = "Wear a jacket 🧥";
  else if (temp <= 25) tip = "Light layers are perfect 👕";
  else tip = "Go with breathable cotton 🩳";
  if (/rain|drizzle|thunderstorm/i.test(sky)) tip += " — and take an umbrella ☂️";
  return tip;
}

// 4. Our API endpoint. The browser calls this; we call OpenWeatherMap.
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city || "").trim();

  // Check 1: empty city -> 400, don't even call the weather API.
  if (!city) return res.status(400).json({ error: "Please enter a city." });

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(city)}&units=metric&appid=${KEY}`;

  try {
    // Check 2: give up after 5 seconds.
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });

    // Check 3: turn status codes into friendly messages.
    if (r.status === 401) return res.status(500).json({ error: "API key problem. Check your .env (new keys can take a while to activate)." });
    if (r.status === 404) return res.status(404).json({ error: `City "${city}" not found. Check the spelling.` });
    if (r.status === 429) return res.status(429).json({ error: "Too many requests. Wait a minute and try again." });
    if (!r.ok) return res.status(502).json({ error: "Weather service is down. Try again later." });

    const data = await r.json();
    const temp = Math.round(data.main.temp);
    const sky = data.weather[0].main;

    // Check 4: send only what the page needs.
    res.json({
      city: data.name,
      country: data.sys && data.sys.country,
      temp,
      feelsLike: Math.round(data.main.feels_like),
      sky,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tip: outfitTip(temp, sky),
    });
  } catch (err) {
    // Check 5: timeout or no internet.
    console.error("Weather call failed:", err.message);
    res.status(504).json({ error: "Couldn't reach the weather service. Check your internet and try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
