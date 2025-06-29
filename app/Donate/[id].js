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
  Image,
} from "react-native";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/config";
import { useLocalSearchParams, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  const requestId = Array.isArray(id) ? id[0] : id;

  const [requestData, setRequestData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [donorId, setDonorId] = useState();
  const [donorName, setDonorName] = useState("Anonymous");
  const [needyName, setNeedyName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setDonorId(uid);
        try {
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setDonorName(data.fullName || "Anonymous");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!requestId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, "fundRequests", requestId));

        if (snap.exists()) {
          const data = snap.data();
          setRequestData(data);

          if (data.userId) {
            try {
              const needyRef = doc(db, "users", data.userId);
              const needySnap = await getDoc(needyRef);
              setNeedyName(
                needySnap.exists()
                  ? needySnap.data().fullName || "Unknown User"
                  : "Unknown User"
              );
            } catch (err) {
              console.error("Error fetching needy data:", err);
              setNeedyName("Unknown User");
            }
          }

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
        } else {
          console.warn("No document found for ID:", requestId);
        }
      } catch (err) {
        console.error("Error fetching fund data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  const handleDonation = async () => {
    if (!donationAmount || isNaN(parseFloat(donationAmount))) {
      alert("Please enter a valid donation amount.");
      return;
    }

    const donationAmt = parseFloat(donationAmount);

    try {
      await addDoc(collection(db, "donations"), {
        donorId,
        donorName,
        needyid: requestData.userId,      // ✅ Needy user's UID
        needyName,
        fundRequestId: requestId,         // ✅ Fund request's ID
        amount: donationAmt,
        message: donationMessage,
        createdAt: Date.now(),
      });

      const requestRef = doc(db, "fundRequests", requestId);
      const snap = await getDoc(requestRef);
      if (snap.exists()) {
        const currentRaised = snap.data().amountRaised || 0;
        await updateDoc(requestRef, {
          amountRaised: currentRaised + donationAmt,
        });

        setRequestData((prev) => ({
          ...prev,
          amountRaised: currentRaised + donationAmt,
        }));
      }

      setDonationAmount("");
      setDonationMessage("");
      alert("Donation sent successfully!");
    } catch (e) {
      console.error("Error sending donation:", e);
      alert("Failed to send donation. Please try again.");
    }
  };

  if (isLoading || !requestData) {
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
    createdAt,
  } = requestData;

  const progress = amountRequested > 0 ? amountRaised / amountRequested : 0;
  const percentage = Math.min(Math.round(progress * 100), 100);
  const readableDate = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString("en-GB")
    : "N/A";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          >
            <View style={styles.imageContainer}>
              {blogImg ? (
                <Image source={{ uri: blogImg }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
              <TouchableOpacity
                onPress={() => router.back('/donor/give')}
                style={styles.backIcon}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.divider} />
              <Text style={styles.description}>{description}</Text>

              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={18} color="#ff4500" />
                  <Text style={styles.metaText}> {readableDate}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={18} color="#ff4500" />
                  <Text style={styles.metaText}> {needyName}</Text>
                </View>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.raised}>
                  Rs.{amountRaised.toLocaleString("en-IN")} raised
                </Text>
                <Text style={styles.goal}>
                  of Rs.{amountRequested.toLocaleString("en-IN")} goal
                </Text>
              </View>

              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor:
                        percentage >= 100 ? "#4CAF50" : "#ff4500",
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentage}>{percentage}% Funded</Text>

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
                  returnKeyType="done"
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Your Message (Optional)"
                  multiline
                  numberOfLines={4}
                  value={donationMessage}
                  onChangeText={setDonationMessage}
                  returnKeyType="done"
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleDonation}
                >
                  <Text style={styles.buttonText}>SEND DONATION →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    marginTop: 15,
    color: "#ff6b35",
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    backgroundColor: "#f0f2f5",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  content: {
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 15,
    color: "#1e293b",
    lineHeight: 34,
  },
  divider: {
    height: 1.5,
    backgroundColor: "#e2e8f0",
    marginBottom: 20,
    borderRadius: 2,
  },
  description: {
    fontSize: 16.5,
    color: "#475569",
    marginBottom: 25,
    lineHeight: 26,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 25,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14.5,
    color: "#4b5563",
    fontWeight: "500",
    marginLeft: 6,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 15,
  },
  raised: {
    fontSize: 20,
    color: "#ff6b35",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  goal: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
  },
  percentage: {
    marginTop: 12,
    fontWeight: "700",
    color: "#334155",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  formContainer: {
    marginTop: 30,
    paddingTop: 25,
    borderTopWidth: 1.5,
    borderTopColor: "#e2e8f0",
    borderRadius: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    color: "#1e293b",
  },
  formSubtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 22,
    lineHeight: 22,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#ff6b35",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
