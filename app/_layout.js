// app/_layout.js
import { Redirect, Stack } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { db } from "../Firebase/config";

if (typeof setImmediate === "undefined") {
  global.setImmediate = setTimeout;
}

function RootLayoutContent() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!loading) {
        if (user) {
          try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUserRole(userSnap.data().role);
            } else {
              console.warn("User document not found!");
              setUserRole(null); // Force redirect to login if user doc is missing
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null); // Force redirect to login on error
          } finally {
            setRoleLoading(false);
          }
        } else {
          setRoleLoading(false);
        }
      }
    };

    fetchUserRole();
  }, [user, loading]);

  if (loading || roleLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#FF5F15" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="(auth)" />
      ) : userRole === "donor" ? (
        <Redirect href="/(tabs)/donor" />
      ) : userRole === "needy" ? (
        <Redirect href="/(tabs)/needy" />
      ) : (
        <Redirect href="/(auth)/login" /> // Fallback if role is not set or invalid
      )}

      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="signup" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="donor" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="profile" options={{ headerShown: false }} /> */}
      

      
      <Stack.Screen
        name="personalinfo"
        options={{ headerShown: true, title: "Personal Info" }}
      />
      <Stack.Screen
        name="address"
        options={{ headerShown: true, title: "Address" }}
      />
      <Stack.Screen
        name="DonorHistory"
        options={{ headerShown: true, title: "My Donations" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
