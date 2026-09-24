import { Tabs } from 'expo-router';
import { Icon, IconName } from '../../components/Icon';
import { colors, fontFamily } from '../../theme';

// Surface colors from the home-screen mock; the tab bar is a light green strip
// that sits on the same pale surface as the welcome screen.
const SURFACE_BG = '#FEF7FF';
const TAB_BAR_BG = colors.accentLight;
const TAB_INACTIVE = colors.secondary[500];

const tabIcon = (name: IconName) =>
    function TabBarIcon({ color }: { color: string }) {
        return <Icon name={name} size={28} color={color} />;
    };

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { fontFamily: fontFamily.medium, fontSize: 16, color: colors.secondary[700] },
                headerStyle: { backgroundColor: SURFACE_BG },
                headerShadowVisible: false,
                sceneStyle: { backgroundColor: SURFACE_BG },
                tabBarActiveTintColor: colors.secondary[700],
                tabBarInactiveTintColor: TAB_INACTIVE,
                tabBarLabelStyle: { fontFamily: fontFamily.medium, fontSize: 12 },
                tabBarStyle: { backgroundColor: TAB_BAR_BG, borderTopWidth: 0, elevation: 0 },
            }}
        >
            <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
            <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: tabIcon('history') }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('avatar') }} />
        </Tabs>
    );
}
