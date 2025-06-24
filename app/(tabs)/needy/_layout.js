// import { Stack } from 'expo-router';

// export default function NeedyLayout() {
//   return <Stack />;
// }
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import DonorHeader from '../../../components/CustomHeader';

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
          header: () => <DonorHeader head="Needy"/>,
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
        name="kycVerify"
        options={{
          title: 'kycVerify',
          tabBarLabel: 'kycVerify'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarLabel: 'profile'
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'dashboard',
          tabBarLabel: 'dashboard'
        }}
      />
    </Tabs>

  )
}
