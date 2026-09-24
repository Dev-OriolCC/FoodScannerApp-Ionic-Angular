import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBlobatar } from "@blobatar/react-native/animated";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";
import { surprised} from "blobatar/expression";

// Same surface and panel colors as the auth screens (login.tsx).
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

const AVATAR_SIZE = 88;
const MAX_EMAIL_LENGTH = 22;

// Keeps long emails on one line: cuts the part before the "@" and keeps the
// domain, e.g. "very.long.address@gmail.com" -> "very.long…@gmail.com".
function shortenEmail(email: string) {
    if (email.length <= MAX_EMAIL_LENGTH) {
        return email;
    }

    const atIndex = email.lastIndexOf("@");
    const domain = atIndex > 0 ? email.slice(atIndex) : "";
    const visibleLocalLength = MAX_EMAIL_LENGTH - domain.length - 1;

    // Domain too long to keep: just cut the end of the whole email.
    if (visibleLocalLength < 3) {
        return `${email.slice(0, MAX_EMAIL_LENGTH - 1)}…`;
    }

    return `${email.slice(0, visibleLocalLength)}…${domain}`;
}

const PROFILE_LOAD_DELAY = 900;
const INSIGHTS_REFRESH_DELAY = 900;

// UI only for now: static stats and advice until the real scan data is wired in.
const STATS = [
    { label: "Healthy", value: "4" },
    { label: "Unhealthy", value: "12" },
    { label: "Total", value: "16" },
];

const AI_SUMMARY =
    "After a weekend of small treats like chocolate it's a great idea to drink a lot of water. Recommend to have some protein etc etc...";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { signOut } = useAuth();

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    const email = user?.primaryEmailAddress?.emailAddress ?? "";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingProfile(false);
        }, PROFILE_LOAD_DELAY);

        return () => clearTimeout(timer);
    }, []);

    const handleRefreshInsights = () => {
        if (isRefreshingInsights) {
            return;
        }

        setIsRefreshingInsights(true);

        setTimeout(() => {
            setIsRefreshingInsights(false);
        }, INSIGHTS_REFRESH_DELAY);
    };

    const handleEditProfile = () => router.push("/edit-profile");

    const handleOpenLogout = () => {
        setLogoutError("");
        setIsLogoutModalVisible(true);
    };

    const handleCloseLogout = () => {
        if (isLoggingOut) {
            return;
        }

        setIsLogoutModalVisible(false);
    };

    // On success the root layout removes the tabs and shows the auth screens.
    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        setLogoutError("");

        try {
            await signOut();
        } catch {
            setLogoutError("Could not log out. Please try again.");
            setIsLoggingOut(false);
        }
    };

    if (isLoadingProfile || !isUserLoaded) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingWrap}>
                    <View style={styles.spinnerHalo}>
                        <ActivityIndicator size="large" color={colors.primary[700]} />
                    </View>
                </View>
                <ProfileSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                alwaysBounceVertical
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshingInsights}
                        onRefresh={handleRefreshInsights}
                        colors={[colors.primary[700]]}
                        tintColor={colors.primary[700]}
                        progressBackgroundColor={SURFACE_BG}
                    />
                }
            >
                {/* user info */}
                <View style={styles.userRow}>
                    <View style={styles.avatar}>
                        <AnimatedBlobatar
                            name={email || "guest"}
                            size={AVATAR_SIZE}
                            traits={{ shape: 0.933 }}
                            expression={surprised}
                            animate
                        />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.username} numberOfLines={1}>
                            {shortenEmail(email)}
                        </Text>
                        <TouchableOpacity style={styles.editButton} activeOpacity={0.85} onPress={handleEditProfile}>
                            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* stats + AI advice */}
                {isRefreshingInsights ? (
                    <InsightsSkeleton />
                ) : (
                    <View style={styles.insightsCard}>
                        <View style={styles.statsPanel}>
                            {STATS.map((stat) => (
                                <View key={stat.label} style={styles.statItem}>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.summaryPanel}>
                            <Text style={styles.summaryTitle}>AI-Powered Advice Summary</Text>
                            <Text style={styles.summaryText}>{AI_SUMMARY}</Text>
                        </View>
                    </View>
                )}

                {/* general options (UI only for now) */}
                <Text style={styles.sectionTitle}>General</Text>

                <View style={styles.group}>
                    <MenuRow label="Language" value="English (US)" />
                    <MenuRow
                        label="DarkMode"
                        right={(
                            <Switch
                                value={isDarkMode}
                                onValueChange={setIsDarkMode}
                                trackColor={{ false: colors.secondary[300], true: colors.accent }}
                                thumbColor="#FFFFFF"
                            />
                        )}
                    />
                    <MenuRow label="Security" />
                    <MenuRow label="Logout" isHighlighted onPress={handleOpenLogout} />
                </View>

                <View style={styles.group}>
                    <MenuRow label="Contact Us" />
                    <MenuRow label="Privacy Policy" />
                    <MenuRow label="Get Help" />
                </View>
            </ScrollView>

            <Modal
                transparent
                visible={isLogoutModalVisible}
                animationType="fade"
                onRequestClose={handleCloseLogout}
            >
                <Pressable style={styles.modalShade} onPress={handleCloseLogout}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

                        {!!logoutError && <Text style={styles.modalError}>{logoutError}</Text>}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary, isLoggingOut && styles.disabledButton]}
                                activeOpacity={0.85}
                                disabled={isLoggingOut}
                                onPress={handleCloseLogout}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, isLoggingOut && styles.disabledButton]}
                                activeOpacity={0.85}
                                disabled={isLoggingOut}
                                onPress={handleConfirmLogout}
                            >
                                {isLoggingOut ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.modalButtonText}>Yes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

