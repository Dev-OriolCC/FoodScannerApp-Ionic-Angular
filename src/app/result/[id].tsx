import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Polygon } from "react-native-svg";
import { colors, fontFamily, radius, spacing } from "../../theme";

// Same surface and panel colors as the auth screens (login.tsx).
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

// NOM-051 warning labels are black with a white outline.
const LABEL_BG = "#000000";
const LABEL_TEXT = "#FFFFFF";

// UI only for now: static product and warnings until the real data is wired in.
const PRODUCT_NAME = "Ocean Spray 500ml";

const EXCESS_WARNINGS = [
    { id: "calories", lines: ["EXCESO", "CALORÍAS"] },
    { id: "sodium", lines: ["EXCESO", "SODIO"] },
    { id: "saturatedFat", lines: ["EXCESO", "GRASAS", "SATURADAS"] },
    { id: "sugars", lines: ["EXCESO", "AZÚCARES"] },
];

const CONTAINS_WARNINGS = [
    { id: "caffeine", text: "CONTIENE CAFEÍNA" },
    { id: "colorants", text: "CONTIENE COLORANTES" },
];

function Octagon({ lines }: { lines: string[] }) {
    return (
        <View style={styles.octagon}>
            <Svg width="100%" height="100%" viewBox="-3 -3 106 106">
                <Polygon
                    points="30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30"
                    fill={LABEL_BG}
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    strokeLinejoin="round"
                />
            </Svg>
            <View style={styles.octagonTextBox}>
                {lines.map((line) => (
                    <Text key={line} style={styles.labelText}>
                        {line}
                    </Text>
                ))}
            </View>
        </View>
    );
}

export default function ResultScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Back to the tabs, closing this screen and the barcode form under it.
    const handleClose = () => router.dismissTo("/(tabs)/home");

    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            {/* Full-screen modal with an X on the upper left to close it. */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    presentation: "fullScreenModal",
                    animation: "slide_from_bottom",
                    title: "",
                    headerStyle: { backgroundColor: SURFACE_BG },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    contentStyle: { backgroundColor: SURFACE_BG },
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleClose} hitSlop={12}>
                            <Ionicons name="close-circle-outline" size={28} color={colors.secondary[700]} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.panel}>
                    <Text style={styles.title}>{PRODUCT_NAME}</Text>
                    <Text style={styles.barcode}>[ {id} ]</Text>

                    <View style={styles.octagonGrid}>
                        {EXCESS_WARNINGS.map((warning) => (
                            <Octagon key={warning.id} lines={warning.lines} />
                        ))}
                    </View>

                    <View style={styles.containsList}>
                        {CONTAINS_WARNINGS.map((warning) => (
                            <View key={warning.id} style={styles.containsLabel}>
                                <Text style={styles.labelText}>{warning.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.returnButton} activeOpacity={0.85} onPress={handleClose}>
                    <Text style={styles.returnButtonText}>Return</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: SURFACE_BG,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    panel: {
        backgroundColor: PANEL_BG,
        borderRadius: 32,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
        alignItems: "center",
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
        textAlign: "center",
    },
    barcode: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        lineHeight: 24,
        color: colors.secondary[700],
        marginTop: spacing.xs,
        marginBottom: spacing.xl,
    },
    octagonGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: spacing.md,
        width: "100%",
        marginBottom: spacing.xl,
    },
    octagon: {
        width: "47%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    octagonTextBox: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    labelText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 12,
        lineHeight: 18,
        color: LABEL_TEXT,
        textAlign: "center",
    },
    containsList: {
        width: "100%",
        gap: spacing.md,
    },
    containsLabel: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: LABEL_BG,
        borderColor: "#FFFFFF",
        borderWidth: 3,
        borderRadius: radius.xs,
        paddingVertical: spacing.sm,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    returnButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    returnButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
});
