import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  const [requestData, setRequestData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "fundRequests", id));
        if (snap.exists()) {
          const data = snap.data();
          setRequestData(data);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              easing: Easing.out(Easing.exp),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
          ]).start();
        }
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleSendDonation = () => {
    if (!donationAmount) {
      alert("Please enter a donation amount.");
      return;
    }

    console.log("Donation Sent:", {
      amount: donationAmount,
      message: donationMessage,
    });

    setDonationAmount("");
    setDonationMessage("");
    alert("Thank you for your donation!");
  };

  if (!requestData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={styles.loaderText}>Loading Fund Details...</Text>
      </View>
    );
  }

  const {
    blogImg,
    title,
    description,
    amountRaised = 0,
    amountRequested = 0,
    status = "pending",
    createdAt,
    userId = "Unknown",
  } = requestData;

  const progress = amountRequested > 0 ? amountRaised / amountRequested : 0;
  const percentage = Math.round(progress * 100);
  const readableDate =
    typeof createdAt?.toDate === "function"
      ? createdAt.toDate().toLocaleDateString("en-GB")
      : String(createdAt) || "N/A";

  const statusColors = {
    pending: "#FF9800",
    active: "#2196F3",
    completed: "#4CAF50",
    cancelled: "#F44336",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: "Fund Detials", headerShown: true }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {blogImg ? (
            <Animated.Image source={{ uri: blogImg }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color="#ccc" />
            </View>
          )}

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{description}</Text>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={18} color="#ff4500" />
                <Text style={styles.metaText}> {readableDate}</Text>
              </View>

              <View style={styles.metaItem}>
                <Feather name="user" size={18} color="#ff4500" />
                <Text style={styles.metaText}> {userId}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusColors[status.toLowerCase()] + "20",
                  },
                ]}
              >
                <Feather
                  name="info"
                  size={16}
                  color={statusColors[status.toLowerCase()] || "#555"}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: statusColors[status.toLowerCase()] || "#555" },
                  ]}
                >
                  {" "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.raised}>
                ₹{amountRaised.toLocaleString("en-IN")} raised
              </Text>
              <Text style={styles.goal}>
                of ₹{amountRequested.toLocaleString("en-IN")} goal
              </Text>
            </View>

            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor:
                      percentage >= 100 ? statusColors.completed : "#ff4500",
                  },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{percentage}% Funded</Text>

            {/* Donation Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Make a Donation</Text>
              <Text style={styles.formSubtitle}>
                Your contribution can make a significant difference.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Donation Amount (Rs)"
                keyboardType="numeric"
                value={donationAmount}
                onChangeText={setDonationAmount}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Your Message (Optional)"
                multiline
                numberOfLines={4}
                value={donationMessage}
                onChangeText={setDonationMessage}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendDonation}
              >
                <Text style={styles.buttonText}>SEND DONATION →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    paddingTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  metaText: {
    fontSize: 14,
    color: "#555",
  },
  amountContainer: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  raised: {
    fontSize: 18,
    color: "#ff4500",
    fontWeight: "700",
  },
  goal: {
    fontSize: 15,
    color: "#666",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  percentage: {
    marginTop: 8,
    fontWeight: "600",
    color: "#333",
    fontSize: 15,
  },
  formContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#ff6600",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
