import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../Firebase/config";

export default function PersonalInfo() {
  const [userData, setUserData] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setNoData(false);
        } else {
          setUserData(null);
          setNoData(true);
        }
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#fff0e0", "#ffe0cc", "#FF5F15"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrapper}>
          {userData?.profileImageUrl ? (
            <Image
              source={{ uri: userData.profileImageUrl }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: "#eee",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons name="person" size={60} color="#FF5F15" />
            </View>
          )}
        </View>

        {noData && (
          <View style={styles.noDataWrapper}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF5F15" />
            <Text style={styles.noDataText}>No data found</Text>
            <Text style={styles.noDataSubText}>
              Please complete your profile information.
            </Text>
          </View>
        )}

        {userData && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="at-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Username</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>@{userData.fullName}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="person-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Name</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{userData.fullName}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FF5F15" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="call-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Phone</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{userData.contact}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FF5F15" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Birthday</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{userData.birthday}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FF5F15" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="location-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Country</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{userData.country}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FF5F15" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LOGIN INFORMATION</Text>
              <TouchableOpacity style={styles.row}>
                <View style={styles.labelContainer}>
                  <Ionicons name="mail-outline" size={20} color="#FF5F15" />
                  <Text style={styles.label}>Email</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{userData.email}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FF5F15" />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#FF5F15",
  },
  section: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#FF5F15",
    fontWeight: "bold",
    marginLeft: 18,
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
    marginLeft: 10,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "bold",
    marginRight: 6,
  },
  noDataWrapper: {
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#FF5F15",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
