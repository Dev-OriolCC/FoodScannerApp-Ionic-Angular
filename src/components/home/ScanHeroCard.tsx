import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontFamily, spacing } from "../../theme";

// Hero-only colors from the home mock; not part of the token set.
const LINE_COLOR = "rgba(255,255,255,0.06)";
const PILL_BG = "rgba(255,255,255,0.15)";

// Bar widths for the fake EAN-13 barcode (spacing is spread evenly).
const BARS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2];

const CORNERS = ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const;

// Thick "circuit" lines behind the content, in card coordinates.
const LINES_PATH = "M180 -20 L180 40 L260 120 L260 150 L295 185 L460 185 M-20 300 L60 300 L100 340 L100 500";

interface ScanHeroCardProps {
    onScanPress: () => void;
}

// Big green card at the top of Home: title, barcode illustration and the scan button.
export function ScanHeroCard({ onScanPress }: ScanHeroCardProps) {
    const scan = useRef(new Animated.Value(0)).current;

    // Scan line sweeps up and down over the barcode.
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scan, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(scan, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            ]),
        );
        animation.start();

        return () => animation.stop();
    }, [scan]);

    const scanShift = scan.interpolate({ inputRange: [0, 1], outputRange: [-26, 26] });

    return (
        <View style={styles.card}>
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                <Path d={LINES_PATH} stroke={LINE_COLOR} strokeWidth={26} strokeLinejoin="round" fill="none" />
                <Circle cx={200} cy={34} r={6} fill={colors.primary[300]} />
            </Svg>

            <View style={styles.illustration} pointerEvents="none">
                <View style={styles.barcodeCard}>
                    <View style={styles.bars}>
                        {BARS.map((width, index) => (
                            <View key={index} style={[styles.barcodeBar, { width }]} />
                        ))}
                    </View>
                    <Text style={styles.barcodeDigits}>7 501234 567890</Text>
                </View>

                {CORNERS.map((corner) => (
                    <View key={corner} style={[styles.corner, styles[corner]]} />
                ))}

                <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanShift }] }]}>
                    <View style={styles.scanGlow} />
                    <View style={styles.scanCore} />
                </Animated.View>
            </View>

            <View style={styles.pill}>
                <View style={styles.pillDot} />
                <Text style={styles.pillText}>Ready to scan</Text>
            </View>

            <Text style={styles.title}>Let’s start scanning</Text>
            <Text style={styles.subtitle}>Scan a barcode to see which warning seals a product carries.</Text>

            <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onScanPress}>
                <MaterialCommunityIcons name="barcode-scan" size={26} color={colors.primary[700]} />
                <Text style={styles.buttonText}>Scan barcode</Text>
            </TouchableOpacity>
        </View>
    );
}

const BRACKET = { width: 26, height: 26, borderColor: colors.accent, position: "absolute" } as const;
const BRACKET_STROKE = 3;
const BRACKET_RADIUS = 8;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.primary[700],
        borderRadius: 32,
        overflow: "hidden",
        padding: spacing.xl,
    },

    /* text */
    pill: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: spacing.sm,
        height: 32,
        paddingHorizontal: spacing.md,
        borderRadius: 16,
        backgroundColor: PILL_BG,
    },
    pillDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent,
    },
    pillText: {
        fontFamily: fontFamily.medium,
        fontSize: 14,
        color: "#FFFFFF",
    },
    title: {
        // Narrow enough to wrap onto two lines next to the illustration.
        maxWidth: "60%",
        fontFamily: fontFamily.bold,
        fontSize: 34,
        lineHeight: 40,
        color: "#FFFFFF",
        marginTop: spacing.md,
    },
    subtitle: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        lineHeight: 22,
        color: "#FFFFFF",
        marginTop: spacing.lg,
    },

    /* button */
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.md,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#FFFFFF",
        marginTop: spacing.xl,
    },
    buttonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 18,
        color: colors.primary[700],
    },

    /* barcode illustration */
    illustration: {
        position: "absolute",
        top: 28,
        right: 16,
        width: 124,
        height: 114,
        alignItems: "center",
        justifyContent: "center",
    },
    barcodeCard: {
        width: 92,
        height: 72,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingTop: 8,
        transform: [{ rotate: "6deg" }],
    },
    bars: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 70,
        height: 42,
    },
    barcodeBar: {
        height: "100%",
        backgroundColor: colors.secondary[700],
    },
    barcodeDigits: {
        fontFamily: fontFamily.medium,
        fontSize: 7,
        letterSpacing: 1,
        color: colors.secondary[700],
        marginTop: 4,
    },
    corner: BRACKET,
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: BRACKET_STROKE,
        borderLeftWidth: BRACKET_STROKE,
        borderTopLeftRadius: BRACKET_RADIUS,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: BRACKET_STROKE,
        borderRightWidth: BRACKET_STROKE,
        borderTopRightRadius: BRACKET_RADIUS,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: BRACKET_STROKE,
        borderLeftWidth: BRACKET_STROKE,
        borderBottomLeftRadius: BRACKET_RADIUS,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: BRACKET_STROKE,
        borderRightWidth: BRACKET_STROKE,
        borderBottomRightRadius: BRACKET_RADIUS,
    },
    scanLine: {
        position: "absolute",
        left: 2,
        right: 2,
        top: 52,
        height: 10,
        justifyContent: "center",
    },
    scanGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 5,
        backgroundColor: colors.accent,
        opacity: 0.18,
    },
    scanCore: {
        height: 2,
        borderRadius: 1,
        backgroundColor: colors.accent,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
    },
});
