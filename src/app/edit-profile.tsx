import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBlobatar } from "@blobatar/react-native/animated";
import { surprised } from "blobatar/expression";
import { parseClerkError } from "../lib/clerkErrors";
import { colors, fontFamily, radius, spacing, textStyles } from "../theme";

// Same surface and panel colors as the tabs and auth screens.
const SURFACE_BG = "#FEF7FF";
const PANEL_BG = "#D9E7CB";

const AVATAR_SIZE = 88;
const MAX_NAME_LENGTH = 50;

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

// e.g. "September 24, 2026"; a dash when Clerk has no date yet.
function formatDate(date: Date | null | undefined) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

// Social accounts report a provider like "google"; otherwise the user signed up with email.
function getSignInMethod(user: ClerkUser) {
    const provider = user.externalAccounts[0]?.provider;

    if (!provider) {
        return "Email & password";
    }

    return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function validateName(value: string) {
    if (value.trim().length > MAX_NAME_LENGTH) {
        return `Must be ${MAX_NAME_LENGTH} characters or less.`;
    }

    return "";
}

export default function EditProfileScreen() {
    const { user, isLoaded } = useUser();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Edit Profile",
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontFamily: fontFamily.medium, fontSize: 16, color: colors.secondary[700] },
                    headerTintColor: colors.secondary[700],
                    headerStyle: { backgroundColor: SURFACE_BG },
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: SURFACE_BG },
                }}
            />

            {/* the form mounts once Clerk has the user, so its fields start with real values */}
            {isLoaded && user ? (
                <EditProfileForm user={user} />
            ) : (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={colors.primary[700]} />
                </View>
            )}
        </View>
    );
}

function EditProfileForm({ user }: { user: ClerkUser }) {
    const router = useRouter();

    const [firstName, setFirstName] = useState(user.firstName ?? "");
    const [lastName, setLastName] = useState(user.lastName ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const email = user.primaryEmailAddress?.emailAddress ?? "";

    const firstNameError = validateName(firstName);
    const lastNameError = validateName(lastName);

    const hasChanges =
        firstName.trim() !== (user.firstName ?? "") || lastName.trim() !== (user.lastName ?? "");
    const canSave = hasChanges && !firstNameError && !lastNameError && !isSaving;

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError("");

        try {
            await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
            router.back();
        } catch (error) {
            setSaveError(parseClerkError(error).message);
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarWrap}>
                    <View style={styles.avatar}>
                        <AnimatedBlobatar
                            name={email || "guest"}
                            size={AVATAR_SIZE}
                            traits={{ shape: 0.933 }}
                            expression={surprised}
                            animate
                        />
                    </View>
                </View>

                {/* editable fields */}
                <Text style={styles.sectionTitle}>Personal info</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>First name</Text>
                    <View style={[styles.inputBox, firstNameError ? styles.inputBoxError : null]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your first name"
                            placeholderTextColor={colors.secondary[500]}
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>
                    {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

                    <Text style={[styles.label, styles.fieldSpacing]}>Last name</Text>
                    <View style={[styles.inputBox, lastNameError ? styles.inputBoxError : null]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your last name"
                            placeholderTextColor={colors.secondary[500]}
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>
                    {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                </View>

                {/* read-only account info from Clerk */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <ReadOnlyField label="Email" value={email} />
                    <Text style={styles.helperText}>Email changes are not available yet.</Text>

                    <ReadOnlyField label="Joined" value={formatDate(user.createdAt)} style={styles.fieldSpacing} />
                    <ReadOnlyField label="Sign-in method" value={getSignInMethod(user)} style={styles.fieldSpacing} />
                    <ReadOnlyField label="Last sign-in" value={formatDate(user.lastSignInAt)} style={styles.fieldSpacing} />
                </View>

                {!!saveError && <Text style={styles.saveError}>{saveError}</Text>}

                <TouchableOpacity
                    style={[styles.saveButton, !canSave && styles.buttonDisabled]}
                    activeOpacity={0.85}
                    disabled={!canSave}
                    onPress={handleSave}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

interface ReadOnlyFieldProps {
    label: string;
    value: string;
    style?: object;
}

// Looks like an input but greyed out with a lock, so it reads as "not editable".
function ReadOnlyField({ label, value, style }: ReadOnlyFieldProps) {
    return (
        <View style={style}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputBox, styles.inputBoxReadOnly]}>
                <Text style={[styles.input, styles.inputReadOnly]} numberOfLines={1}>
                    {value}
                </Text>
                <Ionicons name="lock-closed-outline" size={18} color={colors.secondary[500]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing["2xl"],
    },

    /* avatar */
    avatarWrap: {
        alignItems: "center",
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: "hidden",
        backgroundColor: PANEL_BG,
    },

    /* sections (same title style as "General" in profile.tsx) */
    sectionTitle: {
        ...textStyles.h3,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    card: {
        backgroundColor: PANEL_BG,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },

    /* fields (same look as the inputs in login.tsx) */
    label: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        color: colors.secondary[700],
        marginBottom: spacing.sm,
    },
    fieldSpacing: {
        marginTop: spacing.lg,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderBottomWidth: 2,
        borderBottomColor: colors.secondary[300],
        paddingHorizontal: spacing.md,
        height: 52,
    },
    inputBoxError: {
        borderBottomColor: colors.semantic.error,
    },
    inputBoxReadOnly: {
        backgroundColor: colors.secondary[100],
    },
    input: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.secondary[700],
    },
    inputReadOnly: {
        color: colors.secondary[500],
    },
    errorText: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        color: colors.semantic.error,
        marginTop: spacing.xs,
    },
    helperText: {
        ...textStyles.tiny,
        color: colors.secondary[500],
        marginTop: spacing.xs,
    },

    /* save */
    saveError: {
        ...textStyles.small,
        color: colors.semantic.error,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    saveButton: {
        backgroundColor: colors.primary[700],
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        backgroundColor: colors.secondary[500],
    },
    saveButtonText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        color: "#FFFFFF",
    },
});
