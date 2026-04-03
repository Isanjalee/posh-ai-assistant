export type OrderType = "corporate" | "campus" | "custom";
export type ShirtModelId = "round-neck" | "polo" | "v-neck" | "raglan" | "long-sleeve";
export type PrintPlacement = "left-chest" | "center-chest" | "full-back" | "left-sleeve" | "right-sleeve";
export type PreviewView = "front" | "back" | "left" | "right" | "front-angle" | "back-angle";
export type OrderStatus = "new" | "design-review" | "quoted" | "production-ready";

export type ShirtModel = {
  id: ShirtModelId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  modelPath: string;
  suitableFor: OrderType[];
};

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type SizeBreakdown = {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
};

export type FitSplit = {
  male: number;
  female: number;
};

export type OrderDraft = {
  orderType: OrderType;
  shirtModelId: ShirtModelId;
  baseColorId: string;
  customText: string;
  designIdea: string;
  logoDataUrl: string | null;
  printPlacement: PrintPlacement;
  quantity: number;
  sizeBreakdown: SizeBreakdown;
  fitSplit: FitSplit;
  notes: string;
  deadline: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  activeView: PreviewView;
};

export type SubmittedOrder = OrderDraft & {
  id: string;
  createdAt: string;
  status: OrderStatus;
};
