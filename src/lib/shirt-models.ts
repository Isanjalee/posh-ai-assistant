export type ShirtModel = {
  id: string;
  name: string;
  badge: string;
  description: string;
  modelPath: string;
  assetPrompt: string;
};

const basePrompt = `A realistic but low-poly 3D model of a plain T-shirt designed for web-based 3D applications.

Style:
- Clean modern apparel
- Minimal folds, smooth fabric
- Not overly detailed, optimized for performance

Structure:
- Front, back, sleeves clearly defined
- Proper UV mapping for texture placement
- Flat chest area suitable for logo printing
- Symmetrical geometry

Material:
- Cotton fabric look
- Slight soft shading, not glossy

Pose:
- Default T-pose or slight natural drape
- No human body inside (standalone garment)

Technical requirements:
- Low polygon count optimized for real-time rendering
- Clean topology
- Export as GLB/GLTF format
- Centered pivot
- Proper scale for realistic human size

Color:
- Plain white base color

UV mapping:
- Large flat UV island on front chest area
- Separate UV areas for front, back, sleeves
- Suitable for dynamic texture overlay (logo and text placement)

Use case:
- T-shirt customization web app with logo placement and color changes`;

export const shirtModels: ShirtModel[] = [
  {
    id: "classic",
    name: "Classic Round Neck",
    badge: "Best seller",
    description: "Regular short sleeves with a clean everyday silhouette.",
    modelPath: "/models/classic-round-neck.glb",
    assetPrompt: `${basePrompt}

Collar:
- Classic round neck collar
- Ribbed collar detail`,
  },
  {
    id: "polo",
    name: "Polo Shirt",
    badge: "Smart casual",
    description: "Collared body with a front placket for branded teamwear.",
    modelPath: "/models/polo-shirt.glb",
    assetPrompt: `${basePrompt}

Collar:
- Polo collar with placket
- Two or three buttons

Style:
- Slightly structured fabric`,
  },
  {
    id: "vneck",
    name: "V-Neck Tee",
    badge: "Fashion fit",
    description: "Sharpened neckline for premium lifestyle drops.",
    modelPath: "/models/v-neck.glb",
    assetPrompt: `${basePrompt}

Collar:
- V-shaped neckline
- Clean sharp edges`,
  },
  {
    id: "raglan",
    name: "Raglan Tee",
    badge: "Sport cut",
    description: "Contrast sleeves inspired by training and club apparel.",
    modelPath: "/models/raglan-tee.glb",
    assetPrompt: `${basePrompt}

Sleeves:
- Raglan sleeve style with diagonal seam from collar to underarm
- Different sleeve color region separation`,
  },
  {
    id: "longsleeve",
    name: "Long Sleeve Lite",
    badge: "Layer ready",
    description: "Extended sleeves with hoodie-ready proportions for later upgrades.",
    modelPath: "/models/long-sleeve-lite.glb",
    assetPrompt: `${basePrompt}

Sleeves:
- Full-length sleeves

Optional:
- Simple hood with low detail`,
  },
];
