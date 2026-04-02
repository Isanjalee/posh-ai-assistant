# TeeCraft 3D

3D apparel customizer MVP built with Next.js, TypeScript, Tailwind CSS, React Three Fiber, and Three.js.

## Current MVP

- 5 apparel models
- color switching
- text and logo upload
- fixed print zones
- 3D rotate / zoom / camera presets
- design request form
- order summary

## Run

```bash
npm install
npm run dev
```

## GLB Asset Pipeline

The app now supports real `.glb` apparel assets when they are placed in `public/models/`.

Expected file names:

- `public/models/classic-round-neck.glb`
- `public/models/polo-shirt.glb`
- `public/models/v-neck.glb`
- `public/models/raglan-tee.glb`
- `public/models/long-sleeve-lite.glb`

If a file is missing, the UI automatically falls back to the procedural preview model so the app still works.

## Model Requirements

- lightweight for web
- clean topology
- flat chest UV area for logo placement
- separate UV regions for front, back, and sleeves
- centered pivot
- realistic scale
- exported as `.glb`

## Recommended Workflow

1. Generate or source the shirt model.
2. Open it in Blender.
3. Verify topology, UVs, and scale.
4. Reduce poly count if needed.
5. Export to `.glb`.
6. Drop the file into `public/models/` using the expected filename.

## Prompt Source

Per-model generation prompts and asset paths are stored in [src/lib/shirt-models.ts](src/lib/shirt-models.ts).
