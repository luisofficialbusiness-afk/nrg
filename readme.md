# NRG

A self-hosted browser entertainment platform built on Node.js + Express. NRG gives you a unified dark-themed UI for games, movies, live TV, music, a web proxy, an AI chat, and user accounts — all running from a single server you control.

---

## Features

| Page | What it does |
|---|---|
| **Home** (`index.html`) | Dashboard with snowfall canvas effect, top nav, account dropdown |
| **Games** (`games.html`) | ~96 browser games with thumbnail cards, sidebar categories, favorites, and a detail modal |
| **Movies** (`movies.html`) | Movie browsing and playback UI |
| **Live TV** (`live-tv.html`) | Live television stream browser |
| **Music** (`music.html`) | Built-in audio player — track list sidebar, queue, progress bar, album art |
| **Proxy** (`proxy/index.html`) | Web proxy powered by SuperUV (Ultraviolet) + Scramjet + libcurl transport |
| **AI Chat** (`chat.html`) | AI chat interface |
| **Shop** (`shop.html`) | Store / marketplace page |
| **Settings** (`settings.html`) | User preferences and theme selector |
| **Accounts** (`accounts.html`) | Sign-up / login UI (Firebase Auth) |
| **Profiles** (`profiles.html`) | User profile management |
| **Admin** (`admin.html`) | Admin dashboard |

---

## Tech Stack

- **Runtime:** Node.js ≥ 16 (ESM)
- **Server:** Express 5, `http` module
- **Proxy engine:** [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet) + [Scramjet](https://github.com/MercuryWorkshop/scramjet) + [libcurl transport](https://github.com/MercuryWorkshop/libcurl-transport)
- **WebSocket tunnel:** [Wisp](https://github.com/MercuryWorkshop/wisp-js) on `/wisp/`
- **Bare server:** [@tomphttp/bare-server-node](https://github.com/tomphttp/bare-server-node) on `/edu/`
- **Auth & DB:** Firebase (Auth + Firestore)
- **Package manager:** pnpm

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- pnpm ≥ 10 (`npm i -g pnpm`)

### Install & run

```bash
git clone <your-fork-url>
cd nrg
pnpm install
pnpm start
```

The server starts on **http://localhost:8080**.

---

## Configuration

### `config.js` — Server

```js
const config = {
  challenge: false,        // Set to true to enable HTTP Basic Auth
  users: {
    admin: "changeme",     // username: 'password'
  },
};
```

Set `challenge: true` and update `users` to password-protect the entire site.

### `nrg-auth.js` — Firebase

Replace the placeholder values in `nrg-auth.js` with your own Firebase project credentials:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

Get these from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps.

> If you don't set up Firebase, accounts and favorites will not work, but the rest of the site functions fine.

---

## Adding Games

Each game card in `games.html` follows this template:

```html
<div class="game-card" data-title="Game Name" data-category="category" data-url="YOUR_GAME_URL">
  <div class="card-thumb">
    <img src="images/YOUR_THUMBNAIL.png" alt="Game Name" loading="lazy">
  </div>
  <div class="card-info">
    <div class="card-title">Game Name</div>
  </div>
</div>
```

- Place thumbnail images in `static/images/`
- Set `data-url` to the game's iframe URL
- Set `data-category` to match a sidebar filter (e.g. `action`, `puzzle`, `retro`)

---

## Adding Music

Each track in `music.html` follows this template:

```html
<div class="track-row"
     data-src="music/YOUR_SONG.mp3"
     data-title="Song Title"
     data-artist="Artist Name">
  <img src="images/YOUR_ALBUM_ART.jpg" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
  <!-- fallback art div goes here -->
</div>
```

- Place `.mp3` files in `static/music/`
- Place album art in `static/images/`

---

## Deployment

### Vercel

```bash
vercel deploy
```

`vercel.json` is already configured to route everything through `index.js`.

### Docker

```bash
docker build -t nrg .
docker run -p 8080:8080 nrg
```

### Any VPS / bare metal

```bash
pnpm install --prod
node index.js
```

Use a reverse proxy (nginx / Caddy) in front for HTTPS.

---

## Project Structure

```
nrg/
├── index.js              # Express + Wisp + Bare server entry point
├── config.js             # Server config (auth, port)
├── nrg-auth.js           # Firebase auth module (fill in your credentials)
├── package.json
├── Dockerfile
├── vercel.json
└── static/
    ├── index.html        # Home
    ├── games.html        # Games library
    ├── movies.html       # Movies
    ├── music.html        # Music player
    ├── chat.html         # AI chat
    ├── settings.html     # Settings
    ├── accounts.html     # Auth UI
    ├── proxy/            # Proxy frontend
    ├── sail/             # Proxy backends (Scramjet, libcurl, baremux)
    ├── SuperUV/          # Ultraviolet proxy bundle
    ├── scripts/          # Shared JS utilities
    ├── images/           # Add your thumbnails and album art here
    └── music/            # Add your .mp3 files here
```

---

## License

GPL-3.0-or-later — see [`LICENSE`](./LICENSE).

---

*Now Open Source — NRG*
