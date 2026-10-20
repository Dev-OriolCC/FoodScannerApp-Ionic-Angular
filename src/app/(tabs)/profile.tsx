import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useAuth, useUser } from "@clerk/expo";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedBlobatar } from "@blobatar/react-native/animated";
import { surprised } from "blobatar/expression";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../../theme";
import { ContainsSeal, OctagonSeal } from "../../components/WarningSeal";
import { ContainsWarningId, ExcessWarningId } from "../../constants/nom051";
import { getWarnings } from "../../lib/nom051";
import { ScannedProduct, useScanStore } from "../../store/useScanStore";
import { ONBOARDING_SEEN_KEY } from "../../constants/onboarding";

// Profile-only colors from the profile mock; not part of the token set.
const SCREEN_BG = "#F6FAF6";
const CHIP_BG = "#F1F5F1";
const AVATAR_BG = "#C8E6C9";
const DANGER_BG = "#FDECEA";
const HERO_LINE = "rgba(255,255,255,0.06)";
const SURFACE_BG = "#FEF7FF";

// Thick "circuit" line behind the avatar, in hero coordinates (same idea as the Home hero card).
const HERO_LINE_PATH = "M-20 70 L30 82 L110 112";

const AVATAR_SIZE = 72;
const AVATAR_BORDER = 3;
// How far the stats card climbs over the green header.
const HERO_OVERLAP = 40;
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

type SealId = ExcessWarningId | ContainsWarningId;

// Every NOM-051 seal: short name for the chips, phrase for the summary text.
const SEALS: { id: SealId; name: string; phrase: string; isOctagon: boolean }[] = [
    { id: "sugars", name: "Sugars", phrase: "excess sugars", isOctagon: true },
    { id: "calories", name: "Calories", phrase: "excess calories", isOctagon: true },
    { id: "saturatedFat", name: "Sat. fat", phrase: "excess saturated fat", isOctagon: true },
    { id: "sodium", name: "Sodium", phrase: "excess sodium", isOctagon: true },
    { id: "sweeteners", name: "Sweeteners", phrase: "contains sweeteners", isOctagon: false },
    { id: "caffeine", name: "Caffeine", phrase: "contains caffeine", isOctagon: false },
    { id: "colorants", name: "Colorants", phrase: "contains colorants", isOctagon: false },
];

type SealCount = (typeof SEALS)[number] & { count: number };

// How many scanned products carry each seal, most frequent first. Seals that
// never appear are left out.
function countSeals(products: ScannedProduct[]): SealCount[] {
    const counts: Partial<Record<SealId, number>> = {};

    for (const product of products) {
        const { excess, contains } = getWarnings(product);

        for (const id of [...excess, ...contains]) {
            counts[id] = (counts[id] ?? 0) + 1;
        }
    }

    return SEALS.map((seal) => ({ ...seal, count: counts[seal.id] ?? 0 }))
        .filter((seal) => seal.count > 0)
        .sort((a, b) => b.count - a.count);
}

// UI only for now: a short sentence built from the counts, until the AI summary is wired in.
function buildSummary(sealCounts: SealCount[], total: number, noSeals: number) {
    if (total === 0) {
        return "Scan a few products to see which seals show up most often in your history.";
    }

    const [first, second] = sealCounts;

    if (!first) {
        return "None of your scanned products carried seals so far.";
    }

    const mostOften = `${first.phrase.charAt(0).toUpperCase()}${first.phrase.slice(1)} is the seal that appears most often in your recent scans`;
    const followedBy = second ? `, followed by ${second.phrase}.` : ".";
    const productsLabel = total === 1 ? "product" : "products";

    return `${mostOften}${followedBy} ${noSeals} of your ${total} scanned ${productsLabel} carried no seals.`;
}

