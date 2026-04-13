import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                            <Text style={styles.appName}>App Name</Text>
                        </View>
                        
                        <View style={styles.bottomSection}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@mail.com"
                                    placeholderTextColor={Colors.blackLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {email.length === 0 ? (
                                    <TouchableOpacity style={styles.clearIcon}>
                                        <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setEmail("")} style={styles.clearIcon}>
                                        <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="********"
                                    placeholderTextColor={Colors.blackLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                {password.length === 0 ? (
                                    <TouchableOpacity style={styles.clearIcon}>
                                        <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setPassword("")} style={styles.clearIcon}>
                                        <Ionicons name="close-circle-outline" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.loginBtn}>
                                    <Text style={styles.loginBtnText}>Login</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.registerBtn}>
                                    <Text style={styles.registerBtnText}>Register</Text>
                                </TouchableOpacity>
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
        letterSpacing: -1,
    },
    bottomSection: {
        backgroundColor: Colors.wheat, //
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 50,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 4,
        marginBottom: 20,
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
    buttonContainer: {
        marginTop: 20,
        gap: 15,
    },
    loginBtn: {
        backgroundColor: Colors.greenDark,
        borderRadius: 30,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },
    loginBtnText: {
        color: Colors.greenLight, // As seen in screenshot, text is light green
        fontSize: 22,
        fontWeight: "800",
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
});