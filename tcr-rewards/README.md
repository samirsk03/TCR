# TCR Loyalty Rewards App

A React + Vite loyalty rewards app for The Chocolate Room – Salunke Vihar.

## Tech Stack

- **Vite 5** + **React 18**
- **React Router v6**
- **Tailwind CSS v3**
- **Lucide React** icons

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## What Changed from Original

The original project used bleeding-edge Vite 8 / React 19 / Tailwind v4 with `@tailwindcss/vite`. This version has been migrated to **stable, widely-supported versions**:

| Package | Original | This Version |
|---------|----------|-------------|
| Vite | ^8.0.10 | ^5.4.1 |
| React | ^19.2.5 | ^18.3.1 |
| Tailwind CSS | ^4.2.4 | ^3.4.10 |
| React Router | ^7.14.2 | ^6.26.0 |
| lucide-react | ^1.11.0 | ^0.383.0 |

**No UI/UX changes** — all components, pages, styles, colors and layouts are identical.

The `index.css` now uses standard `@tailwind base/components/utilities` directives instead of the Tailwind v4 `@import "tailwindcss"` syntax.

## Project Structure

```
src/
├── context/         # AuthContext, CartContext, RewardsContext
├── components/      # Navbar, BottomNav
├── data/            # dummyData.js
├── pages/
│   ├── Home/
│   ├── Auth/        # Login, Signup, ResetPassword
│   ├── Menu/
│   ├── Rewards/     # Wallet
│   ├── Profile/
│   ├── Review/
│   └── Offers.jsx
├── App.jsx
├── main.jsx
└── index.css
```
