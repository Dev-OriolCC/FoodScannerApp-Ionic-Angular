import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontFamily } from "../../theme";
import { HeroLines } from "./HeroBackground";

// This artwork is taller than the default onboarding box, so the step passes
// this height to OnboardingStep.
export const HISTORY_ILLUSTRATION_HEIGHT = 410;

// Same surface and panel colors as the real History screen.
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

// Product thumbnail colors from the onboarding design; not part of the token set.
const CEREAL_BG = "#F5F0E6";
const CEREAL_TOP = "#556458";
const COLA_BG = "#E3F0FB";

// NOM-051 labels are black.
const LABEL_BG = "#000000";
const MINI_SEAL_SIZE = 13;
const MINI_SEAL = "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30";

// Background lines for this step, in the 390 x 410 box.
const LINES_PATH = "M18 -154 L140 -32 L140 46 M-200 136 L100 136 M300 257 L600 257 M231 380 L231 700";

export function HistoryHeroLines() {
    return (
        <HeroLines
            path={LINES_PATH}
            shapes={
                <>
                    <Rect x={342} y={56} width={20} height={58} rx={10} fill={colors.primary[300]} transform="rotate(6 352 85)" />
                    <Circle cx={368} cy={22} r={6} fill={colors.primary[500]} />
                    {/* Small octagon, a nod to the NOM-051 seals. */}
                    <Path d="M16.5 386 L25.5 386 L32 392.5 L32 401.5 L25.5 408 L16.5 408 L10 401.5 L10 392.5 Z" fill={colors.primary[300]} />
                </>
            }
        />
    );
}

type Seal = "octagon" | "label";

interface HistoryRowProps {
    name: string;
    date: string;
    thumb: React.ReactNode;
    isFavorite?: boolean;
    seals?: Seal[];
}

// A mini copy of a History card: thumbnail, name, date, actions and seals.
function HistoryRow({ name, date, thumb, isFavorite = false, seals = [] }: HistoryRowProps) {
    return (
        <View style={styles.card}>
            <Ionicons name="open-outline" size={13} color={colors.secondary[500]} style={styles.openIcon} />

            {thumb}

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.cardDate}>{date}</Text>

                <View style={styles.actions}>
                    <View style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={14} color={colors.secondary[700]} />
                    </View>
                    <View style={[styles.actionButton, isFavorite && styles.favoriteButton]}>
                        <Ionicons name={isFavorite ? "star" : "star-outline"} size={14} color={colors.secondary[700]} />
                    </View>
                </View>
            </View>

            <View style={styles.seals}>
                {seals.map((seal, index) =>
                    seal === "octagon" ? (
                        <Svg key={index} width={MINI_SEAL_SIZE} height={MINI_SEAL_SIZE} viewBox="0 0 100 100">
                            <Polygon points={MINI_SEAL} fill={LABEL_BG} />
                        </Svg>
                    ) : (
                        <View key={index} style={styles.miniLabel} />
                    ),
                )}
            </View>
        </View>
    );
}

