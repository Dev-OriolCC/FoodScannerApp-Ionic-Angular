import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import type { RootStackParamList } from './types'
import { FormBarcodeScreen } from '../screens/FormBarcodeScreen'
import { ResultScreen } from '../screens/ResultScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
    return (
        <Stack.Navigator>
            {/* Main app with tabs */}
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            {/* Modal/Detail screens outside tabs */}
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

        </Stack.Navigator>
    )
}