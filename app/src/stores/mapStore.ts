import { create } from "zustand";
import { DEMO_CENTER } from "@/lib/demo/data";

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  activeTypeFilter: string;
  activeNeighbourhood: string;
  activeFeatureFilters: string[];
  selectedPlaceId: string | null;
  showList: boolean;
  searchQuery: string;
  filterPanelOpen: boolean;

  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setActiveTypeFilter: (type: string) => void;
  setActiveNeighbourhood: (neighbourhood: string) => void;
  toggleFeatureFilter: (feature: string) => void;
  clearAllFilters: () => void;
  setSelectedPlaceId: (id: string | null) => void;
  setShowList: (show: boolean) => void;
  toggleShowList: () => void;
  setSearchQuery: (query: string) => void;
  setFilterPanelOpen: (open: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: DEMO_CENTER,
  zoom: 15,
  activeTypeFilter: "all",
  activeNeighbourhood: "all",
  activeFeatureFilters: [],
  selectedPlaceId: null,
  showList: false,
  searchQuery: "",
  filterPanelOpen: false,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setActiveTypeFilter: (type) =>
    set({ activeTypeFilter: type, selectedPlaceId: null }),
  setActiveNeighbourhood: (neighbourhood) =>
    set({ activeNeighbourhood: neighbourhood, selectedPlaceId: null }),
  toggleFeatureFilter: (feature) =>
    set((s) => ({
      activeFeatureFilters: s.activeFeatureFilters.includes(feature)
        ? s.activeFeatureFilters.filter((f) => f !== feature)
        : [...s.activeFeatureFilters, feature],
    })),
  clearAllFilters: () =>
    set({
      activeTypeFilter: "all",
      activeNeighbourhood: "all",
      activeFeatureFilters: [],
      searchQuery: "",
    }),
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
  setShowList: (show) => set({ showList: show }),
  toggleShowList: () => set((s) => ({ showList: !s.showList })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
}));
