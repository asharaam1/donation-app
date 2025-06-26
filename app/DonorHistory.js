import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Stack } from "expo-router";

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "donations"),
          where("donorId", "==", user.uid)
        );

        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const donationList = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt
                  ? new Date(data.createdAt)
                  : new Date(),
              };
            });

            setDonations(donationList);
            const sum = donationList.reduce((acc, curr) => acc + curr.amount, 0);
            setTotal(sum);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching donations:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={styles.loaderText}>Loading your donations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "My Donations", headerShown: true }} />

      <View style={styles.header}>
        <Text style={styles.title}>Total Donated</Text>
        <Text style={styles.amount}>₹{total.toLocaleString("en-IN")}</Text>
      </View>

      <Text style={styles.subTitle}>Donation History</Text>

      {donations.length === 0 ? (
        <Text style={styles.emptyText}>No donations made yet.</Text>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>To: {item.needyName}</Text>
              <Text style={styles.cardAmount}>₹{item.amount.toLocaleString("en-IN")}</Text>
              {item.message ? (
                <Text style={styles.cardMessage}>"{item.message}"</Text>
              ) : null}
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString("en-GB")} at{" "}
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

export default DonationsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 8,
    color: "#ff4500",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    color: "#444",
    marginBottom: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4500",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#ff4500",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginVertical: 6,
  },
  cardMessage: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
  },
});
