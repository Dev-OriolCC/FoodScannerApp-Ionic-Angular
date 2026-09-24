import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { appFonts } from '../theme/fonts';
import '../../global.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file');
}

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
    const [fontsLoaded] = useFonts(appFonts);
    const { isLoaded, isSignedIn } = useAuth();

    // Keep the splash up until Clerk has restored the saved session, so a
    // signed-in user never flashes the auth screens on launch.
    const isReady = fontsLoaded && isLoaded;

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    if (!isReady) {
        return null;
    }

    // Protected screens are removed from the navigator while their guard is
    // false, so a signed-in user cannot go back to the auth screens (and a
    // signed-out user cannot open the tabs).
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Protected guard={!!isSignedIn}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <RootNavigator />
        </ClerkProvider>
    );
}
