// Scan history stored in Supabase (table "scan_history", see supabase/scan_history.sql).
// RLS only returns and changes the rows of the signed-in Clerk user.

import { supabase } from "../lib/supabase";
import { getHealthStatus, getWarnings, HealthStatus } from "../lib/nom051";
import { ContainsWarningId, ExcessWarningId } from "../constants/nom051";
import { ProductInfo } from "./openFoodFacts";

const TABLE = "scan_history";

export type ScannedProduct = ProductInfo & {
    scannedAt: number;
    isFavorite: boolean;
    healthStatus: HealthStatus;
};

// One row of the table, as Supabase returns it.
type ScanHistoryRow = {
    id: string;
    user_id: string;
    barcode: string;
    name: string;
    brand: string | null;
    image_url: string | null;
    is_liquid: boolean;
    kcal: number | null;
    sugars: number | null;
    saturated_fat: number | null;
    sodium_mg: number | null;
    has_caffeine: boolean;
    has_sweeteners: boolean;
    has_colorants: boolean;
    excess_warnings: ExcessWarningId[];
    contains_warnings: ContainsWarningId[];
    health_status: HealthStatus;
    is_favorite: boolean;
    scanned_at: string;
    created_at: string;
};

function toScannedProduct(row: ScanHistoryRow): ScannedProduct {
    return {
        barcode: row.barcode,
        name: row.name,
        brand: row.brand ?? undefined,
        imageUrl: row.image_url ?? undefined,
        isLiquid: row.is_liquid,
        nutrients: {
            kcal: row.kcal ?? undefined,
            sugars: row.sugars ?? undefined,
            saturatedFat: row.saturated_fat ?? undefined,
            sodiumMg: row.sodium_mg ?? undefined,
        },
        hasCaffeine: row.has_caffeine,
        hasSweeteners: row.has_sweeteners,
        hasColorants: row.has_colorants,
        scannedAt: new Date(row.scanned_at).getTime(),
        isFavorite: row.is_favorite,
        healthStatus: row.health_status,
    };
}

// Newest scan first.
export async function fetchScanHistory(): Promise<ScannedProduct[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("scanned_at", { ascending: false });

    if (error) {
        throw error;
    }

    return (data as ScanHistoryRow[]).map(toScannedProduct);
}

// Adds the scan, or updates it (and its date) if the user scanned this product before.
// is_favorite isn't sent, so a favorite stays a favorite after scanning it again.
export async function saveScan(userId: string, product: ProductInfo): Promise<ScannedProduct> {
    const warnings = getWarnings(product);

    const { data, error } = await supabase
        .from(TABLE)
        .upsert(
            {
                user_id: userId,
                barcode: product.barcode,
                name: product.name,
                brand: product.brand ?? null,
                image_url: product.imageUrl ?? null,
                is_liquid: product.isLiquid,
                kcal: product.nutrients.kcal ?? null,
                sugars: product.nutrients.sugars ?? null,
                saturated_fat: product.nutrients.saturatedFat ?? null,
                sodium_mg: product.nutrients.sodiumMg ?? null,
                has_caffeine: product.hasCaffeine,
                has_sweeteners: product.hasSweeteners,
                has_colorants: product.hasColorants,
                excess_warnings: warnings.excess,
                contains_warnings: warnings.contains,
                health_status: getHealthStatus(product),
                scanned_at: new Date().toISOString(),
            },
            { onConflict: "user_id,barcode" }
        )
        .select()
        .single();

    if (error) {
        throw error;
    }

    return toScannedProduct(data as ScanHistoryRow);
}

export async function deleteScan(barcode: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("barcode", barcode);

    if (error) {
        throw error;
    }
}

export async function setFavorite(barcode: string, isFavorite: boolean): Promise<void> {
    const { error } = await supabase.from(TABLE).update({ is_favorite: isFavorite }).eq("barcode", barcode);

    if (error) {
        throw error;
    }
}
