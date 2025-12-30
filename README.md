# Neon Survival

A 3D first-person wave survival shooter with neon cyberpunk aesthetics built with React Three Fiber.

## Play

Survive waves of glowing geometric enemies in a neon arena. Kill enemies to score points and advance through increasingly difficult waves.

### Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look/Aim |
| Left Click | Shoot |
| R | Reload |
| ESC | Pause |

## Tech Stack

- **React 18** + **TypeScript**
- **React Three Fiber** + **Drei** - 3D rendering
- **@react-three/postprocessing** - Bloom & vignette effects
- **Zustand** - State management
- **Framer Motion** - UI animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite and deploys

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Game Features

- **3 Enemy Types**
  - Cube (magenta) - Direct chase
  - Sphere (cyan) - Fast zigzag movement
  - Polyhedron (green) - Slow tank, spawns wave 3+

- **Wave System** - Scaling difficulty with more enemies each wave
- **Score System** - Kill streak multipliers up to 2x
- **Visual Effects** - Bloom, particles, screen shake, damage flash
- **Responsive UI** - Animated HUD with health, ammo, wave, and score

## License

MIT
