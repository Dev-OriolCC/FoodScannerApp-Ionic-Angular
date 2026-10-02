import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_SEEN_KEY } from "../constants/onboarding";
import { colors, fontFamily, radius, shadows, spacing, textStyles } from "../theme";

// Same surface as the welcome screen, so the hand-off to it feels seamless.
const SURFACE_BG = "#FEF7FF";

const ILLUSTRATION_SIZE = 240;
const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 24;

type Slide = {
    key: string;
    title: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    // TODO: replace the icon placeholder with an illustration,
    // e.g. require("../../assets/images/onboarding-scan.png").
    image: null;
};

const SLIDES: Slide[] = [
    {
        key: "scan",
        title: "Scan a product",
        description: "Point your camera at the barcode on any packaged food. Sellómetro reads it in seconds.",
        icon: "barcode-outline",
        image: null,
    },
    {
        key: "results",
        title: "Get the results",
        description: "See which Mexican NOM-051 warning labels apply, such as excess sugars, saturated fat, calories or sodium.",
        icon: "alert-circle-outline",
        image: null,
    },
    {
        key: "history",
        title: "Keep track with History",
        description: "Every product you scan is saved, so you can check it again or mark it as a favorite.",
        icon: "time-outline",
        image: null,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { width } = useWindowDimensions();

    const listRef = useRef<FlatList<Slide>>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [index, setIndex] = useState(0);

    const isFirst = index === 0;
    const isLast = index === SLIDES.length - 1;

    const goTo = (nextIndex: number) => {
        listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setIndex(nextIndex);
    };

    // Keeps the buttons in sync when the user swipes instead of tapping.
    const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    };

    // Opened from Profile (testing) -> go back there.
    // First launch -> continue to the welcome screen.
    const finish = async () => {
        await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");

        if (isSignedIn) {
            router.back();
        } else {
            router.replace("/(auth)/welcome");
        }
    };

    const handleNext = () => (isLast ? finish() : goTo(index + 1));
    const handleBack = () => goTo(index - 1);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={finish} hitSlop={12} disabled={isLast} style={isLast && styles.hidden}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* The scroll event drives the slide and dot animations. Dot width is a
                layout prop, which the native driver can't animate, so it runs on JS. */}
            <Animated.FlatList
                ref={listRef}
                data={SLIDES}
                keyExtractor={(item) => item.key}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMomentumEnd}
                renderItem={({ item, index: itemIndex }) => (
                    <SlideView slide={item} index={itemIndex} width={width} scrollX={scrollX} />
                )}
            />

            <View style={styles.footer}>
                <View style={styles.dots}>
                    {SLIDES.map((slide, dotIndex) => {
                        const inputRange = [(dotIndex - 1) * width, dotIndex * width, (dotIndex + 1) * width];

                        return (
                            <Animated.View
                                key={slide.key}
                                style={[
                                    styles.dot,
                                    {
                                        width: scrollX.interpolate({
                                            inputRange,
                                            outputRange: [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE],
                                            extrapolate: "clamp",
                                        }),
                                        backgroundColor: scrollX.interpolate({
                                            inputRange,
                                            outputRange: [colors.primary[300], colors.primary[700], colors.primary[300]],
                                            extrapolate: "clamp",
                                        }),
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                <View style={styles.buttonRow}>
                    {/* Hidden (not removed) on the first step so Next keeps its size. */}
                    <TouchableOpacity
                        style={[styles.button, styles.backButton, isFirst && styles.hidden]}
                        activeOpacity={0.85}
                        disabled={isFirst}
                        onPress={handleBack}
                    >
                        <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleNext}>
                        <Text style={styles.buttonText}>{isLast ? "Get started" : "Next"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

interface SlideViewProps {
    slide: Slide;
    index: number;
    width: number;
    scrollX: Animated.Value;
}

// One onboarding step. It scales and fades in as it reaches the center, and the
// text moves a little slower than the page for a light parallax effect.
function SlideView({ slide, index, width, scrollX }: SlideViewProps) {
    const float = useRef(new Animated.Value(0)).current;

    // Gentle up-and-down loop on the illustration.
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(float, { toValue: -6, duration: 1400, useNativeDriver: true }),
                Animated.timing(float, { toValue: 6, duration: 1400, useNativeDriver: true }),
            ]),
        );

        animation.start();

        return () => animation.stop();
    }, [float]);

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1, 0.8], extrapolate: "clamp" });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: "clamp" });
    const textShift = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.3, 0, -width * 0.3],
        extrapolate: "clamp",
    });

    return (
        <View style={[styles.slide, { width }]}>
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <Animated.View style={[styles.illustration, { transform: [{ translateY: float }] }]}>
                    <Ionicons name={slide.icon} size={112} color={colors.primary[700]} />
                </Animated.View>
            </Animated.View>

            <Animated.View style={[styles.textBlock, { opacity, transform: [{ translateX: textShift }] }]}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: SURFACE_BG,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.sm,
        minHeight: 40,
    },
    skipText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.primary[700],
    },
    hidden: {
        opacity: 0,
    },

    /* slide */
    slide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },
    illustration: {
        width: ILLUSTRATION_SIZE,
        height: ILLUSTRATION_SIZE,
        borderRadius: radius.xl,
        backgroundColor: colors.primary[100],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing["3xl"],
        ...shadows.level1,
    },
    textBlock: {
        alignItems: "center",
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        lineHeight: 32,
        color: colors.secondary[700],
        textAlign: "center",
        marginBottom: spacing.md,
    },
    description: {
        ...textStyles.body,
        color: colors.secondary[500],
        textAlign: "center",
    },

    /* footer */
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing["2xl"],
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    dot: {
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
    },
    buttonRow: {
        flexDirection: "row",
        gap: spacing.md,
    },
    button: {
        flex: 1,
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        color: "#FFFFFF",
    },
    backButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary[700],
    },
    backButtonText: {
        color: colors.primary[700],
    },
});
