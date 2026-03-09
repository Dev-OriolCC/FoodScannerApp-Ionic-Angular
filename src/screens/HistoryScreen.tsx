import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/types";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { TopBar } from "../components/TopBar";

type Props = BottomTabScreenProps<TabParamList, keyof TabParamList>;

interface Product {
    id: string;
    title: string;
    date: string;
}

const PRODUCTS: Product[] = [
    { id: "1", title: "Product Name Example 80ml", date: "Today, 2026 - 10:33 AM" },
    { id: "2", title: "Product Name Example 80ml", date: "March 6, 2026 - 10:11 PM" },
    { id: "3", title: "Product Name Example 80ml", date: "Today, 2026 - 10:33AM" },
    { id: "4", title: "Product Name Example 80ml", date: "Today, 2026 - 10:33AM" },
];

export function HistoryScreen({ navigation }: Props) {
    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon} />

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>

                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="trash-outline" size={18} color={Colors.greenDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="star-outline" size={18} color={Colors.greenDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
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
                    />
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="filter-outline" size={22} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            </View>


            <FlatList
                data={PRODUCTS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                style={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
});