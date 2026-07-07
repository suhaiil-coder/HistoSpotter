# MedSpotter

A dark-themed histology spot-diagnosis quiz app. Users identify microscopy slides mentally, reveal answers, and track their scores. Includes a real-time community chat — no sign-in required, just pick a name.

## Deploy

Click the **Deploy** button on [Vercel](https://vercel.com) and import this repo. It deploys as a static site with client-side routing.

- **Framework Preset**: `Other` (static)
- **Root Directory**: `/` (repo root, or wherever these files are)
- The `vercel.json` handles SPA routing so all paths serve `index.html`.

## Features

- 62 histology slides across 11 categories
- Spot-diagnosis mode with optional timer
- Identifying features panel after reveal
- Real-time community chat (guest-only)
- Score tracking and missed-slide review
- Sound effects (tick, warning, timeout, correct, wrong)
- Dark theme with Inter font

## Built with

- React + React Native Web (Expo Router)
- TypeScript
- Web Audio API for sound effects
- WebSocket for real-time chat

## Notes

- The chat requires a running WebSocket server (`ws://your-domain/api/chat/ws`).
- The app is a single-page application — all routing is client-side.
