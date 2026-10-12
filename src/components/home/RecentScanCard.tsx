import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getWarnings } from "../../lib/nom051";
import { ScannedProduct } from "../../store/useScanStore";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";
import { ContainsSeal, OctagonSeal } from "../WarningSeal";

// Placeholder pack color from the home mock; not part of the token set.
const PACK_TOP = "#556458";

// Only this many seals fit on the card; the rest show as "+N".
const MAX_VISIBLE_SEALS = 4;

// e.g. "Today, 10:42 AM", "Yesterday, 6:15 PM" or "Sep 25, 10:33 AM".
function formatRecentDate(timestamp: number) {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Today, ${time}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${time}`;
    }

    return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

interface RecentScanCardProps {
    product: ScannedProduct;
    // Background color of the image area.
    tint: string;
    onPress: () => void;
}

// Small product card for the "Recent scans" row on Home.
export function RecentScanCard({ product, tint, onPress }: RecentScanCardProps) {
    const warnings = getWarnings(product);
    // Octagons first, then the rectangular "contains" labels, as on the packaging.
    const seals = [
        ...warnings.excess.map((id) => ({ id, isOctagon: true })),
        ...warnings.contains.map((id) => ({ id, isOctagon: false })),
    ];
    const hiddenSeals = seals.length - MAX_VISIBLE_SEALS;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
            <View style={[styles.imageBox, { backgroundColor: tint }]}>
                {product.imageUrl ? (
                    <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="contain" />
                ) : (
                    <View style={styles.pack}>
                        <View style={styles.packTop} />
                    </View>
                )}

                {product.isFavorite && (
                    <View style={styles.favoriteBadge}>
                        <Ionicons name="star" size={16} color={colors.secondary[700]} />
                    </View>
                )}
            </View>

            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.date}>{formatRecentDate(product.scannedAt)}</Text>

            <View style={styles.sealsRow}>
                {seals.length > 0 ? (
                    <>
                        {seals.slice(0, MAX_VISIBLE_SEALS).map((seal) =>
                            seal.isOctagon ? (
                                <OctagonSeal key={seal.id} size={22} />
                            ) : (
                                <ContainsSeal key={seal.id} width={24} height={18} />
                            )
                        )}
                        {hiddenSeals > 0 && <Text style={styles.moreSeals}>+{hiddenSeals}</Text>}
                    </>
                ) : product.healthStatus === "healthy" ? (
                    <View style={[styles.chip, styles.noSealsChip]}>
                        <Ionicons name="checkmark" size={14} color={colors.primary[700]} />
                        <Text style={[styles.chipText, styles.noSealsText]}>No seals</Text>
                    </View>
                ) : (
                    // No warnings, but also no nutrition data to check.
                    <View style={[styles.chip, styles.noDataChip]}>
                        <Text style={[styles.chipText, styles.noDataText]}>No data</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 148,
        padding: 10,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        ...shadows.level1,
    },

    /* image */
    imageBox: {
        height: 72,
        borderRadius: radius.lg,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    pack: {
        width: 30,
        height: 42,
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    packTop: {
        height: 14,
        backgroundColor: PACK_TOP,
    },
    favoriteBadge: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    /* text */
    name: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        lineHeight: 22,
        color: colors.secondary[700],
        marginTop: 10,
    },
    date: {
        ...textStyles.small,
        color: colors.secondary[500],
    },

    /* seals */
    sealsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        height: 26,
        marginTop: 10,
    },
    moreSeals: {
        fontFamily: fontFamily.semiBold,
        fontSize: 12,
        color: colors.secondary[700],
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 13,
    },
    chipText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 13,
    },
    noSealsChip: {
        backgroundColor: colors.primary[100],
    },
    noSealsText: {
        color: colors.primary[700],
    },
    noDataChip: {
        backgroundColor: colors.secondary[100],
    },
    noDataText: {
        color: colors.secondary[500],
    },
});
