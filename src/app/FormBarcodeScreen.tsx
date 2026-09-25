import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { fetchProduct } from "../services/openFoodFacts";
import { useScanStore } from "../store/useScanStore";
import { colors, fontFamily, radius, spacing } from "../theme";

// Same surface and panel colors as the auth screens (login.tsx).
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

export default function FormBarcodeScreen() {
    const router = useRouter();
    const addScan = useScanStore((state) => state.addScan);

    const scanLockRef = useRef(false);
    const isMountedRef = useRef(true);
    const spinnerValue = useRef(new Animated.Value(0)).current;
    const [permission, requestPermission] = useCameraPermissions();
    const [barcode, setBarcode] = useState("");
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [scanError, setScanError] = useState("");

    const hasBarcode = barcode.trim().length > 0;

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

    const handleClose = () => router.back();

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
            const product = await fetchProduct(trimmedBarcode);

            if (!isMountedRef.current) {
                return;
            }

            setIsLoadingProduct(false);

            if (!product) {
                setScanError("Product not found in Open Food Facts.");
                return;
            }

            addScan(product);
            router.push({ pathname: "/result/[id]", params: { id: product.barcode } });
        } catch {
            if (!isMountedRef.current) {
                return;
            }

            setIsLoadingProduct(false);
            setScanError("Could not fetch product information. Try again.");
        }
    };

    // Full-screen modal with an X on the upper left to close it.
    const header = (
        <Stack.Screen
            options={{
                headerShown: true,
                presentation: "fullScreenModal",
                animation: "slide_from_bottom",
                title: "Enter Information",
                headerTitleAlign: "center",
                headerTitleStyle: { fontFamily: fontFamily.medium, fontSize: 16, color: colors.secondary[700] },
                headerStyle: { backgroundColor: SURFACE_BG },
                headerShadowVisible: false,
                headerBackVisible: false,
                contentStyle: { backgroundColor: SURFACE_BG },
                headerLeft: () => (
                    <TouchableOpacity onPress={handleClose} hitSlop={12} disabled={isLoadingProduct}>
                        <Ionicons name="close-circle-outline" size={28} color={colors.secondary[700]} />
                    </TouchableOpacity>
                ),
            }}
        />
    );

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
            <SafeAreaView style={styles.safe} edges={["bottom"]}>
                {header}
                <View style={styles.loadingCenter}>
                    <Animated.View style={[styles.loadingHalo, { transform: [{ scale: pulseScale }] }]} />
                    <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: rotation }] }]} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
            {header}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.body}>
                    <View style={styles.panel}>
                        <View style={styles.inputBox}>
                            <View style={styles.inputContent}>
                                <Text style={styles.inputLabel}>Enter Barcode</Text>
                                <TextInput
                                    style={styles.input}
                                    value={barcode}
                                    onChangeText={setBarcode}
                                    keyboardType="numeric"
                                    placeholder="10300622"
                                    placeholderTextColor={colors.secondary[300]}
                                />
                            </View>
                            {barcode.length > 0 && (
                                <TouchableOpacity onPress={handleClear} hitSlop={8}>
                                    <Ionicons name="close-circle-outline" size={20} color={colors.secondary[700]} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85} onPress={handleOpenCamera}>
                            <Ionicons name="camera-outline" size={22} color={colors.secondary[700]} />
                            <Text style={styles.cameraButtonText}>Scan with Camera</Text>
                        </TouchableOpacity>

                        {scanError.length > 0 && !isCameraOpen && (
                            <Text style={styles.errorText}>{scanError}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, !hasBarcode && styles.buttonDisabled]}
                        activeOpacity={0.85}
                        disabled={!hasBarcode}
                        onPress={handleSubmitBarcode}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <Modal visible={isCameraOpen} animationType="slide" onRequestClose={handleCloseCamera}>
                <SafeAreaView style={styles.cameraSafe}>
                    <CameraView
                        style={styles.flex}
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
                                <Ionicons name="close-outline" size={28} color="#FFFFFF" />
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
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: SURFACE_BG,
    },
    flex: {
        flex: 1,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
    },
    panel: {
        backgroundColor: PANEL_BG,
        borderRadius: 32,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: radius.xs,
        borderBottomWidth: 2,
        borderBottomColor: colors.secondary[300],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginBottom: spacing.lg,
    },
    inputContent: {
        flex: 1,
    },
    inputLabel: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        color: colors.secondary[500],
    },
    input: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.secondary[700],
        paddingVertical: spacing.xs,
    },
    cameraButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        height: 48,
        borderRadius: 24,
        gap: spacing.md,
    },
    cameraButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: colors.secondary[700],
    },
    errorText: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        color: colors.semantic.error,
        marginTop: spacing.md,
        textAlign: "center",
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    submitButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        backgroundColor: colors.primary[300],
    },
    submitButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },

    loadingCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingHalo: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: PANEL_BG,
    },
    loadingSpinner: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 14,
        borderColor: colors.secondary[100],
        borderTopColor: colors.primary[700],
        borderRightColor: colors.primary[300],
    },

    cameraSafe: {
        flex: 1,
        backgroundColor: "#000000",
    },
    cameraTopBar: {
        alignItems: "flex-start",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    cameraIconButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(27, 42, 28, 0.72)",
    },
    cameraOverlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },
    scanFrame: {
        width: "100%",
        maxWidth: 320,
        height: 190,
        borderRadius: 28,
        borderWidth: 4,
        borderColor: colors.primary[300],
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    cameraHint: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: "#FFFFFF",
        marginTop: spacing.lg,
        textAlign: "center",
    },
    cameraBottomBar: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing["2xl"],
    },
    cameraError: {
        alignSelf: "center",
        fontFamily: fontFamily.semiBold,
        fontSize: 12,
        lineHeight: 18,
        color: "#FFFFFF",
        backgroundColor: colors.semantic.error,
        borderRadius: radius.xl,
        overflow: "hidden",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginBottom: spacing.md,
        textAlign: "center",
    },
    cameraStatus: {
        alignSelf: "center",
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
        backgroundColor: "#FFFFFF",
        borderRadius: radius.xl,
        overflow: "hidden",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        textAlign: "center",
    },
});
