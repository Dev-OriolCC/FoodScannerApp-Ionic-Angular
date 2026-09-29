import { create } from "zustand";
import { ProductInfo } from "../services/openFoodFacts";
import { deleteScan, fetchScanHistory, saveScan, ScannedProduct, setFavorite } from "../services/scanHistory";

export type { ScannedProduct };

type ScanState = {
    // Clerk user the history belongs to. Null when signed out.
    userId: string | null;
    products: ScannedProduct[];
    isLoading: boolean;
    loadError: string;
    loadHistory: (userId: string) => Promise<void>;
    reset: () => void;
    addScan: (product: ProductInfo) => Promise<void>;
    removeScan: (barcode: string) => Promise<void>;
    toggleFavorite: (barcode: string) => Promise<void>;
};

// Scan history of the signed-in user, loaded from Supabase.
// Newest scan first. Scanning a product again moves it to the top.
export const useScanStore = create<ScanState>()((set, get) => ({
    userId: null,
    products: [],
    isLoading: false,
    loadError: "",

    loadHistory: async (userId) => {
        set({ userId, isLoading: true, loadError: "" });

        try {
            const products = await fetchScanHistory();

            // The user may have signed out or switched accounts while loading.
            if (get().userId === userId) {
                set({ products, isLoading: false });
            }
        } catch {
            if (get().userId === userId) {
                set({ isLoading: false, loadError: "Could not load your history." });
            }
        }
    },

    reset: () => set({ userId: null, products: [], isLoading: false, loadError: "" }),

    addScan: async (product) => {
        const userId = get().userId;

        if (!userId) {
            throw new Error("Cannot save a scan while signed out");
        }

        const saved = await saveScan(userId, product);

        set((state) => ({
            products: [saved, ...state.products.filter((item) => item.barcode !== saved.barcode)],
        }));
    },

    // Removed from the list right away, and put back if Supabase fails.
    removeScan: async (barcode) => {
        const previous = get().products;
        set({ products: previous.filter((item) => item.barcode !== barcode) });

        try {
            await deleteScan(barcode);
        } catch (error) {
            set({ products: previous });
            throw error;
        }
    },

    // The star changes right away, and changes back if Supabase fails.
    toggleFavorite: async (barcode) => {
        const previous = get().products;
        const product = previous.find((item) => item.barcode === barcode);

        if (!product) {
            return;
        }

        set({
            products: previous.map((item) =>
                item.barcode === barcode ? { ...item, isFavorite: !item.isFavorite } : item
            ),
        });

        try {
            await setFavorite(barcode, !product.isFavorite);
        } catch (error) {
            set({ products: previous });
            throw error;
        }
    },
}));
