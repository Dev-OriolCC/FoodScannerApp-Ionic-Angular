import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HistoryCard } from "../../components/history/HistoryCard";
import { Icon } from "../../components/Icon";
import { ScannedProduct, useScanStore } from "../../store/useScanStore";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";

// Same surface and panel colors as the auth screens (login.tsx).
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

// Image backgrounds of the cards, used in turn (same tints as the Home recent scans).
const CARD_TINTS = ["#F3EFE6", colors.primary[100], "#E3F0FB"];

type HistorySort = "az" | "za" | "dateDesc" | "dateAsc";

const SORT_LABELS: Record<HistorySort, string> = {
    az: "A-Z",
    za: "Z-A",
    dateDesc: "Date Descending",
    dateAsc: "Date Ascending",
};

const SORT_OPTIONS: HistorySort[] = ["az", "za", "dateDesc", "dateAsc"];

export default function HistoryScreen() {
    const router = useRouter();
    const products = useScanStore((state) => state.products);
    const removeScan = useScanStore((state) => state.removeScan);
    const toggleFavorite = useScanStore((state) => state.toggleFavorite);
    const userId = useScanStore((state) => state.userId);
    const isLoading = useScanStore((state) => state.isLoading);
    const loadError = useScanStore((state) => state.loadError);
    const loadHistory = useScanStore((state) => state.loadHistory);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSort, setActiveSort] = useState<HistorySort>("dateDesc");
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    // "History" tab shows every scan, "Favorites" only the starred ones.
    const [showFavorites, setShowFavorites] = useState(false);
    // Products are identified by their barcode.
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const selectedProduct = products.find((product) => product.barcode === selectedProductId);
    const visibleProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const filteredProducts = products.filter((product) => {
            const matchesQuery = !normalizedQuery
                || product.name.toLowerCase().includes(normalizedQuery)
                || product.barcode.includes(normalizedQuery);

            if (!matchesQuery) {
                return false;
            }

            return showFavorites ? product.isFavorite : true;
        });

        return [...filteredProducts].sort((first, second) => {
            switch (activeSort) {
                case "az":
                    return first.name.localeCompare(second.name);
                case "za":
                    return second.name.localeCompare(first.name);
                case "dateAsc":
                    return first.scannedAt - second.scannedAt;
                case "dateDesc":
                default:
                    return second.scannedAt - first.scannedAt;
            }
        });
    }, [activeSort, products, searchQuery, showFavorites]);

    const handleDelete = (id: string) => {
        setSelectedProductId(id);
    };

    const handleCancelDelete = () => {
        setSelectedProductId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProductId) {
            return;
        }

        setSelectedProductId(null);

        try {
            await removeScan(selectedProductId);
        } catch {
            Alert.alert("Something went wrong", "We couldn't delete this product. Please try again.");
        }
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            await toggleFavorite(id);
        } catch {
            Alert.alert("Something went wrong", "We couldn't update your favorites. Please try again.");
        }
    };

    const handleRefresh = () => {
        if (userId) {
            loadHistory(userId);
        }
    };

    const handleOpenSort = () => {
        setIsSortModalVisible(true);
    };

    const handleCloseSort = () => {
        setIsSortModalVisible(false);
    };

    const handleSelectSort = (sort: HistorySort) => {
        setActiveSort(sort);
        setIsSortModalVisible(false);
    };

    const handleViewProduct = (id: string) => {
        // "from" lets the Result screen know it should close back to History.
        router.push({ pathname: "/result/[id]", params: { id, from: "history" } });
    };

    const handleScanBarcode = () => router.push("/FormBarcodeScreen");

    const renderItem = ({ item, index }: { item: ScannedProduct; index: number }) => (
        <HistoryCard
            product={item}
            tint={CARD_TINTS[index % CARD_TINTS.length]}
            onPress={() => handleViewProduct(item.barcode)}
            onDelete={() => handleDelete(item.barcode)}
            onToggleFavorite={() => handleToggleFavorite(item.barcode)}
        />
    );

    // First load: show a spinner instead of flashing the empty state.
    if (isLoading && products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color={colors.primary[700]} />
            </View>
        );
    }

    if (loadError && products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>{loadError}</Text>
                <Text style={styles.emptySubtitle}>Check your connection and try again</Text>

                <TouchableOpacity style={styles.scanButton} activeOpacity={0.85} onPress={handleRefresh}>
                    <Text style={styles.scanButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyImage} />
                <Text style={styles.emptyTitle}>No products yet</Text>
                <Text style={styles.emptySubtitle}>Start scanning your first products today</Text>

                <TouchableOpacity style={styles.scanButton} activeOpacity={0.85} onPress={handleScanBarcode}>
                    <Text style={styles.scanButtonText}>Scan Barcode</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={22} color={colors.secondary[700]} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={colors.secondary[500]}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity hitSlop={8} onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle-outline" size={20} color={colors.secondary[500]} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity hitSlop={8} onPress={handleOpenSort}>
                    <Ionicons name="menu" size={24} color={colors.secondary[700]} />
                </TouchableOpacity>
            </View>

            <View style={styles.segmented}>
                <TouchableOpacity
                    style={[styles.segment, !showFavorites && styles.segmentActive]}
                    activeOpacity={0.85}
                    onPress={() => setShowFavorites(false)}
                >
                    <Icon name="history" size={20} color={showFavorites ? colors.secondary[500] : "#FFFFFF"} />
                    <Text style={[styles.segmentText, !showFavorites && styles.segmentTextActive]}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.segment, showFavorites && styles.segmentActive]}
                    activeOpacity={0.85}
                    onPress={() => setShowFavorites(true)}
                >
                    <Ionicons
                        name={showFavorites ? "star" : "star-outline"}
                        size={18}
                        color={showFavorites ? "#FFFFFF" : colors.secondary[500]}
                    />
                    <Text style={[styles.segmentText, showFavorites && styles.segmentTextActive]}>Favorites</Text>
                </TouchableOpacity>
            </View>

            {/* A refresh failed, but the products already loaded are still shown. */}
            {loadError.length > 0 && <Text style={styles.errorText}>{loadError}</Text>}

            <FlatList
                data={visibleProducts}
                keyExtractor={(item) => item.barcode}
                renderItem={renderItem}
                style={styles.panel}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={colors.primary[700]} />
                }
                ListEmptyComponent={
                    <Text style={styles.noResultsText}>
                        {showFavorites && !searchQuery ? "No favorite products yet" : "No products found"}
                    </Text>
                }
            />

            <Modal
                transparent
                visible={selectedProductId !== null}
                animationType="fade"
                onRequestClose={handleCancelDelete}
            >
                <Pressable style={styles.modalShade} onPress={handleCancelDelete}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Delete Product</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete {selectedProduct?.name ?? "this product"}?
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                activeOpacity={0.85}
                                onPress={handleCancelDelete}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton}
                                activeOpacity={0.85}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.modalButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                transparent
                visible={isSortModalVisible}
                animationType="fade"
                onRequestClose={handleCloseSort}
            >
                <Pressable style={styles.modalShade} onPress={handleCloseSort}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Sort Products</Text>

                        <View style={styles.filterOptions}>
                            {SORT_OPTIONS.map((sort) => {
                                const isActive = activeSort === sort;

                                return (
                                    <TouchableOpacity
                                        key={sort}
                                        style={[styles.filterOption, isActive && styles.filterOptionActive]}
                                        activeOpacity={0.85}
                                        onPress={() => handleSelectSort(sort)}
                                    >
                                        <Text style={[styles.filterOptionText, isActive && styles.filterOptionTextActive]}>
                                            {SORT_LABELS[sort]}
                                        </Text>
                                        {isActive && (
                                            <Ionicons name="checkmark-circle" size={22} color={colors.primary[700]} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },

    /* search bar */
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        height: 48,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.secondary[100],
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    searchInput: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.secondary[700],
        paddingVertical: 0,
    },

    /* history / favorites toggle */
    segmented: {
        flexDirection: "row",
        height: 44,
        padding: spacing.xs,
        borderRadius: 22,
        backgroundColor: colors.secondary[100],
        marginBottom: spacing.lg,
    },
    segment: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        borderRadius: 18,
    },
    segmentActive: {
        backgroundColor: colors.primary[700],
    },
    segmentText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: colors.secondary[500],
    },
    segmentTextActive: {
        color: "#FFFFFF",
    },

    /* list */
    panel: {
        flex: 1,
        backgroundColor: PANEL_BG,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    listContent: {
        gap: spacing.md,
        padding: spacing.md,
    },
    errorText: {
        ...textStyles.small,
        color: colors.semantic.error,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    noResultsText: {
        ...textStyles.small,
        color: colors.secondary[500],
        textAlign: "center",
        paddingVertical: spacing.xl,
    },

    /* empty state */
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing["3xl"],
    },
    emptyImage: {
        width: 160,
        height: 160,
        borderRadius: radius.lg,
        backgroundColor: colors.secondary[100],
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        ...textStyles.h2,
        color: colors.secondary[700],
        textAlign: "center",
    },
    emptySubtitle: {
        ...textStyles.small,
        color: colors.secondary[500],
        textAlign: "center",
        marginTop: spacing.xs,
        marginBottom: spacing.xl,
    },
    scanButton: {
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
    },
    scanButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },

    /* modals */
    modalShade: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(27, 42, 28, 0.4)",
        paddingHorizontal: spacing.xl,
    },
    modalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: SURFACE_BG,
        borderRadius: 32,
        padding: spacing.xl,
        ...shadows.level3,
    },
    modalTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    modalMessage: {
        ...textStyles.body,
        color: colors.secondary[700],
        textAlign: "center",
        marginBottom: spacing.xl,
    },
    modalActions: {
        flexDirection: "row",
        gap: spacing.md,
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.semantic.error,//colors.primary[700],
        borderRadius: 24,
        height: 48,
    },
    modalButtonSecondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary[700],
    },
    modalButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
    modalButtonSecondaryText: {
        color: colors.primary[700],
    },
    filterOptions: {
        gap: spacing.sm,
    },
    filterOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.secondary[100],
        backgroundColor: "#FFFFFF",
        paddingHorizontal: spacing.lg,
    },
    filterOptionActive: {
        backgroundColor: colors.primary[100],
        borderColor: colors.primary[700],
    },
    filterOptionText: {
        ...textStyles.body,
        color: colors.secondary[700],
    },
    filterOptionTextActive: {
        fontFamily: fontFamily.semiBold,
        color: colors.primary[700],
    },
});
