import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";

type AuthMode = "login" | "register" | "forgotPassword";

export function LoginScreen() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const isRegister = mode === "register";
    const isForgotPassword = mode === "forgotPassword";

    const resetFeedback = () => {
        setMessage("");
        setErrorMessage("");
    };

    const switchMode = (nextMode: AuthMode) => {
        setMode(nextMode);
        setPassword("");
        setConfirmPassword("");
        resetFeedback();
    };

    const validateEmail = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setErrorMessage("Enter your email address.");
            return null;
        }

        if (!trimmedEmail.includes("@")) {
            setErrorMessage("Enter a valid email address.");
            return null;
        }

        return trimmedEmail;
    };

    const validatePassword = () => {
        if (!password) {
            setErrorMessage("Enter your password.");
            return false;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return false;
        }

        if (isRegister && password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        resetFeedback();
        const trimmedEmail = validateEmail();

        if (!trimmedEmail) {
            return;
        }

        if (!isForgotPassword && !validatePassword()) {
            return;
        }

        setLoading(true);

        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);

                if (error) {
                    throw error;
                }

                setMessage("Password reset email sent. Check your inbox for the next step.");
                return;
            }

            if (isRegister) {
                const { data, error } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password,
                });

                if (error) {
                    throw error;
                }

                if (!data.session) {
                    setMode("login");
                    setEmail(trimmedEmail);
                    setPassword("");
                    setConfirmPassword("");
                    setMessage("Account created. Check your email to confirm before logging in.");
                }

                return;
            }

            const { error } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            const authError = error instanceof Error ? error.message : "Something went wrong. Try again.";
            setErrorMessage(authError);
        } finally {
            setLoading(false);
        }
    };

    const primaryLabel = isForgotPassword
        ? "Send Reset Email"
        : isRegister
            ? "Create Account"
            : "Login";

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <View style={styles.topSection}>
                            <View style={styles.logoPlaceholder} />
                            <Text style={styles.appName}>NutriScan</Text>
                            <Text style={styles.modeTitle}>
                                {isForgotPassword
                                    ? "Reset your password"
                                    : isRegister
                                        ? "Create your account"
                                        : "Welcome back"}
                            </Text>
                        </View>

                        <View style={styles.bottomSection}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@mail.com"
                                    placeholderTextColor={Colors.blackLight}
                                    value={email}
                                    onChangeText={(value) => {
                                        setEmail(value);
                                        resetFeedback();
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                                {email.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => setEmail("")}
                                        style={styles.clearIcon}
                                        disabled={loading}
                                    >
                                        <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {!isForgotPassword && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor={Colors.blackLight}
                                        value={password}
                                        onChangeText={(value) => {
                                            setPassword(value);
                                            resetFeedback();
                                        }}
                                        secureTextEntry
                                        editable={!loading}
                                    />
                                    {password.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => setPassword("")}
                                            style={styles.clearIcon}
                                            disabled={loading}
                                        >
                                            <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {isRegister && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm password"
                                        placeholderTextColor={Colors.blackLight}
                                        value={confirmPassword}
                                        onChangeText={(value) => {
                                            setConfirmPassword(value);
                                            resetFeedback();
                                        }}
                                        secureTextEntry
                                        editable={!loading}
                                    />
                                    {confirmPassword.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => setConfirmPassword("")}
                                            style={styles.clearIcon}
                                            disabled={loading}
                                        >
                                            <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {errorMessage.length > 0 && (
                                <Text style={[styles.feedbackText, styles.errorText]}>{errorMessage}</Text>
                            )}

                            {message.length > 0 && (
                                <Text style={[styles.feedbackText, styles.successText]}>{message}</Text>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.loginBtn, loading && styles.disabledBtn]}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.greenLight} />
                                    ) : (
                                        <Text style={styles.loginBtnText}>{primaryLabel}</Text>
                                    )}
                                </TouchableOpacity>

                                {!isForgotPassword && (
                                    <TouchableOpacity
                                        style={styles.forgotBtn}
                                        onPress={() => switchMode("forgotPassword")}
                                        disabled={loading}
                                    >
                                        <Text style={styles.forgotBtnText}>Forgot password?</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={styles.registerBtn}
                                    onPress={() => switchMode(isRegister ? "login" : "register")}
                                    disabled={loading}
                                >
                                    <Text style={styles.registerBtnText}>
                                        {isRegister ? "Back to Login" : "Register"}
                                    </Text>
                                </TouchableOpacity>

                                {isForgotPassword && (
                                    <TouchableOpacity
                                        style={styles.backBtn}
                                        onPress={() => switchMode("login")}
                                        disabled={loading}
                                    >
                                        <Text style={styles.forgotBtnText}>Back to login</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#FCF5FC",
    },
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: "space-between",
    },
    topSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    logoPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.greenDark,
        backgroundColor: Colors.white,
        marginBottom: 20,
    },
    appName: {
        fontSize: 38,
        fontWeight: "900",
        color: Colors.black,
        letterSpacing: 0,
        textAlign: "center",
    },
    modeTitle: {
        color: Colors.blackLight,
        fontSize: 16,
        fontWeight: "600",
        marginTop: 8,
        textAlign: "center",
    },
    bottomSection: {
        backgroundColor: Colors.wheat,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 38,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 15,
        height: 56,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
    },
    clearIcon: {
        padding: 5,
    },
    feedbackText: {
        borderRadius: 12,
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
        marginBottom: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        textAlign: "center",
    },
    errorText: {
        backgroundColor: "#FCEEEE",
        color: Colors.danger,
    },
    successText: {
        backgroundColor: Colors.historyBg,
        color: Colors.greenDark,
    },
    buttonContainer: {
        marginTop: 8,
        gap: 14,
    },
    loginBtn: {
        backgroundColor: Colors.greenDark,
        borderRadius: 30,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledBtn: {
        opacity: 0.75,
    },
    loginBtnText: {
        color: Colors.greenLight,
        fontSize: 22,
        fontWeight: "800",
    },
    forgotBtn: {
        alignItems: "center",
        paddingVertical: 4,
    },
    forgotBtnText: {
        color: Colors.greenDark,
        fontSize: 16,
        fontWeight: "700",
    },
    registerBtn: {
        backgroundColor: "transparent",
        borderRadius: 30,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.greenDark,
    },
    registerBtnText: {
        color: Colors.black,
        fontSize: 22,
        fontWeight: "800",
    },
    backBtn: {
        alignItems: "center",
        paddingVertical: 4,
    },
});
