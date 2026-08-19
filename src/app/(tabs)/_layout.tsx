import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider';

export default function TabLayout() {
    const { session } = useAuth();
    const user = session?.user;

    console.log(`Session: `,session);
    console.log(`User: `, user);
    if (!user) return <Redirect href="/(auth)/login" />;

    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ title: 'Home' }} />
            <Tabs.Screen name="history" options={{ title: 'History' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
    );
}