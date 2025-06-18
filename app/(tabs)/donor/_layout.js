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
        name="give"
        options={{
          title: 'Give',
          tabBarLabel: 'Give'
        }}
      />
    </Tabs>

  )
}
