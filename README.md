# arvocab — WebAR Vocabulary Learning App

A browser-based Augmented Reality app that teaches vocabulary by overlaying 3D models and word cards onto physical Hiro markers in real time. No app installation required — runs entirely in the browser.

---

## Table of Contents

- [Demo](#demo)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Model](#data-model)
- [Adding New Words](#adding-new-words)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## Demo

1. Open the app in a browser
2. Click **Start Learning**
3. Point your camera at a [Hiro marker](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)
4. A 3D model appears on the marker with a word card showing the word, phonetic pronunciation, and an example sentence
5. Tap **Pronounce** to hear the word spoken aloud

---

## How It Works

```
User opens browser
       │
       ▼
  Home page (/)          ← Next.js React page
       │
  Click "Start Learning"
       │
       ▼
  /ar route              ← Next.js client component
       │
  Redirects to /ar.html  ← Bypasses Next.js bundler (AR.js needs raw globals)
       │
       ▼
  ar.html loads
  ├── Fetches /data/words.json  → populates word card DOM
  ├── Sets 3D model src         → A-Frame loads the .glb file
  └── Initializes A-Frame scene with AR.js
             │
             ▼
       Camera stream active
             │
       Hiro marker detected?
        ├── YES → show 3D model + word card
        └── NO  → show instruction overlay
```

### AR Pipeline

- **A-Frame** renders the 3D scene using WebGL
- **AR.js** processes the camera feed frame-by-frame, detects the Hiro marker pattern, and computes its pose (position + rotation) in 3D space
- A-Frame places the `<a-entity>` (3D model) anchored to the detected marker
- Two animations run on the entity: continuous Y-axis rotation (8 s/revolution) and a vertical float (2 s up/down cycle)
- `markerFound` / `markerLost` DOM events toggle the word card and instruction overlay

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.1.0 |
| UI | React | 18.2.0 |
| Language | TypeScript | 5.3.3 |
| 3D rendering | A-Frame | 1.4.0 (CDN) |
| AR tracking | AR.js | master (CDN) |
| 3D math/utils | Three.js | 0.160.0 |
| Linting | ESLint + eslint-config-next | 8.56.0 |

**Why A-Frame + AR.js over a native SDK?**
Both libraries run entirely in the browser with no native code. Users don't need to install anything — just open a URL. Marker-based tracking is deterministic and works reliably in varied lighting.

**Why is the AR experience a static HTML file instead of a Next.js page?**
AR.js attaches properties directly to `window` and `document` at load time. Next.js's module bundler re-executes scripts in a sandboxed scope, which breaks these global registrations. The `/ar` route is a thin Next.js client component that immediately redirects to `/ar.html` (served from `public/`), bypassing the bundler entirely.

---

## Architecture

```
arvocab/
├── app/                      Next.js App Router (React shell)
│   ├── layout.tsx            Root layout — sets HTML metadata
│   ├── page.tsx              Landing page (/)
│   ├── ar/page.tsx           AR route — redirects to /ar.html
│   └── globals.css           Base CSS reset
│
├── public/                   Static assets (served at /)
│   ├── ar.html               ★ Main AR experience
│   ├── data/
│   │   └── words.json        Vocabulary dataset (runtime source)
│   ├── audio/
│   │   └── apple.mp3         Pronunciation audio files
│   └── models/
│       └── apple.glb         3D models in GLTF binary format
│
├── data/
│   └── words.json            Source copy of vocabulary data
│
├── next.config.js            Next.js config (transpilePackages: three)
├── tsconfig.json             TypeScript config
└── package.json
```

### Data flow

```
public/data/words.json
        │
        │  fetch() at runtime inside ar.html
        ▼
  JavaScript block
        ├──► Populates #card-word, #card-phonetic, #card-sentence
        ├──► Sets <a-asset-item src="..."> to load the .glb model
        └──► Stores audio path for playAudio()
```

---

## Project Structure

### `app/layout.tsx`

Root HTML wrapper. Sets the page `<title>` to **"WebAR Educational MVP"** and the description meta tag. Wraps all routes in a single `<body>`.

### `app/page.tsx`

Landing page rendered at `/`. Contains:
- Gradient background (`#0f0c29 → #302b63 → #24243e`)
- App title with gradient text clip effect
- Tagline and camera-access disclaimer
- `<Link href="/ar">` button that navigates to the AR experience

No client-side JS — fully server-rendered.

### `app/ar/page.tsx`

Client component (`'use client'`). On mount (`useEffect`), sets `window.location.href = '/ar.html'`. While redirecting, renders a branded loading spinner to avoid a blank flash.

### `public/ar.html`

The entire AR experience in a single HTML file. Key sections:

| Section | Purpose |
|---|---|
| `#loading-screen` | Full-screen overlay shown while A-Frame initializes. Hidden 800 ms after the `loaded` event fires. |
| `#instruction-overlay` | Pill-shaped banner at the top telling the user to point at the Hiro marker. Hidden when marker is found. |
| `#word-card` | Frosted-glass card at the bottom showing the word, phonetic, sentence, and pronounce button. Shown when marker is found. |
| `<a-scene>` | A-Frame root. Configures AR.js (`sourceType: webcam`, `mono_and_matrix` detection). |
| `<a-marker preset="hiro">` | Anchors all child entities to the Hiro marker. |
| `<a-entity gltf-model>` | The 3D model. Loads from `<a-asset-item>` whose `src` is set dynamically from `words.json`. |
| `<script>` block | Fetches `words.json`, populates the DOM, handles audio playback, and listens to marker events. |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- A device with a **camera** (webcam or phone)
- A printed or on-screen **Hiro marker** — download it here:
  `https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png`

### Installation

```bash
# Clone or download the project
git clone <repo-url>
cd arvocab

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Camera on localhost**: Most browsers (Chrome, Firefox, Edge) allow camera access on `localhost` without HTTPS. On any other hostname, HTTPS is required — see [Deployment](#deployment).

### Building for production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Data Model

Each word entry in `public/data/words.json` follows this schema:

```json
{
  "id": 1,
  "word": "Apple",
  "phonetic": "/ˈæp.əl/",
  "sentence": "I eat an apple every day.",
  "audio": "/audio/apple.mp3",
  "model": "/models/apple.glb"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier (integer, 1-based) |
| `word` | `string` | The vocabulary word (displayed in the card heading) |
| `phonetic` | `string` | IPA pronunciation notation |
| `sentence` | `string` | Example sentence using the word |
| `audio` | `string` | Absolute path to the `.mp3` file under `public/` |
| `model` | `string` | Absolute path to the `.glb` file under `public/` |

The AR experience currently loads `data[0]` (the first entry). To support multiple words, add navigation UI — see [Roadmap](#roadmap).

---

## Adding New Words

### Step 1 — Add the audio file

Place an `.mp3` file in `public/audio/`:

```
public/audio/banana.mp3
```

### Step 2 — Add the 3D model

Place a `.glb` (GLTF binary) file in `public/models/`:

```
public/models/banana.glb
```

Free `.glb` model sources:
- [Poly Pizza](https://poly.pizza) — free, attribution required
- [Sketchfab](https://sketchfab.com) — filter by "Downloadable" + "glTF"

### Step 3 — Add the word entry

Edit `public/data/words.json` (and keep `data/words.json` in sync):

```json
[
  {
    "id": 1,
    "word": "Apple",
    "phonetic": "/ˈæp.əl/",
    "sentence": "I eat an apple every day.",
    "audio": "/audio/apple.mp3",
    "model": "/models/apple.glb"
  },
  {
    "id": 2,
    "word": "Banana",
    "phonetic": "/bəˈnɑː.nə/",
    "sentence": "She peeled a banana for breakfast.",
    "audio": "/audio/banana.mp3",
    "model": "/models/banana.glb"
  }
]
```

### Step 4 — Update `ar.html` to navigate words (optional)

The script currently hardcodes `data[0]`. To cycle through words, change the fetch block to track an index and wire up prev/next buttons on the word card.

---

## Configuration

### `next.config.js`

```js
const nextConfig = {
  reactStrictMode: false,       // AR.js is sensitive to strict-mode double-renders
  transpilePackages: ['three'], // Three.js ships ESM; Next.js must transpile it
};
```

### AR.js scene attributes (`ar.html`)

```html
<a-scene
  arjs="sourceType: webcam;
        debugUIEnabled: false;
        detectionMode: mono_and_matrix;
        matrixCodeType: 3x3;"
  renderer="logarithmicDepthBuffer: true; colorManagement: true;"
  vr-mode-ui="enabled: false"
>
```

| Attribute | Value | Reason |
|---|---|---|
| `sourceType` | `webcam` | Use device camera stream |
| `debugUIEnabled` | `false` | Hides AR.js debug overlay in production |
| `detectionMode` | `mono_and_matrix` | Supports both pattern markers (Hiro) and matrix codes |
| `matrixCodeType` | `3x3` | 3×3 matrix code format |
| `logarithmicDepthBuffer` | `true` | Prevents z-fighting on flat surfaces |
| `colorManagement` | `true` | Correct sRGB color output |
| `vr-mode-ui` | `enabled: false` | Hides the VR headset button (not needed) |

### 3D model scale and position

```html
<a-entity
  gltf-model="#model-asset"
  scale="5 5 5"
  position="0 0.5 0"
>
```

Adjust `scale` and `position` per model — different `.glb` files have different internal units. A scale of `5 5 5` works for the included apple model (originally ~1 unit tall). If a new model appears too large or too small, tune the scale values.

---

## Deployment

### HTTPS requirement

Browsers enforce that `getUserMedia()` (camera access) only works on **secure origins**:

| Origin | Camera allowed? |
|---|---|
| `localhost` (any port) | Yes |
| `https://` (any host) | Yes |
| `http://` on non-localhost | **No** |

You must deploy behind HTTPS for any public or network-accessible URL.

### Recommended platforms

| Platform | Notes |
|---|---|
| **Vercel** | `vercel deploy` — automatic HTTPS, zero config for Next.js |
| **Netlify** | `netlify deploy` — automatic HTTPS |
| **Cloudflare Pages** | Free HTTPS, global CDN |
| **Self-hosted** | Nginx/Caddy with Let's Encrypt certificate |

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Next.js and deploys `public/` as static assets. The `ar.html` file is served at `/ar.html` with no extra config.

### Mobile testing on local network

To test on a phone while running `npm run dev`:

1. Find your machine's local IP:
   ```bash
   # Windows
   ipconfig

   # Mac / Linux
   ifconfig
   ```
2. Create an HTTPS tunnel with ngrok:
   ```bash
   npx ngrok http 3000
   ```
3. Open the `https://` ngrok URL on your phone

---

## Known Limitations

| Limitation | Detail |
|---|---|
| Single word displayed | Only `words[0]` is shown — no multi-word navigation yet |
| One shared marker | All words share the Hiro marker; can't distinguish words by marker |
| No camera-denied error screen | If the user blocks camera access the app shows a blank screen |
| CDN dependency | A-Frame and AR.js load from CDN URLs — app fails offline |
| No fallback for missing assets | Missing `.glb` or `.mp3` files fail silently |
| Large model file | `apple.glb` is 8 MB — slow to load on mobile over cellular |
| No user progress | Learning history is not stored anywhere |
| No tests | No unit, integration, or E2E test suite |

---

## Roadmap

### v0.2 — Multi-word support

- [ ] Next/prev word navigation on the word card
- [ ] Error screen when camera permission is denied
- [ ] "Marker not found" hint after 15 seconds with no detection
- [ ] Expand vocabulary dataset to 20+ words with matching audio and models

### v0.3 — Browse & progress

- [ ] `/words` page — browse all vocabulary without AR as a companion feature
- [ ] LocalStorage progress tracking — mark words as "learned"
- [ ] Model size optimization — compress `.glb` files with `gltf-pipeline`
- [ ] Vendor A-Frame and AR.js locally (remove CDN dependency for offline use)

### v1.0 — Full product

- [ ] Multiple unique markers — one per word
- [ ] Spaced repetition algorithm to resurface unlearned words
- [ ] Vocabulary categories and difficulty levels
- [ ] Backend API and database for dynamic word management
- [ ] Admin dashboard to add/edit words without editing JSON files
- [ ] User accounts and cross-device sync
- [ ] Accessibility: `aria-live` regions, keyboard support, captions
