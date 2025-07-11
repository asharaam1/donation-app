import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import { auth } from '../../../Firebase/config';
import CustomHeader from '../../../components/CustomHeader';


export default function NeedyLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 25,
          marginBottom: 20,
          marginHorizontal: 20,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#FF5F15",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader head="Needy" userRole="/needy" profile="/profile" />,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="fundraise"
        options={{
          headerShown: true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: "Raise Fund",
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: true,
          title: "dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
          tabBarLabel: "Dashboard",
        }}
      />
    </Tabs>
  )
}
