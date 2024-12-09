import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  currentPage: string;
  selectedStockId: string | null;
  toggleCollapse: () => void;
  setCurrentPage: (page: string) => void;
  setSelectedStockId: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  currentPage: 'dashboard',
  selectedStockId: null,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedStockId: (id) => set({ selectedStockId: id }),
}));