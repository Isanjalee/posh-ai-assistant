import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { OrderDraft, OrderType, PreviewView, PrintPlacement, ShirtModelId, SubmittedOrder } from "@/types/order";

type StudioStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type StudioStore = {
  currentStep: StudioStep;
  draft: OrderDraft;
  submittedOrders: SubmittedOrder[];
  setStep: (step: StudioStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  patchDraft: (patch: Partial<OrderDraft>) => void;
  setOrderType: (value: OrderType) => void;
  setModel: (value: ShirtModelId) => void;
  setPlacement: (value: PrintPlacement) => void;
  setPreviewView: (value: PreviewView) => void;
  submitDraft: () => SubmittedOrder;
  resetDraft: () => void;
};

const initialDraft: OrderDraft = {
  orderType: "corporate",
  shirtModelId: "round-neck",
  baseColorId: "white",
  customText: "POSH Apparel",
  designIdea: "Clean front logo with strong back messaging for a polished bulk order mockup.",
  logoDataUrl: null,
  printPlacement: "center-chest",
  quantity: 50,
  sizeBreakdown: { xs: 0, s: 4, m: 12, l: 18, xl: 10, xxl: 6 },
  fitSplit: { male: 30, female: 20 },
  notes: "Need a fast visual approval first, then we can move into production planning.",
  deadline: "",
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  activeView: "front-angle",
};

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      draft: initialDraft,
      submittedOrders: [],
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(7, state.currentStep + 1) as StudioStep })),
      previousStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) as StudioStep })),
      patchDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      setOrderType: (value) => set((state) => ({ draft: { ...state.draft, orderType: value } })),
      setModel: (value) => set((state) => ({ draft: { ...state.draft, shirtModelId: value } })),
      setPlacement: (value) => set((state) => ({ draft: { ...state.draft, printPlacement: value } })),
      setPreviewView: (value) => set((state) => ({ draft: { ...state.draft, activeView: value } })),
      submitDraft: () => {
        const state = get();
        const submission: SubmittedOrder = {
          ...state.draft,
          id: `REQ-${String(state.submittedOrders.length + 1).padStart(4, "0")}`,
          createdAt: new Date().toISOString(),
          status: "new",
        };
        set({ submittedOrders: [submission, ...state.submittedOrders], currentStep: 7 });
        return submission;
      },
      resetDraft: () => set({ draft: initialDraft, currentStep: 1 }),
    }),
    {
      name: "teecraft-studio",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft, submittedOrders: state.submittedOrders, currentStep: state.currentStep }),
    }
  )
);
