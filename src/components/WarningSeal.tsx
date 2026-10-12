import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { fontFamily } from "../theme";

// NOM-051 labels are black with a white outline.
const LABEL_BG = "#000000";
const LABEL_LINE = "#FFFFFF";

// Same octagon as the onboarding seals: outer shape plus a white line just inside the edge.
const SEAL_OUTER = "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30";
const SEAL_INNER = "32.1,5 67.9,5 95,32.1 95,67.9 67.9,95 32.1,95 5,67.9 5,32.1";

interface OctagonSealProps {
    size: number;
    // Text inside the seal, one entry per line. Leave it out for a small seal without text.
    lines?: string[];
    // A single big number instead of text (e.g. how many seals a product has).
    count?: number;
}

// Black NOM-051 octagon (e.g. "EXCESO AZÚCARES").
export function OctagonSeal({ size, lines, count }: OctagonSealProps) {
    // The text grows with the seal so the longest word ("SATURADAS") always fits.
    const fontSize = size * 0.15;
    const countSize = size * 0.5;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Polygon points={SEAL_OUTER} fill={LABEL_BG} />
                <Polygon points={SEAL_INNER} fill="none" stroke={LABEL_LINE} strokeWidth={2} strokeLinejoin="round" />
            </Svg>
            {lines && (
                <View style={styles.textBox}>
                    {lines.map((line) => (
                        <Text key={line} style={[styles.text, { fontSize, lineHeight: fontSize * 1.05 }]}>
                            {line}
                        </Text>
                    ))}
                </View>
            )}
            {count !== undefined && (
                <View style={styles.textBox}>
                    <Text style={[styles.text, { fontSize: countSize, lineHeight: countSize * 1.1 }]}>{count}</Text>
                </View>
            )}
        </View>
    );
}

interface ContainsSealProps {
    width: number;
    height: number;
    // Text inside the label, one entry per line. Leave it out for a small label without text.
    lines?: string[];
    // A single big number instead of text (e.g. how many labels a product has).
    count?: number;
}

// Black rectangular NOM-051 label (e.g. "CONTIENE CAFEÍNA").
export function ContainsSeal({ width, height, lines, count }: ContainsSealProps) {
    // Thin frame on the small labels, a bit thicker on the bigger ones.
    const frame = Math.max(1.5, height * 0.06);
    const fontSize = Math.min(height * 0.24, width * 0.15);
    const countSize = height * 0.7;

    return (
        <View style={[styles.label, { width, height, padding: frame }]}>
            <View style={styles.labelInner}>
                {lines?.map((line) => (
                    <Text key={line} style={[styles.text, { fontSize, lineHeight: fontSize * 1.05 }]}>
                        {line}
                    </Text>
                ))}
                {count !== undefined && (
                    <Text style={[styles.text, { fontSize: countSize, lineHeight: countSize * 1.1 }]}>{count}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textBox: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontFamily: fontFamily.badgeExtraBold,
        color: LABEL_LINE,
        textAlign: "center",
    },
    label: {
        backgroundColor: LABEL_BG,
        borderRadius: 2,
    },
    labelInner: {
        flex: 1,
        borderWidth: 1,
        borderColor: LABEL_LINE,
        alignItems: "center",
        justifyContent: "center",
    },
});
