import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";

// Phone mock-up colors from the onboarding design; not part of the token set.
const SCREEN_TOP_BG = "#556458";
const SCREEN_BG = "#F3EFE6";
const PLACEHOLDER_LIGHT = "#E3E7E3";
const PLACEHOLDER_DARK = "#8D9A90";
const PLACEHOLDER_TAN = "#DDD6C8";

// Bar widths for the fake EAN-13 barcode (spacing is spread evenly).
const BARS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2];

const CORNERS = ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const;

// Step 1 illustration: a phone scanning a barcode, with two floating status
// cards. Drawn in the 390 x 360 onboarding illustration box.
export function ScanIllustration() {
    const scan = useRef(new Animated.Value(0)).current;
    const float = useRef(new Animated.Value(0)).current;

    // Scan line sweeps over the barcode; the cards bob gently.
    useEffect(() => {
        const loop = (value: Animated.Value, duration: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    Animated.timing(value, { toValue: -1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                ]),
            );

        const animations = [loop(scan, 900), loop(float, 1600)];
        animations.forEach((animation) => animation.start());

        return () => animations.forEach((animation) => animation.stop());
    }, [scan, float]);

    const scanShift = scan.interpolate({ inputRange: [-1, 1], outputRange: [-26, 26] });
    const floatUp = float.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] });
    const floatDown = float.interpolate({ inputRange: [-1, 1], outputRange: [4, -4] });

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={styles.phone}>
                <View style={styles.scanningPill}>
                    <View style={styles.scanningDot} />
                    <Text style={styles.scanningText}>Scanning</Text>
                </View>

                <View style={styles.screen}>
                    <View style={styles.screenTop}>
                        <View style={[styles.bar, styles.topBarWide]} />
                        <View style={[styles.bar, styles.topBarShort]} />
                    </View>

                    <View style={[styles.bar, styles.tanBar, { top: 72, width: 96 }]} />
                    <View style={[styles.bar, styles.tanBar, { top: 83, width: 70 }]} />

                    <View style={styles.barcodeCard}>
                        <View style={styles.bars}>
                            {BARS.map((width, index) => (
                                <View key={index} style={[styles.barcodeBar, { width }]} />
                            ))}
                        </View>
                        <Text style={styles.barcodeDigits}>7 501234 567890</Text>
                    </View>

                    <View style={styles.frame}>
                        {CORNERS.map((corner) => (
                            <View key={corner} style={[styles.corner, styles[corner]]} />
                        ))}
                    </View>

                    <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanShift }] }]}>
                        <View style={styles.scanGlow} />
                        <View style={styles.scanCore} />
                    </Animated.View>
                </View>

                <View style={styles.shutter} />
            </View>

            <Animated.View style={[styles.card, styles.foundCard, { transform: [{ translateY: floatUp }, { rotate: "4deg" }] }]}>
                <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
                <View>
                    <Text style={styles.cardTitle}>Barcode found</Text>
                    <Text style={styles.cardSubtitle}>EAN-13</Text>
                </View>
            </Animated.View>

            <Animated.View
                style={[styles.card, styles.lookupCard, { transform: [{ translateY: floatDown }, { rotate: "-4deg" }] }]}
            >
                <MaterialCommunityIcons name="barcode-scan" size={18} color={colors.primary[700]} />
                <Text style={styles.cardTitle}>Looking up product</Text>
            </Animated.View>
        </View>
    );
}

const BRACKET = { width: 27, height: 26, borderColor: colors.accent, position: "absolute" } as const;
const BRACKET_STROKE = 3;
const BRACKET_RADIUS = 8;

const styles = StyleSheet.create({
    /* phone */
    phone: {
        position: "absolute",
        left: 85,
        top: 14,
        width: 220,
        height: 344,
        borderRadius: 36,
        backgroundColor: colors.secondary[700],
        alignItems: "center",
    },
    scanningPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        height: 28,
        marginTop: 17,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    scanningDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.accent,
    },
    scanningText: {
        fontFamily: fontFamily.medium,
        fontSize: 12,
        color: "#FFFFFF",
    },
    shutter: {
        position: "absolute",
        left: 85,
        top: 277,
        width: 51,
        height: 51,
        borderRadius: 26,
        borderWidth: 4,
        borderColor: "rgba(255,255,255,0.9)",
    },

    /* phone screen */
    screen: {
        position: "absolute",
        left: 40,
        top: 58,
        width: 140,
        height: 206,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: SCREEN_BG,
    },
    screenTop: {
        height: 58,
        backgroundColor: SCREEN_TOP_BG,
    },
    bar: {
        position: "absolute",
        left: 14,
        borderRadius: 4,
    },
    topBarWide: {
        top: 16,
        width: 80,
        height: 7,
        backgroundColor: PLACEHOLDER_LIGHT,
    },
    topBarShort: {
        top: 30,
        width: 52,
        height: 5,
        backgroundColor: PLACEHOLDER_DARK,
    },
    tanBar: {
        height: 4,
        backgroundColor: PLACEHOLDER_TAN,
    },
    barcodeCard: {
        position: "absolute",
        left: 14,
        top: 112,
        width: 112,
        height: 74,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingTop: 8,
    },
    bars: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 82,
        height: 46,
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

    /* scanner overlay */
    frame: {
        position: "absolute",
        left: 4,
        top: 102,
        width: 132,
        height: 103,
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
        left: 10,
        top: 145,
        width: 120,
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

    /* floating cards */
    card: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    foundCard: {
        left: 214,
        top: 54,
        width: 160,
        height: 54,
        gap: 11,
        paddingHorizontal: 10,
        borderRadius: 16,
    },
    lookupCard: {
        left: 22,
        top: 291,
        width: 186,
        height: 46,
        gap: 12,
        paddingHorizontal: 17,
        borderRadius: 16,
    },
    checkCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.secondary[700],
    },
    cardSubtitle: {
        fontFamily: fontFamily.regular,
        fontSize: 11,
        color: colors.secondary[500],
        marginTop: 1,
    },
});
