import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSocialAuth } from "../../provider/useSocialAuth";
import { colors, fontFamily, spacing } from "../../theme";

// Hero background from the welcome-screen mock; not part of the shared token
// set since every other screen sits on a plain surface.
const HERO_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

export default function WelcomeScreen() {
    const router = useRouter();
    const { signInWithSocial, isSocialLoading } = useSocialAuth();

    const goToEmailAuth = () => router.push("/(auth)/login");
    const goToSignUp = () => router.push("/(auth)/signup"); 

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.hero}>
                <View style={styles.logoPlaceholder} />
                <Text style={styles.brand}>Sellómetro</Text>
                <Text style={styles.welcomeTitle}>Welcome to Sellómetro</Text>
            </View>

            <View style={styles.panel}>
                <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={goToEmailAuth}>
                    <Text style={styles.primaryButtonText}>Continue with Email</Text>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.socialButton}
                    activeOpacity={0.85}
                    disabled={isSocialLoading}
                    onPress={() => signInWithSocial("oauth_google")}
                >
                    <View style={styles.socialIconCircle}>
                        <Ionicons name="logo-google" size={16} color={colors.primary[700]} />
                    </View>
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    activeOpacity={0.85}
                    disabled={isSocialLoading}
                    onPress={() => signInWithSocial("oauth_facebook")}
                >
                    <View style={styles.socialIconCircle}>
                        <Ionicons name="logo-facebook" size={16} color={colors.primary[700]} />
                    </View>
                    <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <View style={styles.signUpRow}>
                    <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity onPress={goToSignUp}>
                        <Text style={styles.signUpLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: HERO_BG,
    },
    hero: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },
    logoPlaceholder: {
        width: 72,
        height: 72,
        borderWidth: 2,
        borderColor: colors.primary[700],
        borderRadius: 8,
        marginBottom: spacing.lg,
    },
    brand: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
        marginBottom: spacing["2xl"],
    },
    welcomeTitle: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
        textAlign: "center",
    },
    panel: {
        backgroundColor: PANEL_BG,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing["2xl"],
        paddingBottom: spacing["2xl"],
    },
    primaryButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        color: "#FFFFFF",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.secondary[300],
    },
    dividerText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.secondary[500],
        marginHorizontal: spacing.md,
    },
    socialButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },
    socialIconCircle: {
        position: "absolute",
        left: spacing.xs,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    socialButtonText: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        color: "#FFFFFF",
    },
    signUpRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.xs,
    },
    signUpText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.secondary[500],
    },
    signUpLink: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
        textDecorationLine: "underline",
    },
});
