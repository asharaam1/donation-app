import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const FacebookCard = ({ img, description = "" }) => {
  const [showMore, setShowMore] = useState(false);
//   const maxLength = 100;

  const toggleShowMore = () => setShowMore(!showMore);

  const shouldTruncate = description.length > 100;
  const displayText =
    shouldTruncate && !showMore
      ? description.slice(0, maxLength).trim() + "..."
      : description;

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {/* Description */}
        <Text style={styles.description}>{displayText}</Text>

        {/* See more/less button */}
        {shouldTruncate && (
          <TouchableOpacity onPress={toggleShowMore}>
            <Text style={styles.seeMore}>
              {showMore ? "See less" : "See more"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Image */}
        <Image
          source={typeof img === "string" ? { uri: img } : img}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 22,
    marginBottom: 4,
  },
  seeMore: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 10,
    marginTop: 8,
  },
  cardWrapper: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
});

export default FacebookCard;
