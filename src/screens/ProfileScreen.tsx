import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { useAuth } from "../provider/AuthProvider";
import { supabase } from "../lib/supabase";

const PROFILE_LOAD_DELAY = 900;
const INSIGHTS_REFRESH_DELAY = 900;

const STATS = [
    { label: "Healthy", value: "4" },
    { label: "Unhealthy", value: "12" },
    { label: "Total", value: "16" },
];

const AI_SUMMARY =
    "After a weekend of small treats like chocolate it's a great idea to drink a lot of water. Recommend to have some protein etc etc... lorem ipsum dolor";

export function ProfileScreen() {
    const { session } = useAuth();
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingProfile(false);
        }, PROFILE_LOAD_DELAY);

        return () => clearTimeout(timer);
    }, []);

    const username = useMemo(() => {
        const email = session?.user.email;

        if (!email) {
            return "Username";
        }

        const [prefix] = email.split("@");
        return prefix || "Username";
    }, [session?.user.email]);

    const openLogoutModal = () => {
        setLogoutError("");
        setIsLogoutModalVisible(true);
    };

    const handleRefreshInsights = () => {
        if (isRefreshingInsights) {
            return;
        }

        setIsRefreshingInsights(true);

        setTimeout(() => {
            setIsRefreshingInsights(false);
        }, INSIGHTS_REFRESH_DELAY);
    };

    const closeLogoutModal = () => {
        if (!isSigningOut) {
            setIsLogoutModalVisible(false);
        }
    };

    const handleLogout = async () => {
        setLogoutError("");
        setIsSigningOut(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            setLogoutError(error.message);
            setIsSigningOut(false);
            return;
        }

        setIsLogoutModalVisible(false);
        setIsSigningOut(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.topBar}>
                <Ionicons name="person-circle-outline" size={30} color={Colors.black} />
                <View style={styles.topBarRight}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.black} />
                    <Ionicons name="settings-outline" size={24} color={Colors.black} style={styles.settingsIcon} />
                </View>
            </View>

            {isLoadingProfile ? (
                <View style={styles.content}>
                    <View style={styles.loadingWrap}>
                        <View style={styles.spinnerHalo}>
                            <ActivityIndicator size="large" color={Colors.greenDark} />
                        </View>
                    </View>
                    <ProfileSkeleton />
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    alwaysBounceVertical
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshingInsights}
                            onRefresh={handleRefreshInsights}
                            colors={[Colors.greenDark]}
                            tintColor={Colors.greenDark}
                            progressBackgroundColor={Colors.historyBg}
                        />
                    }
                >
                    <View style={styles.avatar} />
                    <Text style={styles.username}>{username}</Text>

                    {isRefreshingInsights ? (
                        <ProfileInsightsSkeleton />
                    ) : (
                        <>
                            <View style={styles.statsPanel}>
                                {STATS.map((stat) => (
                                    <View key={stat.label} style={styles.statItem}>
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.summarySection}>
                                <Text style={styles.summaryTitle}>AI-Powered Advice Summary</Text>
                                <Text style={styles.summaryText}>{AI_SUMMARY}</Text>
                            </View>
                        </>
                    )}

                    <View style={styles.logoutWrap}>
                        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={openLogoutModal}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            <Modal
                transparent
                visible={isLogoutModalVisible}
                animationType="fade"
                onRequestClose={closeLogoutModal}
            >
                <Pressable style={styles.modalShade} onPress={closeLogoutModal}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>

                        {logoutError.length > 0 && <Text style={styles.modalError}>{logoutError}</Text>}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                activeOpacity={0.8}
                                disabled={isSigningOut}
                                onPress={closeLogoutModal}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, isSigningOut && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={isSigningOut}
                                onPress={handleLogout}
                            >
                                {isSigningOut ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <Text style={styles.modalButtonText}>Logout</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

function ProfileSkeleton() {
    return (
        <View style={styles.skeletonContent}>
            <View style={[styles.skeletonBlock, styles.skeletonAvatar]} />
            <View style={[styles.skeletonBlock, styles.skeletonName]} />
            <View style={styles.skeletonStatsPanel}>
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
            </View>
            <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
            <View style={[styles.skeletonBlock, styles.skeletonLine]} />
            <View style={[styles.skeletonBlock, styles.skeletonLineShort]} />
            <View style={[styles.skeletonBlock, styles.skeletonLine]} />
        </View>
    );
}

function ProfileInsightsSkeleton() {
    return (
        <>
            <View style={styles.skeletonStatsPanel}>
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
                <View style={[styles.skeletonBlock, styles.skeletonStat]} />
            </View>
            <View style={styles.summarySection}>
                <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
                <View style={[styles.skeletonBlock, styles.skeletonLine]} />
                <View style={[styles.skeletonBlock, styles.skeletonLineShort]} />
                <View style={[styles.skeletonBlock, styles.skeletonLine]} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#FCF5FC",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    topBarRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingsIcon: {
        marginLeft: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 12,
    },
    scrollContent: {
        flexGrow: 1,
    },
    loadingWrap: {
        alignItems: "center",
        marginBottom: 14,
        marginTop: 8,
    },
    spinnerHalo: {
        width: 74,
        height: 74,
        borderRadius: 37,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.greenLight,
        borderWidth: 8,
        borderColor: Colors.historyBg,
    },
    avatar: {
        alignSelf: "center",
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: Colors.wheat,
        marginTop: 8,
        marginBottom: 10,
    },
    username: {
        color: Colors.black,
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 22,
    },
    statsPanel: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.greenLight,
        borderRadius: 34,
        paddingHorizontal: 20,
        paddingVertical: 22,
        marginBottom: 18,
    },
    statItem: {
        alignItems: "center",
        minWidth: 82,
    },
    statLabel: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
    },
    statValue: {
        color: Colors.black,
        fontSize: 34,
        fontWeight: "900",
    },
    summarySection: {
        flex: 1,
        backgroundColor: Colors.wheat,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 12,
        paddingTop: 14,
    },
    summaryTitle: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 4,
    },
    summaryText: {
        color: Colors.black,
        fontSize: 15,
        fontStyle: "italic",
        lineHeight: 20,
    },
    logoutWrap: {
        alignItems: "center",
        backgroundColor: Colors.wheat,
        paddingBottom: 42,
        paddingTop: 18,
    },
    logoutButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242424",
        borderRadius: 30,
        height: 50,
        minWidth: 150,
        paddingHorizontal: 28,
    },
    logoutButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "800",
    },
    modalShade: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        paddingHorizontal: 24,
    },
    modalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingBottom: 18,
        paddingTop: 16,
    },
    modalTitle: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 36,
    },
    modalMessage: {
        color: Colors.black,
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 28,
    },
    modalError: {
        color: Colors.danger,
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 18,
        marginBottom: 14,
        textAlign: "center",
    },
    modalActions: {
        flexDirection: "row",
        gap: 14,
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242424",
        borderRadius: 24,
        height: 42,
    },
    modalButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "800",
    },
    disabledButton: {
        opacity: 0.75,
    },
    skeletonContent: {
        flex: 1,
        alignItems: "center",
    },
    skeletonBlock: {
        backgroundColor: "#E7E1E7",
        overflow: "hidden",
    },
    skeletonAvatar: {
        width: 112,
        height: 112,
        borderRadius: 56,
        marginBottom: 12,
    },
    skeletonName: {
        width: 128,
        height: 24,
        borderRadius: 12,
        marginBottom: 22,
    },
    skeletonStatsPanel: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.greenLight,
        borderRadius: 34,
        paddingHorizontal: 20,
        paddingVertical: 22,
        marginBottom: 18,
    },
    skeletonStat: {
        width: 72,
        height: 62,
        borderRadius: 18,
        backgroundColor: "rgba(254, 254, 254, 0.7)",
    },
    skeletonTitle: {
        alignSelf: "flex-start",
        width: 230,
        height: 24,
        borderRadius: 12,
        marginBottom: 14,
    },
    skeletonLine: {
        alignSelf: "flex-start",
        width: "92%",
        height: 16,
        borderRadius: 8,
        marginBottom: 10,
    },
    skeletonLineShort: {
        alignSelf: "flex-start",
        width: "72%",
        height: 16,
        borderRadius: 8,
        marginBottom: 10,
    },
});
