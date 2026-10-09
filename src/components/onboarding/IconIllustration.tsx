import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

const TILE_SIZE = 200;

interface IconIllustrationProps {
    icon: React.ComponentProps<typeof Ionicons>["name"];
}

// Placeholder illustration for the steps that don't have their artwork yet.
// TODO: replace with dedicated illustrations like ScanIllustration.
export function IconIllustration({ icon }: IconIllustrationProps) {
    return (
        <View style={styles.center}>
            <View style={styles.tile}>
                <Ionicons name={icon} size={96} color={colors.primary[700]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    tile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
});
