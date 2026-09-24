import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { colors, fontFamily } from "../theme";

// Same surface color as the tabs and auth screens.
const SURFACE_BG = "#FEF7FF";

// Empty for now: the edit form comes in a later step.
export default function EditProfileScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Edit Profile",
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: fontFamily.medium, fontSize: 16, color: colors.secondary[700] },
                    headerTintColor: colors.secondary[700],
                    headerStyle: { backgroundColor: SURFACE_BG },
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: SURFACE_BG },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
