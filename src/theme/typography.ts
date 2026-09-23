/**
 * Sellómetro design system — typography.
 *
 * Poppins is loaded (see `theme/fonts.ts`) as separate static weights, so on
 * native each weight is its own `fontFamily` string — plain CSS `fontWeight`
 * won't switch faces. Pair a size from `textStyles` with a family from
 * `fontFamily` (or the matching `font-poppins-*` / `text-*` NativeWind classes).
 */
export const fontFamily = {
    light: "Poppins_300Light",
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semiBold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
} as const;

export const textStyles = {
    h1: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 },
    h2: { fontFamily: fontFamily.semiBold, fontSize: 24, lineHeight: 32 },
    h3: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 28 },
    h4: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24 },
    body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
    small: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
    tiny: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
} as const;

export type FontFamily = typeof fontFamily;
export type TextStyles = typeof textStyles;
