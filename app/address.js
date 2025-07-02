import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { auth, db } from "../Firebase/config";

export default function Address() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF5F15" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  let MapView;
  if (Platform.OS === "web") {
    MapView = require("react-native-maps").MapView;
  } else {
    MapView = require("react-native-maps").default;
  }

  if (!userData || (!userData.city && !userData.contact)) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Address Information</Text>
        <View style={styles.noDataContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF5F15" />
          <Text style={styles.noDataText}>No address information found</Text>
          <Text style={styles.noDataSubText}>
            Please complete your profile.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Address Information</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Ionicons name="location-outline" size={24} color="#FF5F15" />
            <Text style={styles.label}>City</Text>
          </View>
          <Text style={styles.value}>{userData?.city || "Not set"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Ionicons name="call-outline" size={24} color="#FF5F15" />
            <Text style={styles.label}>Phone</Text>
          </View>
          <Text style={styles.value}>{userData?.mobile || "Not set"}</Text>
        </View>
        {/* Registered Location Row - Always shown */}
        <View style={styles.row}>
          <View style={{ marginBottom: 0, flex: 1 }}>
            <View style={styles.labelContainer}>
              <Ionicons name="location-outline" size={24} color="#FF5F15" />
              <Text style={styles.label}>Registered Location</Text>
            </View>
            {(userData.latitude && userData.longitude) ? (
              <MapView
                style={{
                  width: Dimensions.get('screen').width * 0.79,
                  height: Dimensions.get('screen').width * 0.83,
                  borderRadius: 20,
                  marginTop: 20,
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                  latitude: userData.latitude,
                  longitude: userData.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: userData.latitude,
                    longitude: userData.longitude,
                  }}
                  title="User Location"
                  description="This user is here"
                />
              </MapView>
            ) : (
              <Text style={{ color: '#999', marginTop: 20, fontStyle: 'italic' }}>
                No registered location available
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FF5F15",
  },
  card: {
    width: "90%",
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#FF5F15",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    width: "90%",
    elevation: 2,
  },
  noDataText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5F15",
  },
  noDataSubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 6,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF5F15",
  },
});
