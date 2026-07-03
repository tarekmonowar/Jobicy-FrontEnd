// Cross-cutting UI preferences — currency toggle, saved view, sidebar state.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = 'BDT' | 'USD';
type SavedView = 'grid' | 'list';

type UiStore = {
  currency: Currency;
  savedView: SavedView;
  sidebarOpen: boolean;
  setCurrency: (currency: Currency) => void;
  setSavedView: (view: SavedView) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

/** UI prefs persisted to localStorage (currency + saved jobs view). */
export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      currency: 'BDT',
      savedView: 'grid',
      sidebarOpen: true,

      setCurrency: (currency) => set({ currency }),
      setSavedView: (savedView) => set({ savedView }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
    }),
    {
      name: 'joblens-ui',
      partialize: (state) => ({
        currency: state.currency,
        savedView: state.savedView,
      }),
    },
  ),
);