interface MenuRowProps {
    label: string;
    value?: string;
    right?: React.ReactNode;
    isHighlighted?: boolean;
    onPress?: () => void;
}

// One row of an options group: label on the left, optional value / control on
// the right (a chevron by default).
function MenuRow({ label, value, right, isHighlighted, onPress }: MenuRowProps) {
    return (
        <TouchableOpacity
            style={[styles.row, isHighlighted && styles.rowHighlighted]}
            activeOpacity={onPress ? 0.85 : 1}
            onPress={onPress}
        >
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.rowRight}>
                {!!value && <Text style={styles.rowValue}>{value}</Text>}
                {right ?? <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />}
            </View>
        </TouchableOpacity>
    );
}

// Fades the skeleton in and out so it reads as "loading" rather than empty.
function Pulse({ children }: { children: React.ReactNode }) {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
            ]),
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

// Placeholder for the whole screen, laid out like the loaded content.
function ProfileSkeleton() {
    return (
        <Pulse>
            <View style={styles.scrollContent}>
                <View style={styles.userRow}>
                    <View style={[styles.skeletonBlock, styles.skeletonAvatar]} />
                    <View style={styles.userInfo}>
                        <View style={[styles.skeletonBlock, styles.skeletonName]} />
                        <View style={[styles.skeletonBlock, styles.skeletonEditButton]} />
                    </View>
                </View>

                <InsightsSkeleton />

                <View style={[styles.skeletonBlock, styles.skeletonSectionTitle]} />
                <View style={styles.group}>
                    {[0, 1, 2, 3].map((index) => (
                        <View key={index} style={styles.skeletonRow}>
                            <View style={[styles.skeletonOnGroup, styles.skeletonRowLabel]} />
                            <View style={[styles.skeletonOnGroup, styles.skeletonRowValue]} />
                        </View>
                    ))}
                </View>
            </View>
        </Pulse>
    );
}