export default function ProfileScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { signOut } = useAuth();

    const products = useScanStore((state) => state.products);
    const scanUserId = useScanStore((state) => state.userId);
    const isLoadingScans = useScanStore((state) => state.isLoading);
    const loadHistory = useScanStore((state) => state.loadHistory);

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    // Name from Edit Profile first, then the Clerk username, then the email.
    const displayName = user?.fullName || user?.username || shortenEmail(email);

    // Counters from the user's scan history. "No seals" also counts the
    // products without nutrition data, since they carry no seals either.
    const withSealsCount = products.filter((product) => {
        const { excess, contains } = getWarnings(product);
        return excess.length > 0 || contains.length > 0;
    }).length;
    const noSealsCount = products.length - withSealsCount;
    const sealCounts = countSeals(products);
    const summary = buildSummary(sealCounts, products.length, noSealsCount);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadingProfile(false);
        }, PROFILE_LOAD_DELAY);

        return () => clearTimeout(timer);
    }, []);

    const handleRefreshInsights = () => {
        if (scanUserId) {
            loadHistory(scanUserId);
        }
    };

    const handleEditProfile = () => router.push("/edit-profile");

    // Testing only: clears the "seen" flag and replays the onboarding.
    const handleEnableOnboarding = async () => {
        await AsyncStorage.removeItem(ONBOARDING_SEEN_KEY);
        router.push("/onboarding");
    };

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

    const renderStatsBar = () => {
        if (products.length === 0) {
            return <View style={[styles.barSegment, styles.barEmpty]} />;
        }

        return (
            <>
                {withSealsCount > 0 && (
                    <View style={[styles.barSegment, styles.barWithSeals, { flex: withSealsCount }]} />
                )}
                {noSealsCount > 0 && (
                    <View style={[styles.barSegment, styles.barNoSeals, { flex: noSealsCount }]} />
                )}
            </>
        );
    };

    // Green header bar to match the hero below it; the tab layout's header stays as is on other tabs.
    const header = (
        <Tabs.Screen
            options={{
                headerStyle: { backgroundColor: colors.primary[700] },
                headerTitleStyle: { fontFamily: fontFamily.semiBold, fontSize: 18, color: "#FFFFFF" },
            }}
        />
    );

    // White status bar icons on the green header, only while this tab is open.
    const statusBar = isFocused && <StatusBar barStyle="light-content" />;

    if (isLoadingProfile || !isUserLoaded) {
        return (
            <View style={styles.container}>
                {header}
                {statusBar}
                <ProfileSkeleton />
            </View>
        );
    }

    const stats = [
        {
            label: "Total scans",
            value: products.length,
            icon: <MaterialCommunityIcons name="barcode-scan" size={24} color={colors.primary[700]} />,
        },
        { label: "With seals", value: withSealsCount, icon: <OctagonSeal size={22} /> },
        {
            label: "No seals",
            value: noSealsCount,
            icon: <Ionicons name="checkmark-circle" size={26} color={colors.primary[500]} />,
        },
    ];

    return (
        <View style={styles.container}>
            {header}
            {statusBar}

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                alwaysBounceVertical
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingScans}
                        onRefresh={handleRefreshInsights}
                        colors={[colors.primary[700]]}
                        tintColor="#FFFFFF"
                        progressBackgroundColor="#FFFFFF"
                    />
                }
            >
                {/* green header: avatar, name and edit button */}
                <View style={styles.hero}>
                    <HeroBackground />

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
                            {displayName}
                        </Text>
                        <TouchableOpacity style={styles.editButton} activeOpacity={0.85} onPress={handleEditProfile}>
                            <Feather name="edit-2" size={15} color={colors.primary[700]} />
                            <Text style={styles.editButtonText}>Edit profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* scan counters (only the numbers pulse while the history loads) */}
                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        {stats.map((stat, index) => (
                            <React.Fragment key={stat.label}>
                                {index > 0 && <View style={styles.statDivider} />}
                                <View style={styles.statItem}>
                                    <View style={styles.statIcon}>{stat.icon}</View>
                                    {isLoadingScans ? (
                                        <Pulse>
                                            <View style={[styles.skeletonBlock, styles.skeletonStatValue]} />
                                        </Pulse>
                                    ) : (
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                    )}
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>

                    {/* share of products with and without seals */}
                    {isLoadingScans ? (
                        <Pulse>
                            <View style={[styles.bar, styles.skeletonBlock]} />
                        </Pulse>
                    ) : (
                        <View style={styles.bar}>{renderStatsBar()}</View>
                    )}
                </View>

                {/* scan summary */}
                <View style={styles.card}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.iconBox}>
                            <MaterialIcons name="auto-awesome" size={20} color={colors.primary[700]} />
                        </View>
                        <Text style={styles.summaryTitle}>Scan summary</Text>
                        <View style={styles.aiBadge}>
                            <Text style={styles.aiBadgeText}>AI-generated</Text>
                        </View>
                    </View>

                    {isLoadingScans ? (
                        <SummarySkeleton />
                    ) : (
                        <>
                            <Text style={styles.summaryText}>{summary}</Text>

                            {sealCounts.length > 0 && (
                                <View style={styles.chips}>
                                    {sealCounts.map((seal) => (
                                        <View key={seal.id} style={styles.chip}>
                                            {seal.isOctagon ? (
                                                <OctagonSeal size={16} />
                                            ) : (
                                                <ContainsSeal width={18} height={11} />
                                            )}
                                            <Text style={styles.chipLabel}>{seal.name}</Text>
                                            <Text style={styles.chipCount}>{seal.count}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* general options (UI only for now) */}
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.group}>
                    <MenuRow icon="globe-outline" label="Language" value="English (US)" />
                    <MenuRow
                        icon="moon-outline"
                        label="Dark mode"
                        onPress={() => setIsDarkMode((value) => !value)}
                        right={<Toggle value={isDarkMode} onValueChange={setIsDarkMode} />}
                    />
                    <MenuRow icon="shield-checkmark-outline" label="Security" isLast />
                </View>

                {/* support options (UI only for now) */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.group}>
                    <MenuRow icon="mail-outline" label="Contact us" />
                    <MenuRow icon="document-text-outline" label="Privacy policy" />
                    <MenuRow icon="help-circle-outline" label="Get help" isLast />
                </View>

                <View style={[styles.group, styles.groupSpaced]}>
                    <MenuRow icon="log-out-outline" label="Log out" isDanger isLast onPress={handleOpenLogout} />
                </View>

                {/* Testing only: remove before release */}
                {__DEV__ && (
                    <View style={[styles.group, styles.groupSpaced]}>
                        <MenuRow icon="refresh-outline" label="Enable Onboarding" isLast onPress={handleEnableOnboarding} />
                    </View>
                )}
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

// Decoration of the green header: a faint line, plus a green block above it so
// pulling the list down (iOS bounce) never shows the light background.
function HeroBackground() {
    return (
        <>
            <View style={styles.heroOverscroll} />
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                <Path d={HERO_LINE_PATH} stroke={HERO_LINE} strokeWidth={14} strokeLinejoin="round" fill="none" />
            </Svg>
        </>
    );
}

interface MenuRowProps {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value?: string;
    right?: React.ReactNode;
    // Red row for destructive actions (log out); no chevron.
    isDanger?: boolean;
    // The last row of a group has no divider under it.
    isLast?: boolean;
    onPress?: () => void;
}

// One row of an options group: icon and label on the left, optional value /
// control on the right (a chevron by default).
function MenuRow({ icon, label, value, right, isDanger, isLast, onPress }: MenuRowProps) {
    const tint = isDanger ? colors.semantic.error : colors.primary[700];

    return (
        <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
            <View style={styles.row}>
                <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
                    <Ionicons name={icon} size={20} color={tint} />
                </View>
                <Text style={[styles.rowLabel, isDanger && { color: tint }]}>{label}</Text>
                {!!value && <Text style={styles.rowValue}>{value}</Text>}
                {right ?? (!isDanger && <Ionicons name="chevron-forward" size={18} color={colors.secondary[300]} />)}
            </View>
            {!isLast && <View style={styles.rowDivider} />}
        </TouchableOpacity>
    );
}

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

// Material 3 style switch: outlined track with a small thumb when off, filled
// track with a bigger white thumb when on.
function Toggle({ value, onValueChange }: ToggleProps) {
    const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(progress, { toValue: value ? 1 : 0, duration: 150, useNativeDriver: true }).start();
    }, [progress, value]);

    const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 21] });
    const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 24 / 18] });

    return (
        <Pressable
            style={[styles.toggleTrack, value && styles.toggleTrackOn]}
            hitSlop={8}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            onPress={() => onValueChange(!value)}
        >
            <Animated.View
                style={[styles.toggleThumb, value && styles.toggleThumbOn, { transform: [{ translateX }, { scale }] }]}
            />
        </Pressable>
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

// Placeholder for the whole screen, laid out like the loaded content. The
// green header stays still; only the placeholder blocks pulse.
function ProfileSkeleton() {
    return (
        <View style={styles.scrollContent}>
            <View style={styles.hero}>
                <HeroBackground />
                <Pulse>
                    <View style={[styles.avatar, styles.skeletonOnHero]} />
                </Pulse>
                <View style={styles.userInfo}>
                    <Pulse>
                        <View style={[styles.skeletonOnHero, styles.skeletonName]} />
                    </Pulse>
                    <Pulse>
                        <View style={[styles.skeletonOnHero, styles.skeletonEditButton]} />
                    </Pulse>
                </View>
            </View>

            <Pulse>
                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        {[0, 1, 2].map((index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <View style={styles.statDivider} />}
                                <View style={styles.statItem}>
                                    <View style={[styles.skeletonBlock, styles.skeletonStatIcon]} />
                                    <View style={[styles.skeletonBlock, styles.skeletonStatValue]} />
                                    <View style={[styles.skeletonBlock, styles.skeletonStatLabel]} />
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                    <View style={[styles.bar, styles.skeletonBlock]} />
                </View>

                <View style={styles.card}>
                    <View style={styles.summaryHeader}>
                        <View style={[styles.iconBox, styles.skeletonBlock]} />
                        <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
                    </View>
                    <SummarySkeleton />
                </View>

                <View style={[styles.skeletonBlock, styles.skeletonSectionTitle]} />
                <View style={styles.group}>
                    {[0, 1, 2].map((index) => (
                        <View key={index}>
                            <View style={styles.row}>
                                <View style={[styles.iconBox, styles.skeletonBlock]} />
                                <View style={[styles.skeletonBlock, styles.skeletonRowLabel]} />
                            </View>
                            {index < 2 && <View style={styles.rowDivider} />}
                        </View>
                    ))}
                </View>
            </Pulse>
        </View>
    );
}

// Placeholder for the summary text and seal chips.
function SummarySkeleton() {
    return (
        <Pulse>
            <View style={styles.skeletonText}>
                <View style={[styles.skeletonBlock, styles.skeletonLine]} />
                <View style={[styles.skeletonBlock, styles.skeletonLine]} />
                <View style={[styles.skeletonBlock, styles.skeletonLineShort]} />
            </View>
            <View style={styles.chips}>
                {[96, 104, 88].map((width) => (
                    <View key={width} style={[styles.chip, { width }]} />
                ))}
            </View>
        </Pulse>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SCREEN_BG,
    },
    scrollContent: {
        paddingBottom: spacing["2xl"],
    },

    /* green header */
    hero: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        backgroundColor: colors.primary[700],
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg + HERO_OVERLAP,
    },
    heroOverscroll: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "100%",
        height: 600,
        backgroundColor: colors.primary[700],
    },
    avatar: {
        width: AVATAR_SIZE + AVATAR_BORDER * 2,
        height: AVATAR_SIZE + AVATAR_BORDER * 2,
        borderRadius: AVATAR_SIZE / 2 + AVATAR_BORDER,
        borderWidth: AVATAR_BORDER,
        borderColor: "#FFFFFF",
        overflow: "hidden",
        backgroundColor: AVATAR_BG,
    },
    userInfo: {
        flex: 1,
        alignItems: "flex-start",
        gap: spacing.sm,
    },
    username: {
        alignSelf: "stretch",
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: "#FFFFFF",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        height: 36,
        paddingHorizontal: spacing.lg,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
    },
    editButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
    },

    /* scan counters */
    statsCard: {
        marginTop: -HERO_OVERLAP,
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        paddingTop: 18,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        ...shadows.level2,
    },
    statsRow: {
        flexDirection: "row",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.secondary[100],
    },
    statIcon: {
        height: 26,
        justifyContent: "center",
    },
    statValue: {
        fontFamily: fontFamily.bold,
        fontSize: 36,
        lineHeight: 44,
        color: colors.secondary[700],
    },
    statLabel: {
        ...textStyles.small,
        color: colors.secondary[500],
    },
    bar: {
        flexDirection: "row",
        gap: spacing.xs,
        height: 8,
        borderRadius: 4,
        marginTop: spacing.lg,
    },
    barSegment: {
        borderRadius: 4,
    },
    barWithSeals: {
        backgroundColor: colors.secondary[700],
    },
    barNoSeals: {
        backgroundColor: colors.semantic.success,
    },
    barEmpty: {
        flex: 1,
        backgroundColor: colors.secondary[100],
    },

    /* cards and option groups */
    card: {
        marginTop: spacing.xl,
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        ...shadows.level1,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary[100],
    },
    iconBoxDanger: {
        backgroundColor: DANGER_BG,
    },

    /* scan summary */
    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    summaryTitle: {
        ...textStyles.h3,
        flex: 1,
        color: colors.secondary[700],
    },
    aiBadge: {
        height: 24,
        justifyContent: "center",
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: colors.primary[100],
    },
    aiBadgeText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 13,
        color: colors.primary[700],
    },
    summaryText: {
        fontFamily: fontFamily.regular,
        fontSize: 15,
        lineHeight: 22,
        color: colors.secondary[500],
        marginTop: spacing.md,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 10,
        rowGap: spacing.sm,
        marginTop: spacing.lg,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 32,
        paddingLeft: spacing.sm,
        paddingRight: spacing.md,
        borderRadius: 16,
        backgroundColor: CHIP_BG,
    },
    chipLabel: {
        fontFamily: fontFamily.medium,
        fontSize: 15,
        color: colors.secondary[700],
    },
    chipCount: {
        fontFamily: fontFamily.bold,
        fontSize: 15,
        color: colors.secondary[700],
    },

    /* option groups */
    sectionTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        marginHorizontal: 20,
    },
    group: {
        marginHorizontal: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: radius.xl,
        backgroundColor: "#FFFFFF",
        ...shadows.level1,
    },
    groupSpaced: {
        marginTop: spacing.lg,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        minHeight: 60,
    },
    rowLabel: {
        flex: 1,
        fontFamily: fontFamily.medium,
        fontSize: 17,
        lineHeight: 24,
        color: colors.secondary[700],
    },
    rowValue: {
        fontFamily: fontFamily.regular,
        fontSize: 15,
        color: colors.secondary[500],
    },
    // Starts under the label, not under the icon.
    rowDivider: {
        height: 1,
        marginLeft: 36 + spacing.md,
        backgroundColor: colors.secondary[100],
    },

    /* dark mode switch */
    toggleTrack: {
        width: 52,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.secondary[300],
        backgroundColor: colors.secondary[100],
    },
    toggleTrackOn: {
        borderColor: colors.primary[700],
        backgroundColor: colors.primary[700],
    },
    toggleThumb: {
        position: "absolute",
        left: 4,
        top: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.secondary[500],
    },
    toggleThumbOn: {
        backgroundColor: "#FFFFFF",
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
        backgroundColor: colors.semantic.error,
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
    skeletonOnHero: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    skeletonName: {
        width: 160,
        height: 24,
        borderRadius: 12,
        marginVertical: 4,
    },
    skeletonEditButton: {
        width: 120,
        height: 36,
        borderRadius: 18,
    },
    skeletonStatIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginVertical: 1,
    },
    // Same height as the real number (44px line), so the card doesn't jump when the numbers arrive.
    skeletonStatValue: {
        width: 48,
        height: 36,
        borderRadius: radius.md,
        marginVertical: 4,
    },
    skeletonStatLabel: {
        width: 72,
        height: 14,
        borderRadius: 7,
        marginVertical: 3,
    },
    skeletonTitle: {
        width: 140,
        height: 20,
        borderRadius: 10,
    },
    skeletonText: {
        gap: spacing.sm,
        marginTop: spacing.md + 4,
    },
    skeletonLine: {
        width: "100%",
        height: 14,
        borderRadius: 7,
    },
    skeletonLineShort: {
        width: "64%",
        height: 14,
        borderRadius: 7,
    },
    skeletonSectionTitle: {
        width: 90,
        height: 22,
        borderRadius: 11,
        marginTop: spacing.xl + 3,
        marginBottom: spacing.sm + 3,
        marginHorizontal: 20,
    },
    skeletonRowLabel: {
        width: 120,
        height: 16,
        borderRadius: 8,
    },
});
