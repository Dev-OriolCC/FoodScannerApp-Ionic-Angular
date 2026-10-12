import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getWarnings } from "../../lib/nom051";
import { ScannedProduct } from "../../store/useScanStore";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";
import { ContainsSeal, OctagonSeal } from "../WarningSeal";

// Same panel color as the History list behind the cards.
const PANEL_BG = "#D9E7CB";

// Placeholder pack color from the home mock; not part of the token set.
const PACK_TOP = "#556458";

// e.g. "Sep 25, 2026, 10:33 AM"
function formatScanDate(timestamp: number) {
    return new Date(timestamp).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

interface HistoryCardProps {
    product: ScannedProduct;
    // Background color of the image area.
    tint: string;
    onPress: () => void;
    onDelete: () => void;
    onToggleFavorite: () => void;
}

// Product row on the History screen.
export function HistoryCard({ product, tint, onPress, onDelete, onToggleFavorite }: HistoryCardProps) {
    const warnings = getWarnings(product);
    const hasSeals = warnings.excess.length > 0 || warnings.contains.length > 0;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
            {/* Visual hint that the card opens the product's Result screen. */}
            <Ionicons name="open-outline" size={20} color={colors.secondary[500]} style={styles.openIcon} />

            <View style={[styles.imageBox, { backgroundColor: tint }]}>
                {product.imageUrl ? (
                    <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="contain" />
                ) : (
                    <View style={styles.pack}>
                        <View style={styles.packTop} />
                    </View>
                )}
            </View>

            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.date}>{formatScanDate(product.scannedAt)}</Text>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.actionButton} hitSlop={4} onPress={onDelete}>
                        <Ionicons name="trash-outline" size={20} color={colors.secondary[700]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, product.isFavorite && styles.actionButtonActive]}
                        hitSlop={4}
                        onPress={onToggleFavorite}
                    >
                        <Ionicons
                            name={product.isFavorite ? "star" : "star-outline"}
                            size={20}
                            color={colors.secondary[700]}
                        />
                    </TouchableOpacity>

                    {/* How many octagons and "contains" labels the product carries. */}
                    <View style={styles.seals}>
                        {warnings.excess.length > 0 && <OctagonSeal size={32} count={warnings.excess.length} />}
                        {warnings.contains.length > 0 && (
                            <ContainsSeal width={32} height={24} count={warnings.contains.length} />
                        )}
                        {!hasSeals && (
                            <View style={styles.noSealsChip}>
                                <Ionicons name="checkmark" size={14} color={colors.primary[700]} />
                                <Text style={styles.noSealsText}>No seals</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        gap: spacing.md,
        backgroundColor: "#FFFFFF",
        borderRadius: radius.xl,
        padding: spacing.md,
        ...shadows.level1,
    },
    openIcon: {
        position: "absolute",
        top: spacing.lg,
        right: spacing.lg,
    },

    /* image */
    imageBox: {
        width: 72,
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
        width: 32,
        height: 44,
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    packTop: {
        height: 14,
        backgroundColor: PACK_TOP,
    },

    /* text */
    body: {
        flex: 1,
    },
    name: {
        fontFamily: fontFamily.semiBold,
        fontSize: 18,
        lineHeight: 24,
        color: colors.secondary[700],
        // Keeps long product names from running under the open icon.
        paddingRight: spacing.xl,
    },
    date: {
        ...textStyles.small,
        color: colors.secondary[500],
    },

    /* actions + seals */
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PANEL_BG,
    },
    actionButtonActive: {
        backgroundColor: colors.primary[300],
    },
    seals: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginLeft: "auto",
    },
    noSealsChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        height: 32,
        paddingHorizontal: spacing.md,
        borderRadius: 16,
        backgroundColor: colors.primary[100],
    },
    noSealsText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 13,
        color: colors.primary[700],
    },
});
