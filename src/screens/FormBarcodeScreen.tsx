import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Product, RootStackParamList } from "../navigation/types";
import {
    Animated,
    Easing,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

type Navigation = NativeStackNavigationProp<RootStackParamList>

async function fetchProductByBarcode(barcode: string): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 10000));

    return {
        barcode,
    };
}

export function FormBarcodeScreen() {
    const navigation = useNavigation<Navigation>();
    const scanLockRef = useRef(false);
    const isMountedRef = useRef(true);
    const spinnerValue = useRef(new Animated.Value(0)).current;
    const [permission, requestPermission] = useCameraPermissions();
    const [barcode, setBarcode] = useState("");
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [scanError, setScanError] = useState("");

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinnerValue, {
                toValue: 1,
                duration: 1050,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true,
            })
        );

        if (isLoadingProduct) {
            spinnerValue.setValue(0);
            animation.start();
        }

        return () => {
            animation.stop();
        };
    }, [isLoadingProduct, spinnerValue]);

    const handleClear = () => setBarcode("");

    const handleOpenCamera = async () => {
        setScanError("");

        if (!permission?.granted) {
            const result = await requestPermission();

            if (!result.granted) {
                setScanError("Camera permission is required to scan a barcode.");
                return;
            }
        }

        scanLockRef.current = false;
        setIsScanning(false);
        setIsCameraOpen(true);
    };

    const handleCloseCamera = () => {
        if (!isScanning) {
            setIsCameraOpen(false);
            setScanError("");
        }
    };

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanLockRef.current) {
            return;
        }

        const scannedValue = data.trim();

        if (!scannedValue) {
            setScanError("No barcode found. Center the barcode and try again.");
            return;
        }

        scanLockRef.current = true;
        setIsScanning(true);
        setBarcode(scannedValue);
        setScanError("");
        setIsCameraOpen(false);
    };

    const handleSubmitBarcode = async () => {
        const trimmedBarcode = barcode.trim();

        if (!trimmedBarcode || isLoadingProduct) {
            return;
        }

        setScanError("");
        setIsLoadingProduct(true);

        try {
            const product = await fetchProductByBarcode(trimmedBarcode);

            if (!isMountedRef.current) {
                return;
            }

            setIsLoadingProduct(false);
            navigation.navigate("ResultScreen", { product });
        } catch {
            if (!isMountedRef.current) {
                return;
            }

            setIsLoadingProduct(false);
            setScanError("Could not fetch product information. Try again.");
        }
    };

    if (isLoadingProduct) {
        const rotation = spinnerValue.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
        });

        const pulseScale = spinnerValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.88, 1.08, 0.88],
        });

        return (
            <SafeAreaView style={styles.loadingSafe}>
                <View style={styles.loadingCenter}>
                    <Animated.View style={[styles.loadingHalo, { transform: [{ scale: pulseScale }] }]} />
                    <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: rotation }] }]} />
                </View>
            </SafeAreaView>
        );
    }

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
                            editable={!isLoadingProduct}
                        />
                        {barcode.length > 0 && (
                            <TouchableOpacity disabled={isLoadingProduct} onPress={handleClear} activeOpacity={0.7}>
                                <Ionicons name="close-circle-outline" size={22} color={Colors.blackLight} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Scan with Camera */}
                <TouchableOpacity
                    style={styles.cameraButton}
                    activeOpacity={0.7}
                    disabled={isLoadingProduct}
                    onPress={handleOpenCamera}
                >
                    <Ionicons name="camera-outline" size={22} color={Colors.black} />
                    <Text style={styles.cameraButtonText}>Scan with Camera</Text>
                </TouchableOpacity>

                {scanError.length > 0 && !isCameraOpen && (
                    <Text style={styles.inlineError}>{scanError}</Text>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.scanButton,
                    { backgroundColor: barcode ? Colors.greenDark : Colors.greenDarkLight }
                ]}
                activeOpacity={0.8}
                disabled={!barcode.trim() || isLoadingProduct}
                onPress={handleSubmitBarcode}
            >
                <Text style={styles.scanButtonText}>Submit</Text>
            </TouchableOpacity>

            <Modal visible={isCameraOpen} animationType="slide" onRequestClose={handleCloseCamera}>
                <SafeAreaView style={styles.cameraSafe}>
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
                        }}
                        onBarcodeScanned={isScanning ? undefined : handleBarcodeScanned}
                    >
                        <View style={styles.cameraTopBar}>
                            <TouchableOpacity
                                style={styles.cameraIconButton}
                                activeOpacity={0.8}
                                disabled={isScanning}
                                onPress={handleCloseCamera}
                            >
                                <Ionicons name="close-outline" size={30} color={Colors.white} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cameraOverlay}>
                            <View style={styles.scanFrame} />
                            <Text style={styles.cameraHint}>Center the barcode inside the frame</Text>
                        </View>

                        <View style={styles.cameraBottomBar}>
                            {scanError.length > 0 && (
                                <Text style={styles.cameraError}>{scanError}</Text>
                            )}
                            <Text style={styles.cameraStatus}>Scanning automatically...</Text>
                        </View>
                    </CameraView>
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loadingSafe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loadingCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingHalo: {
        position: "absolute",
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.greenLight,
        opacity: 0.42,
    },
    loadingSpinner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 8,
        borderColor: Colors.cardBorder,
        borderTopColor: Colors.greenDark,
        borderRightColor: Colors.greenLight,
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
    inlineError: {
        color: Colors.danger,
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
        marginTop: 12,
        textAlign: "center",
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
    cameraSafe: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    camera: {
        flex: 1,
    },
    cameraTopBar: {
        alignItems: "flex-start",
        paddingHorizontal: 18,
        paddingTop: 12,
    },
    cameraIconButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(6, 32, 0, 0.72)",
    },
    cameraOverlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
    },
    scanFrame: {
        width: "100%",
        maxWidth: 320,
        height: 190,
        borderRadius: 28,
        borderWidth: 4,
        borderColor: Colors.greenLight,
        backgroundColor: "rgba(254, 254, 254, 0.08)",
    },
    cameraHint: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "700",
        marginTop: 18,
        textAlign: "center",
    },
    cameraBottomBar: {
        paddingHorizontal: 20,
        paddingBottom: 34,
    },
    cameraError: {
        alignSelf: "center",
        color: Colors.white,
        backgroundColor: "rgba(179, 38, 30, 0.88)",
        borderRadius: 18,
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 20,
        marginBottom: 14,
        overflow: "hidden",
        paddingHorizontal: 14,
        paddingVertical: 8,
        textAlign: "center",
    },
    cameraStatus: {
        alignSelf: "center",
        color: Colors.greenDark,
        backgroundColor: Colors.white,
        borderRadius: 18,
        fontSize: 15,
        fontWeight: "800",
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingVertical: 10,
        textAlign: "center",
    },
})
