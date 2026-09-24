import React, { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    NativeSyntheticEvent,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn, useSignUp } from "@clerk/expo";
import { alertIfSessionTask } from "../../lib/authNavigation";
import { parseClerkError } from "../../lib/clerkErrors";
import { colors, fontFamily, spacing } from "../../theme";

// Matches the light surface used by welcome/login/signup.
const HERO_BG = "#FEF7FF";
const CODE_LENGTH = 6;

export default function VerifyScreen() {
    const router = useRouter();
    const { email, flow } = useLocalSearchParams<{ email?: string; flow?: "signup" | "signin" }>();
    const { signUp, fetchStatus: signUpStatus } = useSignUp();
    const { signIn, fetchStatus: signInStatus } = useSignIn();

    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const isComplete = digits.every((digit) => digit !== "");
    const isSubmitting = signUpStatus === "fetching" || signInStatus === "fetching";
    const isSignInFlow = flow === "signin";

    const goBack = () => router.back();

    const handleChangeDigit = (text: string, index: number) => {
        const value = text.replace(/[^0-9]/g, "").slice(-1);

        setDigits((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

        if (value && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        event: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            setDigits((prev) => {
                const next = [...prev];
                next[index - 1] = "";
                return next;
            });
        }
    };

    const showError = (error: unknown) => {
        Alert.alert("Verification failed", parseClerkError(error).message);
    };

    const handleVerify = async () => {
        if (!isComplete) return;
        const code = digits.join("");

        if (isSignInFlow) {
            const { error } = await signIn.mfa.verifyEmailCode({ code });
            if (error) return showError(error);

            if (signIn.status === "complete") {
                const { error: finalizeError } = await signIn.finalize({ navigate: alertIfSessionTask });
                if (finalizeError) showError(finalizeError);
            }
            return;
        }

        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) return showError(error);

        if (signUp.status === "complete") {
            const { error: finalizeError } = await signUp.finalize({ navigate: alertIfSessionTask });
            if (finalizeError) showError(finalizeError);
        }
    };

    const handleResendCode = async () => {
        const { error } = isSignInFlow
            ? await signIn.mfa.sendEmailCode()
            : await signUp.verifications.sendEmailCode();
        if (error) return showError(error);

        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            <TouchableOpacity style={styles.backButton} onPress={goBack} hitSlop={12}>
                <Ionicons name="chevron-back" size={26} color={colors.secondary[700]} />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Please verify your email</Text>
                <Text style={styles.subtitle}>
                    We&apos;ve sent an email to {email || "your email address"}, please enter the
                    code below
                </Text>

                <Text style={styles.label}>Enter Code</Text>
                <View style={styles.codeRow}>
                    {digits.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={styles.codeBox}
                            value={digit}
                            onChangeText={(text) => handleChangeDigit(text, index)}
                            onKeyPress={(event) => handleKeyPress(event, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            placeholder="-"
                            placeholderTextColor={colors.secondary[300]}
                            textAlign="center"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.verifyButton, !isComplete && styles.verifyButtonDisabled]}
                    activeOpacity={0.85}
                    disabled={!isComplete || isSubmitting}
                    onPress={handleVerify}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resendRow}
                    hitSlop={8}
                    onPress={handleResendCode}
                >
                    <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: HERO_BG,
    },
    backButton: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm
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
    codeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: spacing["2xl"],
    },
    codeBox: {
        width: 44,
        height: 52,
        borderWidth: 1,
        borderColor: colors.secondary[300],
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        fontFamily: fontFamily.semiBold,
        fontSize: 20,
        color: colors.secondary[700],
    },
    verifyButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    verifyButtonDisabled: {
        backgroundColor: colors.primary[300],
    },
    verifyButtonText: {
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
