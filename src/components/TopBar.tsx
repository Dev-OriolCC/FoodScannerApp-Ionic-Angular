import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export function TopBar() {
    return (
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
    )
}
const styles = StyleSheet.create({
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
})