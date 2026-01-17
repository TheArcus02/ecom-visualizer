import { create } from 'zustand';

export interface PrefilledItem {
  productId: string;
}

interface FittingRoomStore {
  isOpen: boolean;
  prefilledItems: PrefilledItem[];
  openFittingRoom: (items?: PrefilledItem[]) => void;
  closeFittingRoom: () => void;
}

export const useFittingRoomStore = create<FittingRoomStore>()((set) => ({
  isOpen: false,
  prefilledItems: [],

  openFittingRoom: (items = []) => {
    set({ isOpen: true, prefilledItems: items });
  },

  closeFittingRoom: () => {
    set({ isOpen: false, prefilledItems: [] });
  },
}));
