/**
 * Sellómetro design system — color palette.
 * Mirrors the `--color-*` tokens defined in `global.css` (Tailwind v4 `@theme`).
 * Use these for JS-side styling (StyleSheet, dynamic style props, icon colors);
 * use the matching Tailwind classes (e.g. `bg-primary-700`) inside NativeWind components.
 */
export const colors = {
    primary: {
        700: "#2E7D32",
        500: "#43A047",
        300: "#A5D6A7",
        100: "#E8F5E9",
    },
    secondary: {
        700: "#1B2A1C",
        500: "#4E5D52",
        300: "#A7B7AB",
        100: "#E7ECE9",
    },
    accent: "#00C853",
    accentLight: "#B9F6CA",
    semantic: {
        error: "#EF5350",
        warning: "#FB8C00",
        info: "#42A5F5",
        success: "#66BB6A",
    },
} as const;

export type Colors = typeof colors;
