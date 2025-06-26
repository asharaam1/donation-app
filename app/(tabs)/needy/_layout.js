// import { Stack } from 'expo-router';

// export default function NeedyLayout() {
//   return <Stack />;
// }
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import CustomHeader from '../../../components/CustomHeader';

export default function DonorLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000000",
          borderRadius: 25,
          marginBottom: 20,
          marginHorizontal: 20,
        },
        tabBarActiveTintColor: "#FF5F15",
        tabBarInactiveTintColor: "#666",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader head="Needy" userRole="/needy" profile="/profile" />,
          tabBarIcon: ({ size }) => (
            <Ionicons name="home-outline" size={size} color="#FF5F15" />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="fundraise"
        options={{
          title: 'fundraise',
          tabBarLabel: 'fundraise'
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'dashboard',
          tabBarLabel: 'dashboard'
        }}
      />
      <Tabs.Screen
        name="kycVerify"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      />
    </Tabs>

  )
}
