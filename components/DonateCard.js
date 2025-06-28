import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProgressBar from "react-native-progress/Bar";

const EmergencyCard = ({
  img,
  amountraise,
  requestedamm,
  title,
  status,
  createat,
  id,
  description,
}) => {
  const progress = requestedamm > 0 ? amountraise / requestedamm : 0;
  const readableDate =
    createat?.toDate?.().toLocaleDateString("en-GB") || "Unknown";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`Donate/${id}`)}
    >
      <Image source={{ uri: img }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      <View style={styles.progressContainer}>
        <Text style={styles.raisedText}>Raised: Rs {amountraise}</Text>
        <Text style={styles.targetText}>Target: Rs {requestedamm}</Text>
        <ProgressBar
          progress={progress}
          width={null}
          color="#ff4500"
          height={10}
          borderRadius={5}
          unfilledColor="#eee"
          style={{ marginTop: 5 }}
        />
        <Text style={styles.byText}>By: Haad Shekh on {readableDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    height: 'auto', // fixed height for consistency
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  progressContainer: {
    marginTop: "30", // pushes to bottom
  },
  raisedText: {
    fontSize: 14,
    color: "#333",
  },
  targetText: {
    fontSize: 14,
    color: "#888",
  },
  byText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default EmergencyCard;
