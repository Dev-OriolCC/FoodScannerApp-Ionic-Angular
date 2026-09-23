import { Platform, ViewStyle } from "react-native";

/**
 * Sellómetro design system — elevation levels.
 * React Native has no CSS `box-shadow`, so these are plain style objects
 * (spread onto a `View`'s `style` prop) rather than NativeWind classes.
 *
 * Level 1 — resting elements (cards, list items)
 * Level 2 — interactive elements (pressed/raised buttons)
 * Level 3 — modals & overlays
 */
function elevation(level: 1 | 2 | 3): ViewStyle {
    const config = {
        1: { offset: 1, opacity: 0.06, radius: 2, elevation: 1 },
        2: { offset: 2, opacity: 0.1, radius: 4, elevation: 4 },
        3: { offset: 4, opacity: 0.16, radius: 12, elevation: 8 },
    }[level];

    return Platform.select<ViewStyle>({
        android: { elevation: config.elevation },
        default: {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: config.offset },
            shadowOpacity: config.opacity,
            shadowRadius: config.radius,
        },
    }) as ViewStyle;
}

export const shadows = {
    level1: elevation(1),
    level2: elevation(2),
    level3: elevation(3),
} as const;

export type Shadows = typeof shadows;
