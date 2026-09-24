import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";

// Same surface and panel colors as the auth screens (login.tsx).
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

type HistoryFilter = "az" | "za" | "dateDesc" | "dateAsc" | "favorites";

interface HistoryProduct {
    id: string;
    title: string;
    date: string;
    barcode: string;
    isFavorite: boolean;
    timestamp: number;
}

// UI only for now: static products until the real scan history is wired in.
const PRODUCTS: HistoryProduct[] = [
    {
        id: "1",
        title: "Apple Juice 80ml",
        date: "Today, 2026 - 10:33 AM",
        barcode: "7501031311309",
        isFavorite: false,
        timestamp: new Date("2026-05-17T10:33:00").getTime(),
    },
    {
        id: "2",
        title: "Coca-cola Example 80ml",
        date: "March 6, 2026 - 10:11 PM",
        barcode: "049000042566",
        isFavorite: true,
        timestamp: new Date("2026-03-06T22:11:00").getTime(),
    },
    {
        id: "3",
        title: "Pizza Papa's Example 80ml",
        date: "Today, 2026 - 10:33AM",
        barcode: "7622210449283",
        isFavorite: false,
        timestamp: new Date("2026-05-17T10:32:00").getTime(),
    },
    {
        id: "4",
        title: "Mushrooms Example 80ml",
        date: "Today, 2026 - 10:33AM",
        barcode: "8410076472115",
        isFavorite: true,
        timestamp: new Date("2026-05-17T10:31:00").getTime(),
    },
];

const FILTER_LABELS: Record<HistoryFilter, string> = {
    az: "A-Z",
    za: "Z-A",
    dateDesc: "Date Descending",
    dateAsc: "Date Ascending",
    favorites: "Favorites",
};

const FILTER_OPTIONS: HistoryFilter[] = ["az", "za", "dateDesc", "dateAsc", "favorites"];

export default function HistoryScreen() {
    const router = useRouter();
    const [products, setProducts] = useState(PRODUCTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<HistoryFilter>("dateDesc");
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    const visibleProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const filteredProducts = products.filter((product) => {
            const matchesQuery = !normalizedQuery
                || product.title.toLowerCase().includes(normalizedQuery)
                || product.barcode.includes(normalizedQuery);

            if (!matchesQuery) {
                return false;
            }

            return activeFilter === "favorites" ? product.isFavorite : true;
        });

        return [...filteredProducts].sort((first, second) => {
            switch (activeFilter) {
                case "az":
                    return first.title.localeCompare(second.title);
                case "za":
                    return second.title.localeCompare(first.title);
                case "dateAsc":
                    return first.timestamp - second.timestamp;
                case "favorites":
                case "dateDesc":
                default:
                    return second.timestamp - first.timestamp;
            }
        });
    }, [activeFilter, products, searchQuery]);

    const handleDelete = (id: string) => {
        setSelectedProductId(id);
    };

    const handleCancelDelete = () => {
        setSelectedProductId(null);
    };

    const handleConfirmDelete = () => {
        if (!selectedProductId) {
            return;
        }

        setProducts((currentProducts) => (
            currentProducts.filter((product) => product.id !== selectedProductId)
        ));
        setSelectedProductId(null);
    };

    const handleToggleFavorite = (id: string) => {
        setProducts((currentProducts) => (
            currentProducts.map((product) => (
                product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
            ))
        ));
    };

    const handleOpenFilters = () => {
        setIsFilterModalVisible(true);
    };

    const handleCloseFilters = () => {
        setIsFilterModalVisible(false);
    };

    const handleSelectFilter = (filter: HistoryFilter) => {
        setActiveFilter(filter);
        setIsFilterModalVisible(false);
    };

    const handleViewProduct = (id: string) => {
        const product = products.find((currentProduct) => currentProduct.id === id);

        if (!product) {
            return;
        }

        router.push({
            pathname: "/result/[id]",
            params: { id: product.barcode, product: JSON.stringify({ barcode: product.barcode }) },
        });
    };

    const handleScanBarcode = () => router.push("/FormBarcodeScreen");

    // Temporary: empties the static list to preview the empty state.
    const handleClearProducts = () => setProducts([]);

    const renderItem = ({ item }: { item: HistoryProduct }) => (
        <View style={styles.card}>
            <View style={styles.cardImage} />

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>

                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionButton} hitSlop={6} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={16} color={colors.secondary[700]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} hitSlop={6} onPress={() => handleToggleFavorite(item.id)}>
                        <Ionicons
                            name={item.isFavorite ? "star" : "star-outline"}
                            size={16}
                            color={colors.secondary[700]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} hitSlop={6} onPress={() => handleViewProduct(item.id)}>
                        <Ionicons name="open-outline" size={16} color={colors.secondary[700]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

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
                <TouchableOpacity hitSlop={8} onPress={handleOpenFilters}>
                    <Ionicons name="menu" size={24} color={colors.secondary[700]} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={visibleProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.panel}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.noResultsText}>No products found</Text>}
                ListFooterComponent={(
                    <TouchableOpacity style={styles.tempButton} activeOpacity={0.85} onPress={handleClearProducts}>
                        <Text style={styles.tempButtonText}>Clear products (temporary)</Text>
                    </TouchableOpacity>
                )}
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
                            Are you sure you want to delete {selectedProduct?.title ?? "this product"}?
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
                visible={isFilterModalVisible}
                animationType="fade"
                onRequestClose={handleCloseFilters}
            >
                <Pressable style={styles.modalShade} onPress={handleCloseFilters}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Filter Products</Text>

                        <View style={styles.filterOptions}>
                            {FILTER_OPTIONS.map((filter) => {
                                const isActive = activeFilter === filter;

                                return (
                                    <TouchableOpacity
                                        key={filter}
                                        style={[styles.filterOption, isActive && styles.filterOptionActive]}
                                        activeOpacity={0.85}
                                        onPress={() => handleSelectFilter(filter)}
                                    >
                                        <Text style={[styles.filterOptionText, isActive && styles.filterOptionTextActive]}>
                                            {FILTER_LABELS[filter]}
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
        borderRadius: radius.xl,
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

    /* list */
    panel: {
        flex: 1,
        backgroundColor: PANEL_BG,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    listContent: {
        gap: spacing.md,
        padding: spacing.lg,
    },
    noResultsText: {
        ...textStyles.small,
        color: colors.secondary[500],
        textAlign: "center",
        paddingVertical: spacing.xl,
    },

    /* product card */
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: "#FFFFFF",
        borderRadius: radius.lg,
        padding: spacing.md,
        ...shadows.level1,
    },
    cardImage: {
        width: 56,
        height: 56,
        borderRadius: radius.sm,
        backgroundColor: colors.secondary[100],
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        ...textStyles.h4,
        fontFamily: fontFamily.semiBold,
        color: colors.secondary[700],
    },
    cardDate: {
        ...textStyles.small,
        color: colors.secondary[500],
    },
    cardActions: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: PANEL_BG,
    },

    /* temporary clear button */
    tempButton: {
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.secondary[700],
        marginTop: spacing.md,
    },
    tempButtonText: {
        ...textStyles.small,
        fontFamily: fontFamily.medium,
        color: colors.secondary[700],
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
        backgroundColor: colors.primary[700],
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
