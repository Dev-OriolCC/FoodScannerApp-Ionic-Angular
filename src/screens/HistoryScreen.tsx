import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product, RootStackParamList, TabParamList } from "../navigation/types";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    Text,
    StyleSheet,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { TopBar } from "../components/TopBar";

type Props = BottomTabScreenProps<TabParamList, keyof TabParamList>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
type HistoryFilter = "az" | "za" | "dateDesc" | "dateAsc" | "favorites";

interface HistoryProduct {
    id: string;
    title: string;
    date: string;
    barcode: string;
    isFavorite: boolean;
    timestamp: number;
}

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

export function HistoryScreen({ navigation }: Props) {
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
    }

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
    }

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

    const handleViewProduct = async (id: string) => {
        const product = products.find((currentProduct) => currentProduct.id === id);

        if (!product) {
            return;
        }

        const routeProduct: Product = {
            barcode: product.barcode,
        };

        navigation.getParent<RootNavigation>()?.navigate("ResultScreen", { product: routeProduct });
    }

    const renderItem = ({ item }: { item: HistoryProduct }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon} />

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>

                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)} >
                        <Ionicons name="trash-outline" size={18} color={Colors.greenDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleFavorite(item.id)}>
                        <Ionicons name={item.isFavorite ? "star" : "star-outline"} size={18} color={Colors.greenDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewProduct(item.id)}>
                        <Ionicons name="open-outline" size={18} color={Colors.greenDark} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <TopBar />

            <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={22} color={Colors.blackLight} />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={Colors.blackLight}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle-outline" size={20} color={Colors.blackLight} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilters}>
                        <Ionicons
                            name={activeFilter === "favorites" ? "filter" : "filter-outline"}
                            size={22}
                            color={Colors.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>


            <FlatList
                data={visibleProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={(
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={28} color={Colors.blackLight} />
                        <Text style={styles.emptyStateText}>No products found</Text>
                    </View>
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
                                style={styles.modalButton}
                                activeOpacity={0.8}
                                onPress={handleCancelDelete}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton}
                                activeOpacity={0.8}
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
                    <Pressable style={styles.filterModalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Filter History</Text>

                        <View style={styles.filterOptions}>
                            {FILTER_OPTIONS.map((filter) => {
                                const isActive = activeFilter === filter;

                                return (
                                    <TouchableOpacity
                                        key={filter}
                                        style={[styles.filterOption, isActive && styles.filterOptionActive]}
                                        activeOpacity={0.8}
                                        onPress={() => handleSelectFilter(filter)}
                                    >
                                        <Text style={[styles.filterOptionText, isActive && styles.filterOptionTextActive]}>
                                            {FILTER_LABELS[filter]}
                                        </Text>
                                        {isActive && (
                                            <Ionicons name="checkmark-circle" size={22} color={Colors.greenDark} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    /* search bar */
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 7,
        paddingVertical: 8,
        gap: 10,
        marginBottom: 5,

    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Colors.cardBorder,
        paddingHorizontal: 12,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: Colors.black,
    },
    filterBtn: {
        padding: 6,
    },
    clearSearchBtn: {
        padding: 4,
    },

    list: {
        flex: 1,
        backgroundColor: Colors.historyBg,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginLeft: 7,
        marginRight: 7
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 12,
    },

    card: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: 14,
        padding: 14,
        alignItems: "flex-start",
    },
    cardIcon: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: Colors.black,
        marginRight: 12,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.black,
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 15,
        color: Colors.blackLight,
        marginBottom: 8,
    },
    cardActions: {
        flexDirection: "row",
        gap: 18,
    },
    actionBtn: {
        padding: 2,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 48,
        gap: 8,
    },
    emptyStateText: {
        color: Colors.blackLight,
        fontSize: 16,
        fontWeight: "700",
    },
    modalShade: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        paddingHorizontal: 24,
    },
    modalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingBottom: 18,
        paddingTop: 16,
    },
    modalTitle: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 36,
    },
    modalMessage: {
        color: Colors.black,
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 28,
    },
    modalActions: {
        flexDirection: "row",
        gap: 14,
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242424",
        borderRadius: 24,
        height: 42,
    },
    modalButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "800",
    },
    filterModalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingBottom: 18,
        paddingTop: 16,
    },
    filterOptions: {
        gap: 10,
    },
    filterOption: {
        minHeight: 48,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: Colors.cardBorder,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    filterOptionActive: {
        backgroundColor: Colors.historyBg,
        borderColor: Colors.greenDark,
    },
    filterOptionText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: "700",
    },
    filterOptionTextActive: {
        color: Colors.greenDark,
        fontWeight: "900",
    },
});
