import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScanHeroCard } from "../../components/home/ScanHeroCard";
import { RecentScanCard } from "../../components/home/RecentScanCard";
import { ContainsSeal, OctagonSeal } from "../../components/WarningSeal";
import { CONTAINS_LABELS, EXCESS_LABELS } from "../../constants/nom051";
import { useScanStore } from "../../store/useScanStore";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";

const MAX_RECENT_SCANS = 10;

// Image backgrounds of the recent-scan cards, used in turn (from the home mock).
const CARD_TINTS = ["#F3EFE6", colors.primary[100], "#E3F0FB"];

// Every NOM-051 seal: the four "EXCESO" octagons, then the three "CONTIENE" labels.
const SEALS = [
    { id: "sugars", name: "Sugars", lines: EXCESS_LABELS.sugars, isOctagon: true },
    { id: "saturatedFat", name: "Sat. fat", lines: EXCESS_LABELS.saturatedFat, isOctagon: true },
    { id: "calories", name: "Calories", lines: EXCESS_LABELS.calories, isOctagon: true },
    { id: "sodium", name: "Sodium", lines: EXCESS_LABELS.sodium, isOctagon: true },
    // "CONTIENE CAFEÍNA" -> ["CONTIENE", "CAFEÍNA"], so it fits on two lines.
    { id: "caffeine", name: "Caffeine", lines: CONTAINS_LABELS.caffeine.split(" "), isOctagon: false },
    { id: "sweeteners", name: "Sweeteners", lines: CONTAINS_LABELS.sweeteners.split(" "), isOctagon: false },
    { id: "colorants", name: "Colorants", lines: CONTAINS_LABELS.colorants.split(" "), isOctagon: false },
];

export default function HomeScreen() {
    const router = useRouter();
    const products = useScanStore((state) => state.products);
    const userId = useScanStore((state) => state.userId);
    const isLoading = useScanStore((state) => state.isLoading);
    const loadError = useScanStore((state) => state.loadError);
    const loadHistory = useScanStore((state) => state.loadHistory);

    // Products are already sorted newest first.
    const recentProducts = products.slice(0, MAX_RECENT_SCANS);

    const handleRefresh = () => {
        if (userId) {
            loadHistory(userId);
        }
    };

    const handleScanBarcode = () => router.push("/FormBarcodeScreen");

    const handleSeeAll = () => router.navigate("/(tabs)/history");

    // Without "from", the Result screen closes back to Home.
    const handleViewProduct = (id: string) => router.push({ pathname: "/result/[id]", params: { id } });

    const renderRecentScans = () => {
        // First load: a spinner instead of flashing the empty card.
        if (isLoading && products.length === 0) {
            return <ActivityIndicator style={styles.loader} color={colors.primary[700]} />;
        }

        if (products.length === 0) {
            return (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyTitle}>{loadError ? "Could not load your scans" : "No scans yet"}</Text>
                    <Text style={styles.emptySubtitle}>
                        {loadError ? "Pull down to try again." : "Your recent products will show up here."}
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                horizontal
                data={recentProducts}
                keyExtractor={(item) => item.barcode}
                renderItem={({ item, index }) => (
                    <RecentScanCard
                        product={item}
                        tint={CARD_TINTS[index % CARD_TINTS.length]}
                        onPress={() => handleViewProduct(item.barcode)}
                    />
                )}
                contentContainerStyle={styles.rowContent}
                showsHorizontalScrollIndicator={false}
            />
        );
    };

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading && products.length > 0}
                    onRefresh={handleRefresh}
                    tintColor={colors.primary[700]}
                />
            }
        >
            <View style={styles.hero}>
                <ScanHeroCard onScanPress={handleScanBarcode} />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent scans</Text>
                <TouchableOpacity hitSlop={8} onPress={handleSeeAll}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            {renderRecentScans()}

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Know the seals</Text>
            </View>

            <ScrollView horizontal contentContainerStyle={styles.rowContent} showsHorizontalScrollIndicator={false}>
                {SEALS.map((seal) => (
                    <View key={seal.id} style={styles.sealCard}>
                        <View style={styles.sealShape}>
                            {seal.isOctagon ? (
                                <OctagonSeal size={50} lines={seal.lines} />
                            ) : (
                                <ContainsSeal width={58} height={36} lines={seal.lines} />
                            )}
                        </View>
                        <Text style={styles.sealName} numberOfLines={1} adjustsFontSizeToFit>
                            {seal.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingTop: spacing.sm,
        paddingBottom: spacing["2xl"],
    },
    hero: {
        paddingHorizontal: spacing.lg,
    },

    /* sections */
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        marginTop: spacing["2xl"],
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: 22,
        lineHeight: 28,
        color: colors.secondary[700],
    },
    seeAll: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: colors.primary[700],
    },
    // Horizontal rows run to the screen edges; the padding lines up the first card.
    rowContent: {
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        // Room for the card shadows.
        paddingVertical: spacing.xs,
    },

    /* recent scans */
    loader: {
        paddingVertical: spacing.xl,
    },
    emptyCard: {
        marginHorizontal: spacing.lg,
        padding: spacing.xl,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        ...shadows.level1,
    },
    emptyTitle: {
        ...textStyles.h4,
        fontFamily: fontFamily.semiBold,
        color: colors.secondary[700],
    },
    emptySubtitle: {
        ...textStyles.small,
        color: colors.secondary[500],
        textAlign: "center",
        marginTop: spacing.xs,
    },

    /* know the seals */
    sealCard: {
        width: 88,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        ...shadows.level1,
    },
    // Same height for both shapes, so the names line up.
    sealShape: {
        height: 50,
        justifyContent: "center",
    },
    sealName: {
        fontFamily: fontFamily.medium,
        fontSize: 14,
        color: colors.secondary[700],
    },
});
