import { Stack } from "expo-router";

// One screen per onboarding step, so each step stays a small, focused file.
export default function OnboardingLayout() {
    return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}
