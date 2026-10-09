import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { colors } from "../../theme";
import { ILLUSTRATION_HEIGHT, ILLUSTRATION_WIDTH } from "./constants";

// Onboarding hero colors from the mock; not part of the shared token set.
export const HERO_TOP = "#E3F2E6";
export const HERO_BOTTOM = "#EAF5EC";
const LINE_COLOR = "#CFE8D2";
const LINE_WIDTH = 18;

// How far the decoration reaches past the illustration box, so the lines run
// to the screen edges on any device width.
const BLEED_X = 200;
const BLEED_Y = 300;

// Soft mint gradient that fills the whole hero area.
export function HeroGradient() {
    return (
        <Svg style={StyleSheet.absoluteFill}>
            <Defs>
                <LinearGradient id="hero" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={HERO_TOP} />
                    <Stop offset="1" stopColor={HERO_BOTTOM} />
                </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#hero)" />
        </Svg>
    );
}

const DEFAULT_PATH = "M349 -150 L249 -50 L249 40 M-200 210 L72 210 L100 238 M330 101 L600 101 M159 330 L159 700";

const DEFAULT_SHAPES = (
    <>
        <Circle cx={53} cy={47} r={5} fill={colors.primary[500]} />
        {/* Small octagon, a nod to the NOM-051 seals. */}
        <Path d="M335 230 L347 230 L352 236 L352 247 L347 252 L335 252 L330 247 L330 236 Z" fill={colors.primary[300]} />
        <Circle cx={318} cy={384} r={8} fill={colors.accentLight} />
    </>
);

interface HeroLinesProps {
    // Line path, in illustration coordinates.
    path?: string;
    // Small SVG shapes drawn on top of the lines.
    shapes?: React.ReactNode;
}

// Thick "circuit" lines and small shapes behind the illustration. Drawn in the
// illustration's own coordinates (390 wide) so they always line up with it.
// Steps can pass their own path and shapes; the defaults are step 1's.
export function HeroLines({ path = DEFAULT_PATH, shapes = DEFAULT_SHAPES }: HeroLinesProps) {
    return (
        <View pointerEvents="none" style={styles.bleed}>
            <Svg
                width={ILLUSTRATION_WIDTH + BLEED_X * 2}
                height={ILLUSTRATION_HEIGHT + BLEED_Y * 2}
                viewBox={`${-BLEED_X} ${-BLEED_Y} ${ILLUSTRATION_WIDTH + BLEED_X * 2} ${ILLUSTRATION_HEIGHT + BLEED_Y * 2}`}
            >
                <Path
                    d={path}
                    stroke={LINE_COLOR}
                    strokeWidth={LINE_WIDTH}
                    strokeLinejoin="round"
                    fill="none"
                />

                {shapes}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    bleed: {
        position: "absolute",
        left: -BLEED_X,
        top: -BLEED_Y,
    },
});
