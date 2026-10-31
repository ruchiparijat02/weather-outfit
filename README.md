# Weather + Outfit

Type a city, see the current weather and a suggestion for what to wear.

Built as a teaching demo for: APIs, API keys, HTTP status codes, error handling, `.env` files and `.gitignore`.

## How it works

```
Browser (public/app.js)  →  Our server (server/index.js + .env)  →  OpenWeatherMap API
          ↑                                                            |
          └────────────── temp, sky, outfit tip ←──────────────────────┘
```

The browser never sees the API key. Only `server/index.js` reads it from `.env`.

## Setup (5 minutes)

**You need:** [Node.js 18+](https://nodejs.org), [Git](https://git-scm.com), [VS Code](https://code.visualstudio.com), and a free [OpenWeatherMap](https://openweathermap.org) API key.

1. Open this folder in VS Code → **Terminal → New Terminal**.
2. Install the libraries:
   ```
   npm install
   ```
3. Create your `.env` file from the template:
   - Mac / Linux: `cp .env.example .env`
   - Windows: `copy .env.example .env`
4. Open `.env` and replace `your_key_here` with your real key. Save.
5. Start the server:
   ```
   npm start
   ```
6. Open **http://localhost:3000** in your browser.

Stop the server with **Ctrl + C**. Restart it after any change to `.env`.

## Test it

| Try | Expected |
| --- | --- |
| `Delhi` | Temperature, sky, outfit tip |
| `Delhii` | "City not found" (404) |
| Empty search | "Please enter a city" (400) |
| Wrong key in `.env`, then restart | "API key problem" (401) |
| Wi-Fi off | "Couldn't reach the weather service" (timeout) |

You can also test the API on its own: http://localhost:3000/api/weather?city=Delhi

## Troubleshooting

| Problem | Fix |
| --- | --- |
| "API key problem" with a real key | New keys can take up to a couple of hours to activate. Wait and retry. |
| `Cannot find module 'express'` | Run `npm install` |
| `EADDRINUSE` | Port 3000 is busy. Stop the other server, or set `PORT=3001` in `.env` |
| `fetch is not defined` | Your Node.js is too old. Install Node 18 or newer (`node -v` to check) |
| Changes not showing | Save the file, restart the server, refresh the browser |

## Project structure

```
weather-outfit/
├── .env              # your real key (never committed)
├── .env.example      # template, safe to share
├── .gitignore        # keeps .env and node_modules out of Git
├── package.json      # project info, libraries, start command
├── README.md
├── server/
│   └── index.js      # reads the key, calls the weather API, handles errors
└── public/
    ├── index.html    # the page
    ├── style.css     # the look
    └── app.js        # calls our server, shows result or error
```
