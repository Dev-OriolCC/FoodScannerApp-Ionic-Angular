/**
 * Sellómetro design system — border radius scale.
 * Mirrors the `--radius-*` tokens in `global.css` (usable as `rounded-md`, etc).
 */
export const radius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
} as const;

export type Radius = typeof radius;
