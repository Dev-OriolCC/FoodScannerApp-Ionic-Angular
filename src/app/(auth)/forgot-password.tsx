import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily, spacing } from "../../theme";

// Matches the light surface used by welcome/login/signup/verify.
const HERO_BG = "#FEF7FF";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");

    const isEmailValid = EMAIL_REGEX.test(email.trim());

    const goBack = () => router.back();

    const handleSubmit = () => {
        if (!isEmailValid) return;

        // Authentication is not wired up yet (Clerk migration pending); this
        // screen only validates the email and moves forward with the UI flow.
        router.push({ pathname: "/(auth)/verify", params: { email } });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableOpacity style={styles.backButton} onPress={goBack} hitSlop={12}>
                    <Ionicons name="chevron-back" size={26} color={colors.secondary[700]} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        Enter the email address registered with your account. We&apos;ll send you
                        a link to reset your password.
                    </Text>

                    <Text style={styles.label}>Enter Email</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="example@gmail.com"
                            placeholderTextColor={colors.secondary[300]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, !isEmailValid && styles.submitButtonDisabled]}
                        activeOpacity={0.85}
                        disabled={!isEmailValid}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resendRow} hitSlop={8} onPress={handleSubmit}>
                        <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: HERO_BG,
    },
    flex: {
        flex: 1,
    },
    backButton: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    content: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.secondary[500],
        marginBottom: spacing.xl,
    },
    label: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    inputBox: {
        borderBottomWidth: 2,
        borderBottomColor: colors.secondary[300],
        paddingHorizontal: spacing.xs,
        height: 52,
        justifyContent: "center",
        marginBottom: spacing["2xl"],
    },
    input: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.secondary[700],
    },
    submitButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonDisabled: {
        backgroundColor: colors.primary[300],
    },
    submitButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
    resendRow: {
        alignItems: "center",
        marginTop: spacing.lg,
    },
    resendText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
        textDecorationLine: "underline",
    },
});
