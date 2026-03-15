import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ResultScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton} activeOpacity={0.7}>
                    <Ionicons name="close-circle-outline" size={36} color={Colors.black} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.mainCard}>
                    <Text style={styles.title}>Ocean Spray 500ml</Text>
                    <Text style={styles.barcodeText}>[ 103006222 ]</Text>

                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { borderColor: Colors.greenDark }]}>
                            <Text style={styles.statValue}>238</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                        </View>
                        <View style={[styles.statBox, { borderColor: '#B3261E' }]}>
                            <Text style={styles.statValue}>17.39</Text>
                            <Text style={styles.statLabel}>Fat</Text>
                        </View>
                        <View style={[styles.statBox, { borderColor: Colors.greenDark }]}>
                            <Text style={styles.statValue}>238</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                        </View>
                        <View style={[styles.statBox, { borderColor: Colors.greenDark }]}>
                            <Text style={styles.statValue}>17.39</Text>
                            <Text style={styles.statLabel}>Fat</Text>
                        </View>
                    </View>

                    <View style={styles.tagsContainer}>
                        <View style={[styles.tag, { borderColor: '#B3261E' }]}>
                            <Text style={styles.tagText}>Contains Caffeine</Text>
                        </View>
                        <View style={[styles.tag, { borderColor: '#B3261E' }]}>
                            <Text style={styles.tagText}>Contains Colorants</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.returnButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("MainTabs")}
                >
                    <Text style={styles.returnButtonText}>Return Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#E5E5E5', // 
    },
    closeButton: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    mainCard: {
        backgroundColor: Colors.wheat,
        borderRadius: 40,
        paddingHorizontal: 20,
        paddingVertical: 28,
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 8,
    },
    barcodeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    statBox: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderWidth: 1.5,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 16,
        color: Colors.black,
        fontWeight: '500',
    },
    tagsContainer: {
        width: '100%',
        gap: 12,
        marginTop: 4,
    },
    tag: {
        width: '100%',
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
    },
    returnButton: {
        backgroundColor: Colors.greenDark,
        borderRadius: 30,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    returnButtonText: {
        color: Colors.wheat,
        fontSize: 20,
        fontWeight: 'bold',
    },
});