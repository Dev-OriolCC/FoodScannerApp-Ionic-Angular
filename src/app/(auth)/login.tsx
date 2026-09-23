import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontFamily, spacing } from "../../theme";

// Hero background matches welcome.tsx; not part of the shared token set
// since only these two auth screens sit on this lighter surface.
const HERO_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string {
    if (!value.trim()) return "Email is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
    return "";
}

function validatePassword(value: string): string {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
    if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
    if (!/[0-9]/.test(value)) return "Password must include a number.";
    return "";
}

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const goBack = () => router.back();

    const handleSignIn = () => {
        const nextEmailError = validateEmail(email);
        const nextPasswordError = validatePassword(password);
        setEmailError(nextEmailError);
        setPasswordError(nextPasswordError);

        if (nextEmailError || nextPasswordError) return;

        // Authentication is not wired up yet (Clerk migration pending); this
        // screen only validates input and moves forward with the UI flow.
        router.replace("/(tabs)/home");
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

                <View style={styles.hero}>
                    <View style={styles.logoPlaceholder} />
                    <Text style={styles.brand}>Sellómetro</Text>
                    <Text style={styles.title}>Sign in</Text>
                </View>

                <View style={styles.panel}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.secondary[500]}
                            value={email}
                            onChangeText={setEmail}
                            onBlur={() => setEmailError(validateEmail(email))}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
                    <View style={[styles.inputBox, passwordError ? styles.inputBoxError : null]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={colors.secondary[500]}
                            value={password}
                            onChangeText={setPassword}
                            onBlur={() => setPasswordError(validatePassword(password))}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword((prev) => !prev)}
                            hitSlop={8}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={colors.secondary[500]}
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={styles.rememberMe}
                            onPress={() => setRememberMe((prev) => !prev)}
                            hitSlop={8}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && (
                                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                )}
                            </View>
                            <Text style={styles.rememberMeText}>Remember me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity hitSlop={8}>
                            <Text style={styles.linkText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        activeOpacity={0.85}
                        onPress={handleSignIn}
                    >
                        <Text style={styles.signInButtonText}>Sign in</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpRow}>
                        <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
                        <TouchableOpacity hitSlop={8}>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
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
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
    },
    panel: {
        backgroundColor: PANEL_BG,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing["2xl"],
        paddingBottom: spacing["2xl"],
    },
    label: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    passwordLabel: {
        marginTop: spacing.lg,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderBottomWidth: 2,
        borderBottomColor: colors.secondary[300],
        paddingHorizontal: spacing.md,
        height: 52,
    },
    inputBoxError: {
        borderBottomColor: colors.semantic.error,
    },
    input: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.secondary[700],
    },
    errorText: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        color: colors.semantic.error,
        marginTop: spacing.xs,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    rememberMe: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.secondary[500],
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.sm,
    },
    checkboxChecked: {
        backgroundColor: colors.primary[700],
        borderColor: colors.primary[700],
    },
    rememberMeText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.secondary[700],
    },
    linkText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
        textDecorationLine: "underline",
    },
    signInButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    signInButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
    signUpRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.lg,
    },
    signUpText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.secondary[500],
    },
});
