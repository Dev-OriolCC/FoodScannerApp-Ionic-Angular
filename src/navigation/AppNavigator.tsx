import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import type { RootStackParamList } from './types'
import { FormBarcodeScreen } from '../screens/FormBarcodeScreen'
import { ResultScreen } from '../screens/ResultScreen'
import { LoginScreen } from '../screens/auth/LoginScreen'
import AuthProvider, { useAuth } from '../provider/AuthProvider'
import { ActivityIndicator, View } from 'react-native'

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
    const { session, loading } = useAuth();


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {session ? (
                <>
                    {/* Authenticated screens */}
                    <Stack.Screen
                        name="MainTabs"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="FormBarcodeScreen"
                        component={FormBarcodeScreen}
                        options={{
                            presentation: "modal",
                            title: "Enter Information"
                        }}
                    />
                    <Stack.Screen
                        name="ResultScreen"
                        component={ResultScreen}
                        options={{ headerShown: false }}
                    />
                </>
            ) : (
                <>
                    {/*  Auth Screens (unauthenticated) */}
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    )
}

export function AppNavigator() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    )
}