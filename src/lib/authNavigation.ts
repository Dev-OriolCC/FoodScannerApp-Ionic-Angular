import { Alert } from "react-native";

// Screens no longer navigate after sign in: the root layout swaps the auth
// screens for the tabs as soon as Clerk reports a signed-in session. This only
// surfaces a session that still has a pending task (e.g. a forced password reset),
// which Clerk treats as signed out and this app has no screen for yet.
export function alertIfSessionTask({
    session,
}: {
    session: { currentTask?: { key: string } | null } | null;
}) {
    if (session?.currentTask) {
        Alert.alert(
            "Additional step required",
            `Your account needs to complete "${session.currentTask.key}" before you can continue.`
        );
    }
}
