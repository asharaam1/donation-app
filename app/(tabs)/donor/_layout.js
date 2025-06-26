import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, View } from "react-native";
import { auth } from "../../../Firebase/config";
import CustomHeader from "../../../components/CustomHeader";

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
    });
};

const _layout = () => {
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
      {/* <Tabs.Screen
        name="index"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      /> */}
      {/* <Tabs.Screen
        name="signup"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
          tabBarLabel: "Sign Up",
        }}
      /> */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader head="Donor" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />

          ),
          tabBarLabel: "Donor",
        }}
      />
      <Tabs.Screen
        name="give"
        options={{
          headerShown: false,
          header: () => <CustomHeader head="Donor" userRole="/donor" profile="/profile"/>,
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 10 }}>
              <Ionicons name="add-circle-outline" size={40} color={color} />
            </View>
          ),
          tabBarLabel: "Give",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: true,
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
          headerRight: () => (
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#FF5F15"
              style={{ marginRight: 15 }}
              onPress={handleLogout}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="personalinfo"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="address"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="DonorHistory"
        options={{
          tabBarItem: { showIcon: false, showLabel: false },
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