// Step 3 illustration: the History screen with a few scans, and a toast for
// the product that was just marked as a favorite. Drawn in a 390 x 410 box.
export function HistoryIllustration() {
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={styles.phone}>
                <Text style={styles.screenTitle}>Products</Text>

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={16} color={colors.secondary[700]} />
                    <Text style={styles.searchText}>Search</Text>
                    <Ionicons name="menu" size={18} color={colors.secondary[700]} />
                </View>

                <View style={styles.tabs}>
                    <View style={[styles.tab, styles.activeTab]}>
                        <MaterialCommunityIcons name="history" size={14} color="#FFFFFF" />
                        <Text style={[styles.tabText, styles.activeTabText]}>History</Text>
                    </View>
                    <View style={styles.tab}>
                        <Ionicons name="star-outline" size={12} color={colors.secondary[500]} />
                        <Text style={styles.tabText}>Favorites</Text>
                    </View>
                </View>

                <View style={styles.panel}>
                    <HistoryRow
                        name="Chocolate cereal bar with nuts"
                        date="Oct 9, 2026, 10:42 AM"
                        isFavorite
                        seals={["octagon", "octagon", "octagon", "octagon"]}
                        thumb={
                            <View style={[styles.thumb, { backgroundColor: CEREAL_BG }]}>
                                <View style={styles.cerealPack}>
                                    <View style={styles.cerealTop} />
                                </View>
                            </View>
                        }
                    />
                    <HistoryRow
                        name="Plain yogurt"
                        date="Oct 8, 2026, 6:15 PM"
                        thumb={
                            <View style={[styles.thumb, { backgroundColor: colors.primary[100] }]}>
                                <View style={styles.yogurtCup}>
                                    <View style={styles.yogurtLid} />
                                </View>
                            </View>
                        }
                    />
                    <HistoryRow
                        name="Cola soft drink"
                        date="Oct 8, 2026, 1:03 PM"
                        seals={["octagon", "octagon", "label"]}
                        thumb={
                            <View style={[styles.thumb, { backgroundColor: COLA_BG }]}>
                                <View style={styles.colaCan} />
                            </View>
                        }
                    />
                </View>
            </View>

            <View style={styles.toast}>
                <Ionicons name="star" size={17} color={colors.accentLight} />
                <Text style={styles.toastText}>Added to favorites</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    /* phone */
    phone: {
        position: "absolute",
        left: 30,
        top: 12,
        width: 330,
        height: 396,
        borderRadius: 40,
        overflow: "hidden",
        backgroundColor: SURFACE_BG,
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    screenTitle: {
        fontFamily: fontFamily.medium,
        fontSize: 15,
        lineHeight: 20,
        color: colors.secondary[700],
        textAlign: "center",
        marginTop: 12,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 35,
        marginTop: 9,
        marginHorizontal: 15,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.secondary[100],
        backgroundColor: "#FFFFFF",
    },
    searchText: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: 13,
        color: colors.secondary[500],
    },

    /* tabs */
    tabs: {
        flexDirection: "row",
        height: 32,
        marginTop: 9,
        marginHorizontal: 14,
        padding: 3,
        borderRadius: 16,
        backgroundColor: colors.secondary[100],
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 13,
    },
    activeTab: {
        backgroundColor: colors.primary[700],
    },
    tabText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 12,
        color: colors.secondary[500],
    },
    activeTabText: {
        fontFamily: fontFamily.bold,
        fontSize: 13,
        color: "#FFFFFF",
    },

    /* list */
    panel: {
        flex: 1,
        gap: 8,
        marginTop: 10,
        marginHorizontal: 10,
        padding: 10,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: "hidden",
        backgroundColor: PANEL_BG,
    },
    card: {
        flexDirection: "row",
        gap: 10,
        height: 88,
        padding: 10,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
    },
    openIcon: {
        position: "absolute",
        top: 11,
        right: 11,
    },
    cardBody: {
        flex: 1,
        // Keeps long product names from running under the open icon.
        paddingRight: 20,
    },
    cardTitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        lineHeight: 19,
        color: colors.secondary[700],
    },
    cardDate: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        lineHeight: 15,
        color: colors.secondary[500],
    },
    actions: {
        flexDirection: "row",
        gap: 6,
        marginTop: 6,
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: PANEL_BG,
        alignItems: "center",
        justifyContent: "center",
    },
    favoriteButton: {
        backgroundColor: colors.primary[300],
    },
    seals: {
        position: "absolute",
        right: 10,
        bottom: 10,
        height: 28,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    miniLabel: {
        width: 16,
        height: 9,
        backgroundColor: LABEL_BG,
    },

    /* thumbnails */
    thumb: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cerealPack: {
        width: 26,
        height: 36,
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    cerealTop: {
        height: 13,
        backgroundColor: CEREAL_TOP,
    },
    yogurtCup: {
        width: 32,
        height: 26,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    yogurtLid: {
        height: 6,
        backgroundColor: colors.semantic.success,
    },
    colaCan: {
        width: 18,
        height: 38,
        borderRadius: 7,
        backgroundColor: colors.semantic.info,
    },

    /* toast */
    toast: {
        position: "absolute",
        left: 177,
        top: 279,
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingLeft: 14,
        paddingRight: 18,
        borderRadius: 18,
        backgroundColor: colors.secondary[700],
        transform: [{ rotate: "-4deg" }],
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
        elevation: 10,
    },
    toastText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: "#FFFFFF",
    },
});
