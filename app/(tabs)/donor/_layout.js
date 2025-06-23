import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, View } from "react-native";
import DonorHeader from "../../../components/CustomHeader";
import { auth } from "../../../Firebase/config";

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      // Handle error if needed
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
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
          tabBarLabel: "Sign Up",
        }}
      />
      <Tabs.Screen
        name="donor"
        options={{
          headerShown: true,
          header: () => <DonorHeader />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          tabBarLabel: "Donor",
        }}
      />
      <Tabs.Screen
        name="Give"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 10 }}>
              <Ionicons name="add-circle-outline" size={40} color={color} />
            </View>
          ),
          tabBarLabel: "Give",
        }}
      />
      <Tabs.Screen
        name="profile"
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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: "Info",
        }}
      />
      <Tabs.Screen
        name="address"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
          tabBarLabel: "Address",
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
