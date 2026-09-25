// NOM-051 front-of-pack warning rules, phase 3 (in force since October 2025).
//
// Simplifications for this app:
// - Open Food Facts gives total sugars, not "free" (added) sugars, so we use total sugars.
// - The norm only applies a warning when the nutrient was added to the product.
//   We don't have that information, so we check the values alone.

export const NOM051_THRESHOLDS = {
    // Solids: 275 kcal or more per 100 g.
    caloriesSolidKcal: 275,
    // Liquids: 70 kcal or more per 100 ml.
    caloriesLiquidKcal: 70,
    // Sugars: 10% or more of the total energy comes from sugars (1 g = 4 kcal).
    sugarsEnergyShare: 0.1,
    // Saturated fat: 10% or more of the total energy comes from saturated fat (1 g = 9 kcal).
    saturatedFatEnergyShare: 0.1,
    // Sodium: 1 mg or more per kcal...
    sodiumMgPerKcal: 1,
    // ...or 300 mg or more per 100 g.
    sodiumMg: 300,
    // Zero-calorie drinks: 45 mg or more per 100 ml.
    sodiumZeroCalorieLiquidMg: 45,
};

export type ExcessWarningId = "calories" | "sugars" | "saturatedFat" | "sodium";
export type ContainsWarningId = "caffeine" | "sweeteners" | "colorants";

// Text shown inside each black octagon, one entry per line.
export const EXCESS_LABELS: Record<ExcessWarningId, string[]> = {
    calories: ["EXCESO", "CALORÍAS"],
    sugars: ["EXCESO", "AZÚCARES"],
    saturatedFat: ["EXCESO", "GRASAS", "SATURADAS"],
    sodium: ["EXCESO", "SODIO"],
};

// Text shown inside each rectangular "contains" label.
export const CONTAINS_LABELS: Record<ContainsWarningId, string> = {
    caffeine: "CONTIENE CAFEÍNA",
    sweeteners: "CONTIENE EDULCORANTES",
    colorants: "CONTIENE COLORANTES",
};
