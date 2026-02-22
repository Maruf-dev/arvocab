# WebAR Educational MVP

A simple but powerful browser-based AR vocabulary learning tool built with Next.js, Three.js, and AR.js.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open AR Page:**
   Navigate to `https://localhost:3000/ar` on your mobile device or a laptop with a webcam.
   > [!NOTE]
   > AR.js requires HTTPS for camera access. In development, you may need to use a tunneling service like `ngrok` or rely on localhost being trusted by some browsers.

4. **Use Hiro Marker:**
   Point your camera at a Hiro marker. You can find one [here](https://en.wikipedia.org/wiki/File:Hiro_marker_ARjs.png).

## Project Structure

- `/app/ar/page.tsx`: The main AR experience.
- `/data/words.json`: Static data source for vocabulary items.
- `/public/models/`: GLB models.
- `/public/audio/`: Pronunciation audio files.

## Features

- **Marker-based AR:** Uses the Hiro marker for stable tracking.
- **3D Interactive Model:** Dynamically loaded GLB models with hover/rotation animations.
- **Floating UI:** Displays word, phonetic, and example sentence when marker is detected.
- **Audio Pronunciation:** Button to play audio using the Web Audio API.
- **Responsive Design:** Works on mobile and desktop browsers.
