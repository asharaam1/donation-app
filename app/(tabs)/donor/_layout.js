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
      console.log("Logout error:", error.message);
    });
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#000000",
          borderRadius: 25,
          marginBottom: 20,
          marginHorizontal: 20,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#FF5F15", // Orange when active
        tabBarInactiveTintColor: "#FFFFFF", // White when inactive
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
          header: () => <CustomHeader head="Donor"  />,
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
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
