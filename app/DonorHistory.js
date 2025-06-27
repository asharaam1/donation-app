import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ornageimg from "../assets/images/abstract-red-and-orange-watercolor-texture-background.jpg";

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
            const sum = donationList.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
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
      <ImageBackground
        source={ornageimg}
        style={styles.loader}
        imageStyle={{ opacity: 0.1 }}
      >
        <LinearGradient
          colors={["#ffffff", "#fff4e6", "#ffedd5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#ff6b00" />
        <Text style={styles.loaderText}>Loading your donations...</Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={ornageimg}
      imageStyle={{ opacity: 0.08 }}
    >
      <LinearGradient
        colors={["#ffffff", "#fff4e6", "#ffedd5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.container}>
        <Stack.Screen options={{ title: "My Donations", headerShown: true }} />

        <View style={styles.header}>
          <LinearGradient
            colors={["#ffd6a5", "#ffb085", "#ff9248"]}
            style={styles.totalContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.totalInnerPattern}>
              <Text style={styles.title}>Total Donated</Text>
              <Text style={styles.amount}>₹{total.toLocaleString("en-IN")}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.subTitle}>Donation History</Text>
          <View style={styles.orangeLine} />
        </View>

        {donations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={["#ffffff", "#fff4e6"]}
              style={styles.emptyCard}
            >
              <Text style={styles.emptyText}>No donations made yet.</Text>
            </LinearGradient>
          </View>
        ) : (
          <FlatList
            data={donations}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <LinearGradient
                  colors={["#ffffff", "#fff7f2"]}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>To: {item.needyName}</Text>
                    <View style={styles.amountPill}>
                      <Text style={styles.cardAmount}>
                        ₹{item.amount.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>
                  {item.message ? (
                    <Text style={styles.cardMessage}>"{item.message}"</Text>
                  ) : null}
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardDate}>
                      {new Date(item.createdAt).toLocaleDateString("en-GB")} at{" "}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <View style={styles.orangeDot} />
                  </View>
                </LinearGradient>
                <View style={styles.cardShadow} />
              </View>
            )}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default DonationsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 8,
    color: "#ff6b00",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#ff6b00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  totalContainer: {
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  totalInnerPattern: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  amount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff6b00",
    marginBottom: 8,
  },
  orangeLine: {
    height: 3,
    width: 60,
    backgroundColor: "#ff6b00",
    borderRadius: 3,
  },
  emptyContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#ff6b00",
    fontSize: 16,
    fontWeight: "500",
  },
  cardContainer: {
    marginBottom: 20,
    position: "relative",
  },
  cardShadow: {
    position: "absolute",
    backgroundColor: "#ff6b00",
    borderRadius: 16,
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    zIndex: -1,
    opacity: 0.1,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,107,0,0.1)",
    backgroundColor: "white",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  amountPill: {
    backgroundColor: "rgba(255,107,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,107,0,0.2)",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  cardMessage: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff6b00",
  },
});
