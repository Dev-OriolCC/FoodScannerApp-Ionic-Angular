import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from "../navigation/types";
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

//TODO: TEST USER-SIGNUP
import { supabase } from "../lib/supabase";

type Navigation = NativeStackNavigationProp<RootStackParamList>

export async function FormBarcodeScreen() {
    const navigation = useNavigation<Navigation>();
    const [barcode, setBarcode] = useState("");

    const handleClear = () => setBarcode("");

    //TODO SIGNUP
    const {data, error} = await supabase.auth.signUp({
        email: "",
        password: ""
    });

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.content}>


                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Enter Barcode</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            value={barcode}
                            onChangeText={setBarcode}
                            keyboardType="numeric"
                            placeholder="Enter barcode number"
                            placeholderTextColor={Colors.blackLight}
                        />
                        {barcode.length > 0 && (
                            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
                                <Ionicons name="close-circle-outline" size={22} color={Colors.blackLight} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Scan with Camera */}
                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.7}>
                    <Ionicons name="camera-outline" size={22} color={Colors.black} />
                    <Text style={styles.cameraButtonText}>Scan with Camera</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.scanButton,
                    { backgroundColor: barcode ? Colors.greenDark : Colors.greenDarkLight }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                    if (barcode) {
                        console.log(data, error);
                        navigation.navigate("ResultScreen");
                    }
                }}
            >
                <Text style={styles.scanButtonText}>Submit</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    content: {
        // flex: 1
        backgroundColor: Colors.historyBg,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        marginLeft: 7,
        marginRight: 7,
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 28,
        marginBottom: 20,
    },

    inputContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        marginBottom: 14,
    },
    inputLabel: {
        fontSize: 12,
        color: Colors.blackLight,
        marginBottom: 2,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
        paddingVertical: 2,
    },

    cameraButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 24,

        gap: 10,
    },
    cameraButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.black,
    },
    scanButton: {
        color: Colors.greenDark,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 30,
        marginHorizontal: 6,
        alignItems: "center",
        width: "97%",
    },
    scanButtonText: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: "700",
    },
})