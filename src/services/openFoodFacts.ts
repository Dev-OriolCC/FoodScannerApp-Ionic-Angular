// Open Food Facts client. We only need one endpoint, so plain fetch is enough.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/

const BASE_URL = "https://world.openfoodfacts.org/api/v2/product";

// Ask only for the fields we use, which keeps the response small.
const FIELDS = [
    "code",
    "product_name",
    "brands",
    "quantity",
    "image_front_small_url",
    "nutriments",
    "additives_tags",
    "ingredients_tags",
    "categories_tags",
].join(",");

// Additive codes for non-caloric sweeteners.
const SWEETENER_CODES = [
    "en:e950", // acesulfame K
    "en:e951", // aspartame
    "en:e952", // cyclamate
    "en:e954", // saccharin
    "en:e955", // sucralose
    "en:e957", // thaumatin
    "en:e959", // neohesperidin DC
    "en:e960", // steviol glycosides
    "en:e961", // neotame
    "en:e962", // aspartame-acesulfame salt
    "en:e969", // advantame
];

// Our own product shape. Screens never see raw Open Food Facts fields.
export type ProductInfo = {
    barcode: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    isLiquid: boolean;
    // Values per 100 g (solids) or 100 ml (liquids).
    nutrients: {
        kcal?: number;
        sugars?: number;
        saturatedFat?: number;
        sodiumMg?: number;
    };
    hasCaffeine: boolean;
    hasSweeteners: boolean;
    hasColorants: boolean;
};

type OffProduct = {
    code?: string;
    product_name?: string;
    brands?: string;
    quantity?: string;
    image_front_small_url?: string;
    nutriments?: Record<string, number | string | undefined>;
    additives_tags?: string[];
    ingredients_tags?: string[];
    categories_tags?: string[];
};

type OffResponse = {
    status: 0 | 1;
    product?: OffProduct;
};

function toNumber(value: unknown): number | undefined {
    const number = typeof value === "string" ? parseFloat(value) : value;

    return typeof number === "number" && Number.isFinite(number) ? number : undefined;
}

// Colorants are additives E100 to E199 (e.g. "en:e150d", "en:e102").
function isColorant(tag: string): boolean {
    const match = tag.match(/^en:e(\d{3})/);

    return match !== null && Number(match[1]) >= 100 && Number(match[1]) <= 199;
}

function toProductInfo(barcode: string, product: OffProduct): ProductInfo {
    const nutriments = product.nutriments ?? {};
    const additives = product.additives_tags ?? [];
    const categories = product.categories_tags ?? [];
    const sodiumGrams = toNumber(nutriments.sodium_100g);

    // "355 ml", "1.5 L", "33cl" count as liquids, as do beverage categories.
    const hasLiquidQuantity = /\d\s*(ml|cl|l)\b/i.test(product.quantity ?? "");

    return {
        barcode,
        name: product.product_name?.trim() || "Unnamed product",
        brand: product.brands?.split(",")[0]?.trim() || undefined,
        imageUrl: product.image_front_small_url,
        isLiquid: hasLiquidQuantity || categories.includes("en:beverages"),
        nutrients: {
            kcal: toNumber(nutriments["energy-kcal_100g"]),
            sugars: toNumber(nutriments.sugars_100g),
            saturatedFat: toNumber(nutriments["saturated-fat_100g"]),
            sodiumMg: sodiumGrams === undefined ? undefined : sodiumGrams * 1000,
        },
        hasCaffeine: (product.ingredients_tags ?? []).includes("en:caffeine"),
        hasSweeteners: additives.some((tag) => SWEETENER_CODES.includes(tag)),
        hasColorants: additives.some(isColorant),
    };
}

// Returns null when Open Food Facts doesn't have the product.
// Throws on network or server errors.
export async function fetchProduct(barcode: string): Promise<ProductInfo | null> {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`, {
        // Open Food Facts asks apps to identify themselves.
        headers: { "User-Agent": "FoodAppIgnite/1.0 (demo app)" },
    });

    // The API answers 404 with status 0 for unknown barcodes.
    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Open Food Facts request failed (${response.status})`);
    }

    const data: OffResponse = await response.json();

    if (data.status !== 1 || !data.product) {
        return null;
    }

    return toProductInfo(barcode, data.product);
}
