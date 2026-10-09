import React, { useState } from "react";
import { LayoutChangeEvent, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_SEEN_KEY } from "../../constants/onboarding";
import { colors, fontFamily, spacing, textStyles } from "../../theme";
import { HERO_BOTTOM, HeroGradient, HeroLines } from "./HeroBackground";
import { ILLUSTRATION_HEIGHT, ILLUSTRATION_WIDTH, ONBOARDING_STEPS } from "./constants";

const SHEET_RADIUS = 28;
const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 28;

interface OnboardingStepProps {
    step: number;
    title: string;
    description: string;
    illustration: React.ReactNode;
    // Height of the illustration's drawing box, for artwork taller than the default.
    illustrationHeight?: number;
    // Background lines behind the illustration. Defaults to step 1's layout.
    heroLines?: React.ReactNode;
    // Next step's route. Left out on the last step, where the button finishes.
    nextHref?: Href;
    // Shows a Back button next to Next.
    showBack?: boolean;
}

// Shared layout for the three onboarding screens: mint hero with the step's
// illustration on top, white sheet with the copy, dots and button below.
export function OnboardingStep({
    step,
    title,
    description,
    illustration,
    illustrationHeight = ILLUSTRATION_HEIGHT,
    heroLines = <HeroLines />,
    nextHref,
    showBack = false,
}: OnboardingStepProps) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const insets = useSafeAreaInsets();
    const [scale, setScale] = useState(1);

    const isLast = !nextHref;

    // Opened from Profile (testing) -> go back there.
    // First launch -> continue to the welcome screen.
    const finish = async () => {
        await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");

        if (isSignedIn) {
            router.dismissTo("/(tabs)/profile");
        } else {
            router.replace("/(auth)/welcome");
        }
    };

    const handleNext = () => (nextHref ? router.push(nextHref) : finish());

    // Shrinks the illustration on short screens so it never gets clipped.
    const handleIllustrationLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setScale(Math.min(1, width / ILLUSTRATION_WIDTH, height / illustrationHeight));
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.hero}>
                <HeroGradient />

                <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                    <Text style={styles.brand}>Sellómetro</Text>

                    {!isLast && (
                        <TouchableOpacity style={styles.skipButton} activeOpacity={0.85} hitSlop={8} onPress={finish}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.illustrationSlot} onLayout={handleIllustrationLayout}>
                    <View style={[styles.illustrationBox, { height: illustrationHeight, transform: [{ scale }] }]}>
                        {heroLines}
                        {illustration}
                    </View>
                </View>
            </View>

            <View style={[styles.sheet, { paddingBottom: insets.bottom + 28 }]}>
                <Text style={styles.stepLabel}>
                    STEP {step} OF {ONBOARDING_STEPS}
                </Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.dots}>
                    {Array.from({ length: ONBOARDING_STEPS }, (_, index) => (
                        <View key={index} style={[styles.dot, index + 1 === step && styles.activeDot]} />
                    ))}
                </View>

                <View style={styles.buttons}>
                    {showBack && (
                        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => router.back()}>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.nextButton} activeOpacity={0.85} onPress={handleNext}>
                        <Text style={styles.nextText}>{isLast ? "Get started" : "Next"}</Text>
                        {!isLast && <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // Shows behind the sheet's rounded corners.
        backgroundColor: HERO_BOTTOM,
    },

    /* hero */
    hero: {
        flex: 1,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        zIndex: 1,
    },
    brand: {
        fontFamily: fontFamily.display,
        fontSize: 20,
        color: colors.secondary[700],
    },
    skipButton: {
        height: 43,
        paddingHorizontal: 20,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.secondary[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    skipText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: colors.primary[700],
    },
    illustrationSlot: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    illustrationBox: {
        width: ILLUSTRATION_WIDTH,
    },

    /* sheet */
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: SHEET_RADIUS,
        borderTopRightRadius: SHEET_RADIUS,
        paddingHorizontal: spacing.xl,
        paddingTop: 30,
    },
    stepLabel: {
        fontFamily: fontFamily.bold,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 1.8,
        color: colors.primary[700],
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 31,
        lineHeight: 36,
        color: colors.secondary[700],
        marginTop: 10,
        // Room for two lines, so the dots and buttons sit at the same height on every step.
        minHeight: 72,
    },
    description: {
        ...textStyles.body,
        color: colors.secondary[500],
        marginTop: 14,
    },
    dots: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 50,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: colors.primary[300],
    },
    activeDot: {
        width: ACTIVE_DOT_WIDTH,
        backgroundColor: colors.primary[700],
    },
    buttons: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: 20,
    },
    backButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.primary[700],
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    backText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 17,
        color: colors.primary[700],
    },
    nextButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary[700],
        shadowColor: colors.primary[700],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    nextText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 17,
        color: "#FFFFFF",
    },
});
