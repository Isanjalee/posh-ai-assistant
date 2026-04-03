import type { ColorOption, OrderType, PrintPlacement, PreviewView, ShirtModel } from "@/types/order";

export const orderTypes: { id: OrderType; name: string; subtitle: string; description: string }[] = [
  {
    id: "corporate",
    name: "Corporate",
    subtitle: "Teamwear and promotional apparel",
    description: "For company uniforms, staff events, campaigns, and branded merchandise with guided print placements.",
  },
  {
    id: "campus",
    name: "Campus",
    subtitle: "Clubs, societies, and batch orders",
    description: "Built for universities, clubs, orientation teams, and class batch apparel with easy size planning.",
  },
  {
    id: "custom",
    name: "Custom",
    subtitle: "Creator and community drops",
    description: "Best for original T-shirt ideas, event drops, brand launches, and custom apparel concepts.",
  },
];

export const shirtModels: ShirtModel[] = [
  {
    id: "round-neck",
    name: "Round Neck",
    shortName: "Round",
    badge: "Most versatile",
    description: "Balanced everyday fit with a clean chest area for logos, team names, and event graphics.",
    modelPath: "/models/classic-round-neck.glb",
    suitableFor: ["corporate", "campus", "custom"],
  },
  {
    id: "polo",
    name: "Polo",
    shortName: "Polo",
    badge: "Corporate favorite",
    description: "Structured collar and placket, ideal for staff uniforms, promotional events, and office-ready apparel.",
    modelPath: "/models/polo-shirt.glb",
    suitableFor: ["corporate", "custom"],
  },
  {
    id: "v-neck",
    name: "V-Neck",
    shortName: "V-Neck",
    badge: "Lifestyle fit",
    description: "Sharper neckline for premium looking campaigns, lifestyle merchandise, and elevated casual teams.",
    modelPath: "/models/v-neck.glb",
    suitableFor: ["corporate", "custom"],
  },
  {
    id: "raglan",
    name: "Raglan",
    shortName: "Raglan",
    badge: "Campus sport",
    description: "Sport-inspired sleeve cut that works well for clubs, university events, and energetic merch drops.",
    modelPath: "/models/raglan-tee.glb",
    suitableFor: ["campus", "custom"],
  },
  {
    id: "long-sleeve",
    name: "Long Sleeve / Hoodie Lite",
    shortName: "Long Sleeve",
    badge: "Layer ready",
    description: "Extended-sleeve presentation for cooler weather programs, premium drops, and hoodie-ready follow-ups.",
    modelPath: "/models/long-sleeve-lite.glb",
    suitableFor: ["campus", "custom", "corporate"],
  },
];

export const colorOptions: ColorOption[] = [
  { id: "white", name: "White", hex: "#f5f1e6" },
  { id: "black", name: "Black", hex: "#171717" },
  { id: "navy", name: "Navy", hex: "#213a63" },
  { id: "red", name: "Red", hex: "#c44536" },
  { id: "green", name: "Green", hex: "#2f6b47" },
];

export const printPlacements: { id: PrintPlacement; name: string; helper: string }[] = [
  { id: "left-chest", name: "Left chest", helper: "Small brand marks, club crests, and employee identifiers." },
  { id: "center-chest", name: "Center chest", helper: "The safest default for logos, slogans, and campaign graphics." },
  { id: "full-back", name: "Full back", helper: "Large print area for batch names, event branding, and statement art." },
  { id: "left-sleeve", name: "Left sleeve", helper: "Great for smaller icons, tags, or sponsor marks." },
  { id: "right-sleeve", name: "Right sleeve", helper: "Mirrors the left sleeve for secondary branding or team marks." },
];

export const previewViews: { id: PreviewView; name: string }[] = [
  { id: "front", name: "Front" },
  { id: "back", name: "Back" },
  { id: "left", name: "Left" },
  { id: "right", name: "Right" },
  { id: "front-angle", name: "Front angle" },
  { id: "back-angle", name: "Back angle" },
];
