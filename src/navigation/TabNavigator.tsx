import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import type { TabParamList } from "./types";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { HistoryScreen } from "../screens/HistoryScreen";

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.black,
                tabBarInactiveTintColor: Colors.blackTab,
                tabBarStyle: {
                    backgroundColor: Colors.tabBarBg,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    paddingTop: 8,
                    height: 70,
                    borderTopWidth: 0,
                    elevation: 0,
                    marginBottom: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    paddingBottom: 8,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: "History",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}