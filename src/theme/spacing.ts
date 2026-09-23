/**
 * Sellómetro design system — spacing scale.
 * Mirrors the `--spacing-*` tokens in `global.css` (usable as `p-md`, `gap-lg`, etc).
 */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
} as const;

export type Spacing = typeof spacing;
