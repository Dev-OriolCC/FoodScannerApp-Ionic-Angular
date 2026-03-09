import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/types";
import { Colors } from "../constants/colors";
import { TopBar } from '../components/TopBar';

type Props = BottomTabScreenProps<TabParamList, "Home">;


export function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <TopBar />

            <View style={styles.content}>

                <View style={styles.scanTextWrapper}>
                    <Text style={styles.scanText}>Start Scanning</Text>
                </View>

                <TouchableOpacity style={styles.scanButton} activeOpacity={0.8} onPress={ () => navigation.navigate("FormBarcodeScreen") } >
                    <Text style={styles.scanButtonText}>Scan Barcode</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        marginTop: -60,
    },

    scanTextWrapper: {
        position: "relative",
        marginBottom: 40,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    
    scanText: {
        fontSize: 72,
        fontWeight: "800",
        color: Colors.black,
        textAlign: "center",
    },

    scanButton: {
        backgroundColor: Colors.greenDark,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
    },
    scanButtonText: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: "700",
    },
});