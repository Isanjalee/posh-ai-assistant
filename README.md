# TeeCraft 3D

B2B apparel ordering platform built with Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber, Zustand, React Hook Form, and Zod.

## Product focus

- company T-shirt orders
- campus / university batch T-shirt orders
- custom T-shirt orders

## Current implementation

- landing page with product positioning and process overview
- guided multi-step design studio
- order type, model, color, design, placement, bulk details, and review steps
- desktop-visible order summary panel
- multi-view apparel preview sheet
- interactive 3D viewer scaffold for future real GLB models
- admin-style request summary page
- mock data for 5 shirt models
- typed Zustand store with persisted draft + submitted requests
- RHF + Zod validation for bulk order details

## Folder structure

```text
src/
  app/
    page.tsx
    studio/page.tsx
    requests/page.tsx
  components/
    marketing/
      landing-page.tsx
    requests/
      request-summary-page.tsx
    studio/
      design-studio-page.tsx
      order-stepper.tsx
      order-summary-panel.tsx
      tshirt-preview.tsx
    imported-shirt-model.tsx
  config/
    shirt-models.ts
  hooks/
    use-approval-workflow.ts
    use-save-draft.ts
  schemas/
    order-request.ts
  store/
    use-studio-store.ts
  types/
    order.ts
```

## Run

```bash
npm install
npm run dev
```

## Preview and model notes

Expected future GLB locations:

- `public/models/classic-round-neck.glb`
- `public/models/polo-shirt.glb`
- `public/models/v-neck.glb`
- `public/models/raglan-tee.glb`
- `public/models/long-sleeve-lite.glb`

Until those assets exist, the studio uses a clean procedural fallback T-shirt so the workflow remains usable.

## Roadmap

- real API persistence for drafts and order submissions
- quote and pricing calculation
- sales approval workflow
- design review comments and revision loop
- production planning dashboard
- print-ready export
- authenticated admin dashboard

## Commit-friendly implementation order

1. scaffold shared order types and shirt config
2. add Zustand draft store and submission store
3. add Zod schema and React Hook Form integration
4. build landing page
5. build stepper and summary panel
6. build multi-view preview sheet
7. add interactive 3D viewer scaffold
8. implement steps 1 to 3
9. implement steps 4 to 5
10. implement bulk order form step
11. implement review and submit flow
12. build request summary page
13. add TODO hooks for save draft and approval workflow
14. document structure and roadmap in README

## TODO markers already included

Search for `TODO:` in the codebase to find the planned extension points.
