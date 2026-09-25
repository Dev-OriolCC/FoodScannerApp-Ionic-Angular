import { ContainsWarningId, ExcessWarningId, NOM051_THRESHOLDS as T } from "../constants/nom051";
import { ProductInfo } from "../services/openFoodFacts";

export type ProductWarnings = {
    excess: ExcessWarningId[];
    contains: ContainsWarningId[];
};

// Works out which NOM-051 warnings apply to a product.
// A missing nutrient value never produces a warning.
export function getWarnings(product: ProductInfo): ProductWarnings {
    const { kcal, sugars, saturatedFat, sodiumMg } = product.nutrients;
    const excess: ExcessWarningId[] = [];
    const contains: ContainsWarningId[] = [];

    if (kcal !== undefined) {
        const limit = product.isLiquid ? T.caloriesLiquidKcal : T.caloriesSolidKcal;

        if (kcal >= limit) {
            excess.push("calories");
        }
    }

    if (sugars !== undefined && kcal !== undefined && kcal > 0) {
        if ((sugars * 4) / kcal >= T.sugarsEnergyShare) {
            excess.push("sugars");
        }
    }

    if (saturatedFat !== undefined && kcal !== undefined && kcal > 0) {
        if ((saturatedFat * 9) / kcal >= T.saturatedFatEnergyShare) {
            excess.push("saturatedFat");
        }
    }

    if (sodiumMg !== undefined) {
        const isZeroCalorieLiquid = product.isLiquid && (kcal === undefined || kcal === 0);

        const exceedsSodium = isZeroCalorieLiquid
            ? sodiumMg >= T.sodiumZeroCalorieLiquidMg
            : sodiumMg >= T.sodiumMg || (kcal !== undefined && kcal > 0 && sodiumMg / kcal >= T.sodiumMgPerKcal);

        if (exceedsSodium) {
            excess.push("sodium");
        }
    }

    if (product.hasCaffeine) contains.push("caffeine");
    if (product.hasSweeteners) contains.push("sweeteners");
    if (product.hasColorants) contains.push("colorants");

    return { excess, contains };
}

// True when Open Food Facts had none of the nutrients we check.
export function hasNutritionData(product: ProductInfo): boolean {
    return Object.values(product.nutrients).some((value) => value !== undefined);
}
