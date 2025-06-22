// import { Stack } from 'expo-router';

// export default function NeedyLayout() {
//   return <Stack />;
// }
import { Tabs } from 'expo-router';

export default function DonorLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          tabBarLabel: 'index'
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
    </Tabs>

  )
}
