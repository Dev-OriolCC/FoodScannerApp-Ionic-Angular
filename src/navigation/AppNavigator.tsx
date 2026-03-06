import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import type { RootStackParamList } from './types'

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
            
        </Stack.Navigator>
    )
}