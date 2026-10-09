import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { EXCESS_LABELS } from "../../constants/nom051";
import { colors, fontFamily } from "../../theme";
import { HeroLines } from "./HeroBackground";

// This artwork is taller than the default onboarding box, so the step passes
// this height to OnboardingStep.
export const SEALS_ILLUSTRATION_HEIGHT = 410;

// Product thumbnail colors from the onboarding design; not part of the token set.
const THUMB_BG = "#F5F0E6";
const PACK_TOP = "#556458";

// NOM-051 labels are black with a white outline.
const LABEL_BG = "#000000";
const LABEL_LINE = "#FFFFFF";

const SEAL_SIZE = 98;
// Same octagon as the result screen, plus a white line just inside the edge.
const SEAL_OUTER = "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30";
const SEAL_INNER = "32.1,5 67.9,5 95,32.1 95,67.9 67.9,95 32.1,95 5,67.9 5,32.1";

// Background lines for this step, in the 390 x 410 box.
const LINES_PATH = "M-200 71 L59 71 L130 142 M-200 263 L60 263 L140 183 M600 182 L298 182 L219 261 L219 642";

export function SealsHeroLines() {
    return (
        <HeroLines
            path={LINES_PATH}
            shapes={
                <>
                    <Circle cx={345} cy={137} r={5} fill={colors.primary[500]} />
                    <Circle cx={47} cy={358} r={7} fill={colors.accentLight} />
                </>
            }
        />
    );
}

interface SealProps {
    lines: string[];
    style: StyleProp<ViewStyle>;
}

function Seal({ lines, style }: SealProps) {
    return (
        <View style={[styles.seal, style]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Polygon points={SEAL_OUTER} fill={LABEL_BG} />
                <Polygon points={SEAL_INNER} fill="none" stroke={LABEL_LINE} strokeWidth={1.6} strokeLinejoin="round" />
            </Svg>
            <View style={styles.sealTextBox}>
                {lines.map((line) => (
                    <Text key={line} style={styles.sealText}>
                        {line}
                    </Text>
                ))}
            </View>
        </View>
    );
}

interface ContainsLabelProps {
    title: string;
    subtitle: string;
    style: StyleProp<ViewStyle>;
}

// Rectangular "CONTIENE ..." label with its official legend underneath.
function ContainsLabel({ title, subtitle, style }: ContainsLabelProps) {
    return (
        <View style={[styles.label, style]}>
            <View style={styles.labelInner}>
                <Text style={styles.labelTitle}>{title}</Text>
                <Text style={styles.labelSubtitle}>{subtitle}</Text>
            </View>
        </View>
    );
}

// Step 2 illustration: a scanned product card above the NOM-051 seals it got.
// Drawn in a 390 x 410 box.
export function SealsIllustration() {
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={styles.productCard}>
                <View style={styles.thumb}>
                    <View style={styles.pack}>
                        <View style={styles.packTop} />
                    </View>
                </View>

                <View style={styles.productText}>
                    <Text style={styles.productName}>Chocolate cereal bar</Text>
                    <Text style={styles.productMeta}>Scanned just now</Text>
                </View>

                <View style={styles.countPill}>
                    <Text style={styles.countText}>4 seals</Text>
                </View>
            </View>

            <Seal lines={EXCESS_LABELS.sugars} style={{ left: 89, top: 130, transform: [{ rotate: "-5deg" }] }} />
            <Seal lines={EXCESS_LABELS.saturatedFat} style={{ left: 202, top: 139, transform: [{ rotate: "4deg" }] }} />
            <Seal lines={EXCESS_LABELS.calories} style={{ left: 90, top: 243, transform: [{ rotate: "3deg" }] }} />
            <Seal lines={EXCESS_LABELS.sodium} style={{ left: 204, top: 253, transform: [{ rotate: "-5deg" }] }} />

            <ContainsLabel
                title="CONTIENE CAFEÍNA"
                subtitle="EVITAR EN NIÑOS"
                style={{ left: 47, top: 363, width: 124, transform: [{ rotate: "-2.5deg" }] }}
            />
            <ContainsLabel
                title="CONTIENE EDULCORANTES"
                subtitle="NO RECOMENDABLE EN NIÑOS"
                style={{ left: 184, top: 363, width: 158, transform: [{ rotate: "3deg" }] }}
            />

            <View style={styles.normChip}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primary[700]} />
                {/* Broken over two lines on purpose, as in the design. */}
                <Text style={styles.normText}>{"NOM-\n051"}</Text>
            </View>
        </View>
    );
}

const CARD_SHADOW = {
    shadowColor: colors.secondary[700],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
} as const;

const styles = StyleSheet.create({
    /* product card */
    productCard: {
        position: "absolute",
        left: 28,
        top: 18,
        width: 334,
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 14,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        ...CARD_SHADOW,
    },
    thumb: {
        width: 60,
        height: 60,
        borderRadius: 14,
        backgroundColor: THUMB_BG,
        alignItems: "center",
        justifyContent: "center",
    },
    pack: {
        width: 30,
        height: 40,
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    packTop: {
        height: 14,
        backgroundColor: PACK_TOP,
    },
    productText: {
        flex: 1,
    },
    productName: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        lineHeight: 22,
        color: colors.secondary[700],
    },
    productMeta: {
        fontFamily: fontFamily.regular,
        fontSize: 13,
        lineHeight: 18,
        color: colors.secondary[500],
    },
    countPill: {
        height: 30,
        paddingHorizontal: 12,
        borderRadius: 15,
        backgroundColor: colors.secondary[700],
        justifyContent: "center",
    },
    countText: {
        fontFamily: fontFamily.bold,
        fontSize: 13,
        color: "#FFFFFF",
    },

    /* seals */
    seal: {
        position: "absolute",
        width: SEAL_SIZE,
        height: SEAL_SIZE,
        // iOS only: Android elevation would draw a square shadow around the octagon.
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
    },
    sealTextBox: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    sealText: {
        fontFamily: fontFamily.badgeExtraBold,
        fontSize: 16,
        lineHeight: 15,
        color: LABEL_LINE,
        textAlign: "center",
    },

    /* "contains" labels */
    label: {
        position: "absolute",
        height: 42,
        padding: 3,
        backgroundColor: LABEL_BG,
    },
    labelInner: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: LABEL_LINE,
        alignItems: "center",
        justifyContent: "center",
    },
    labelTitle: {
        fontFamily: fontFamily.badgeExtraBold,
        fontSize: 13,
        lineHeight: 14,
        color: LABEL_LINE,
    },
    labelSubtitle: {
        fontFamily: fontFamily.badgeExtraBold,
        fontSize: 10,
        lineHeight: 11,
        color: LABEL_LINE,
    },

    /* NOM-051 chip */
    normChip: {
        position: "absolute",
        left: 295,
        top: 233,
        width: 92,
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        borderRadius: 23,
        backgroundColor: "#FFFFFF",
        transform: [{ rotate: "8deg" }],
        ...CARD_SHADOW,
    },
    normText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        lineHeight: 17,
        color: colors.primary[700],
    },
});