// Placeholder for the stats + AI advice card (also shown while pull-to-refresh runs).
function InsightsSkeleton() {
    return (
        <View style={styles.insightsCard}>
            <View style={styles.statsPanel}>
                {[0, 1, 2].map((index) => (
                    <View key={index} style={[styles.skeletonOnPanel, styles.skeletonStat]} />
                ))}
            </View>

            <View style={styles.summaryPanel}>
                <View style={[styles.skeletonOnPanel, styles.skeletonTitle]} />
                <View style={[styles.skeletonOnPanel, styles.skeletonLine]} />
                <View style={[styles.skeletonOnPanel, styles.skeletonLineShort]} />
                <View style={[styles.skeletonOnPanel, styles.skeletonLine]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },

    /* loading */
    loadingWrap: {
        alignItems: "center",
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    spinnerHalo: {
        width: 74,
        height: 74,
        borderRadius: 37,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.accentLight,
        borderWidth: 8,
        borderColor: PANEL_BG,
    },

    /* user info */
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: "hidden",
        backgroundColor: PANEL_BG,
    },
    userInfo: {
        flex: 1,
        alignItems: "flex-start",
        gap: spacing.xs,
    },
    username: {
        ...textStyles.h3,
        alignSelf: "stretch",
        color: colors.secondary[700],
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        backgroundColor: colors.secondary[700],
        borderRadius: radius.xl,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    editButtonText: {
        ...textStyles.tiny,
        fontFamily: fontFamily.medium,
        color: "#FFFFFF",
    },

    /* stats + AI advice */
    insightsCard: {
        borderRadius: radius.xl,
        overflow: "hidden",
        marginBottom: spacing.xl,
    },
    statsPanel: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: colors.accentLight,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    statItem: {
        alignItems: "center",
        minWidth: 80,
    },
    statLabel: {
        ...textStyles.h3,
        color: colors.secondary[700],
    },
    statValue: {
        fontFamily: fontFamily.bold,
        fontSize: 36,
        lineHeight: 44,
        color: colors.secondary[700],
    },
    summaryPanel: {
        backgroundColor: PANEL_BG,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    summaryTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
    },
    summaryText: {
        ...textStyles.small,
        fontStyle: "italic",
        color: colors.secondary[700],
    },

    /* option groups */
    sectionTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    group: {
        backgroundColor: colors.primary[700],
        borderRadius: radius.lg,
        overflow: "hidden",
        paddingVertical: spacing.xs,
        marginBottom: spacing.xl,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        paddingHorizontal: spacing.lg,
    },
    rowHighlighted: {
        backgroundColor: colors.secondary[700],
    },
    rowLabel: {
        ...textStyles.h4,
        color: "#FFFFFF",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    rowValue: {
        ...textStyles.small,
        color: "#FFFFFF",
    },

    /* logout modal (same look as the delete modal in history.tsx) */
    modalShade: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(27, 42, 28, 0.4)",
        paddingHorizontal: spacing.xl,
    },
    modalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: SURFACE_BG,
        borderRadius: 32,
        padding: spacing.xl,
        ...shadows.level3,
    },
    modalTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    modalMessage: {
        ...textStyles.body,
        color: colors.secondary[700],
        textAlign: "center",
        marginBottom: spacing.xl,
    },
    modalError: {
        ...textStyles.small,
        color: colors.semantic.error,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    modalActions: {
        flexDirection: "row",
        gap: spacing.md,
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary[700],
        borderRadius: 24,
        height: 48,
    },
    modalButtonSecondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary[700],
    },
    modalButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
    modalButtonSecondaryText: {
        color: colors.primary[700],
    },
    disabledButton: {
        opacity: 0.6,
    },

    /* skeleton */
    skeletonBlock: {
        backgroundColor: colors.secondary[100],
    },
    skeletonOnPanel: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    skeletonOnGroup: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    skeletonAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    skeletonName: {
        width: "70%",
        height: 24,
        borderRadius: 12,
    },
    skeletonEditButton: {
        width: 96,
        height: 24,
        borderRadius: 12,
    },
    skeletonStat: {
        width: 80,
        height: 68,
        borderRadius: radius.md,
    },
    skeletonTitle: {
        width: "70%",
        height: 24,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    skeletonLine: {
        width: "100%",
        height: 14,
        borderRadius: 7,
        marginBottom: spacing.sm,
    },
    skeletonLineShort: {
        width: "72%",
        height: 14,
        borderRadius: 7,
        marginBottom: spacing.sm,
    },
    skeletonSectionTitle: {
        width: 90,
        height: 24,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    skeletonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        paddingHorizontal: spacing.lg,
    },
    skeletonRowLabel: {
        width: 110,
        height: 16,
        borderRadius: 8,
    },
    skeletonRowValue: {
        width: 40,
        height: 16,
        borderRadius: 8,
    },
});
