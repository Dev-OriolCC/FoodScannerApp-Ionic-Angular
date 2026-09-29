import { useEffect } from "react";
import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScanStore } from "../store/useScanStore";

// Keeps the scan history in sync with the signed-in Clerk user:
// sign in loads their history, sign out (or switching accounts) clears it.
export function useScanHistorySync() {
    const { userId } = useAuth();
    const loadHistory = useScanStore((state) => state.loadHistory);
    const reset = useScanStore((state) => state.reset);

    useEffect(() => {
        reset();

        if (userId) {
            loadHistory(userId);
        }
    }, [userId, loadHistory, reset]);

    // History used to be saved on the device for everyone under this key.
    // It now lives in Supabase per user, so the old local copy is removed.
    useEffect(() => {
        AsyncStorage.removeItem("scan-history");
    }, []);
}
