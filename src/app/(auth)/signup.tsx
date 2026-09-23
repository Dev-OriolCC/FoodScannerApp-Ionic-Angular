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

// Hero background matches welcome.tsx/login.tsx; not part of the shared token set
// since only these auth screens sit on this lighter surface.
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

function validateConfirmPassword(password: string, confirmPassword: string): string {
    if (!confirmPassword) return "Please confirm your password.";
    if (confirmPassword !== password) return "Passwords do not match.";
    return "";
}

export default function SignUpScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const goBack = () => router.back();

    const handleSignUp = () => {
        const nextEmailError = validateEmail(email);
        const nextPasswordError = validatePassword(password);
        const nextConfirmPasswordError = validateConfirmPassword(password, confirmPassword);
        setEmailError(nextEmailError);
        setPasswordError(nextPasswordError);
        setConfirmPasswordError(nextConfirmPasswordError);

        if (nextEmailError || nextPasswordError || nextConfirmPasswordError) return;

        // Authentication is not wired up yet (Clerk migration pending); this
        // screen only validates input and moves forward with the UI flow.
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

                <View style={styles.hero}>
                    <View style={styles.logoPlaceholder} />
                    <Text style={styles.brand}>Sellómetro</Text>
                    <Text style={styles.title}>Sign up</Text>
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

                    <Text style={[styles.label, styles.fieldLabel]}>Password</Text>
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

                    <Text style={[styles.label, styles.fieldLabel]}>Confirm Password</Text>
                    <View
                        style={[
                            styles.inputBox,
                            confirmPasswordError ? styles.inputBoxError : null,
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Re-enter your password"
                            placeholderTextColor={colors.secondary[500]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onBlur={() =>
                                setConfirmPasswordError(
                                    validateConfirmPassword(password, confirmPassword)
                                )
                            }
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword((prev) => !prev)}
                            hitSlop={8}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={colors.secondary[500]}
                            />
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? (
                        <Text style={styles.errorText}>{confirmPasswordError}</Text>
                    ) : null}

                    <TouchableOpacity
                        style={styles.signUpButton}
                        activeOpacity={0.85}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.signUpButtonText}>Sign up</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                        <View style={styles.socialIconCircle}>
                            <Ionicons name="logo-google" size={16} color={colors.primary[700]} />
                        </View>
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                        <View style={styles.socialIconCircle}>
                            <Ionicons name="logo-facebook" size={16} color={colors.primary[700]} />
                        </View>
                        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                    </TouchableOpacity>

                    <View style={styles.signInRow}>
                        <Text style={styles.signInText}>Already have an account? </Text>
                        <TouchableOpacity hitSlop={8} onPress={() => router.push("/(auth)/login")}>
                            <Text style={styles.linkText}>Sign in</Text>
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
        marginBottom: spacing.sm,
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
        paddingTop: spacing.md,
        paddingBottom: spacing["2xl"],
    },
    label: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    fieldLabel: {
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
    signUpButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.xl,
    },
    signUpButtonText: {
        fontFamily: fontFamily.semiBold,
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
        flexDirection: "row",
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
    signInRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.xs,
    },
    signInText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.secondary[500],
    },
    linkText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
        textDecorationLine: "underline",
    },
});
