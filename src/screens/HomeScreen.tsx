import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/types";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

type Props = BottomTabScreenProps<TabParamList, keyof TabParamList>;

export function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
                <Ionicons
                    name="person-circle-outline"
                    size={30}
                    color={Colors.black}
                />
                <View style={styles.topBarRight}>
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={Colors.black}
                    />
                    <Ionicons
                        name="settings-outline"
                        size={24}
                        color={Colors.black}
                        style={{ marginLeft: 16 }}
                    />
                </View>
            </View>

            <View style={styles.content}>

                <View style={styles.scanTextWrapper}>
                    <Text style={styles.scanText}>Start Scanning</Text>
                </View>

                <TouchableOpacity style={styles.scanButton} activeOpacity={0.8}>
                    <Text style={styles.scanButtonText}>Scan Barcode</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    /* ── Top bar ── */
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    topBarRight: {
        flexDirection: "row",
        alignItems: "center",
    },

    /* ── Content ── */
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        marginTop: -60,
    },

    scanTextWrapper: {
        position: "relative",
        marginBottom: 40,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    
    scanText: {
        fontSize: 72,
        fontWeight: "800",
        color: Colors.black,
        textAlign: "center",
    },

    scanButton: {
        backgroundColor: Colors.greenDark,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
    },
    scanButtonText: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: "700",
    },
});