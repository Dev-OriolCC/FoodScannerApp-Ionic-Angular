import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductInfo } from "../services/openFoodFacts";

export type ScannedProduct = ProductInfo & {
    scannedAt: number;
    isFavorite: boolean;
};

type ScanState = {
    products: ScannedProduct[];
    addScan: (product: ProductInfo) => void;
    removeScan: (barcode: string) => void;
    toggleFavorite: (barcode: string) => void;
};

// Scan history, saved on the device with AsyncStorage.
// Newest scan first. Scanning a product again moves it to the top.
export const useScanStore = create<ScanState>()(
    persist(
        (set) => ({
            products: [],

            addScan: (product) =>
                set((state) => {
                    const existing = state.products.find((item) => item.barcode === product.barcode);
                    const others = state.products.filter((item) => item.barcode !== product.barcode);

                    return {
                        products: [
                            { ...product, scannedAt: Date.now(), isFavorite: existing?.isFavorite ?? false },
                            ...others,
                        ],
                    };
                }),

            removeScan: (barcode) =>
                set((state) => ({
                    products: state.products.filter((item) => item.barcode !== barcode),
                })),

            toggleFavorite: (barcode) =>
                set((state) => ({
                    products: state.products.map((item) =>
                        item.barcode === barcode ? { ...item, isFavorite: !item.isFavorite } : item
                    ),
                })),
        }),
        {
            name: "scan-history",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
