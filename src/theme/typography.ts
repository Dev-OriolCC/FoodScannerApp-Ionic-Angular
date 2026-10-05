/**
 * Sellómetro design system — typography.
 *
 * Fonts are loaded (see `theme/fonts.ts`) as separate static weights, so on
 * native each weight is its own `fontFamily` string — plain CSS `fontWeight`
 * won't switch faces. Pair a size from `textStyles` with a family from
 * `fontFamily` (or the matching `font-*` / `text-*` NativeWind classes).
 *
 * - Inter: all UI text.
 * - Bricolage Grotesque (`display`): the "Sellómetro" brand title only.
 * - Barlow Condensed (`badge*`): NOM-051 octagon badges only.
 */
export const fontFamily = {
    light: "Inter_300Light",
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    display: "BricolageGrotesque_700Bold",
    badge: "BarlowCondensed_700Bold",
    badgeExtraBold: "BarlowCondensed_800ExtraBold",
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
