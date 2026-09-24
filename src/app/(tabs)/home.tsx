import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fontFamily, spacing } from "../../theme";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let’s Start Scanning</Text>

            <TouchableOpacity
                style={styles.scanButton}
                activeOpacity={0.85}
                onPress={() => router.push("/FormBarcodeScreen")}
            >
                <Text style={styles.scanButtonText}>SCAN BARCODE</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing["3xl"],
    },
    title: {
        fontFamily: fontFamily.medium,
        fontSize: 48,
        lineHeight: 56,
        color: colors.secondary[700],
        marginBottom: spacing.xl,
    },
    scanButton: {
        backgroundColor: colors.primary[700],
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    scanButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        letterSpacing: 0.5,
        color: "#FFFFFF",
    },
});
