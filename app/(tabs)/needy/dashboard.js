import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../../Firebase/config";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth / 2 - 24;

const ApprovedRequestsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const fundRequestsQuery = query(
          collection(db, "fundRequests"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );

        const unsubscribePosts = onSnapshot(fundRequestsQuery, async (snapshot) => {
          const fetchedPosts = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const fund = docSnap.data();
              const userRef = doc(db, 'users', fund.userId);
              const userSnap = await getDoc(userRef);
              const user = userSnap.data();

              return {
                id: docSnap.id,
                title: fund.title,
                description: fund.description,
                amountRequested: fund.amountRequested,
                amountRaised: fund.amountRaised || 0,
                imageUrl: fund.blogImg || user?.profileImageUrl || "",
                userName: user?.fullName || 'Unknown',
                createdAt: fund.createdAt?.toDate ? fund.createdAt.toDate() : fund.createdAt,
              };
            })
          );
          setPosts(fetchedPosts);
          setLoadingPosts(false);
        });

        return () => unsubscribePosts();
      } catch (err) {
        console.error("Error loading fund requests:", err);
        setLoadingPosts(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{item.title.slice(0, 70)}...</Text>
      <Text style={styles.description}>{item.description.slice(0, 70)}...</Text>
      <View style={{ flex: 1 }} />
      <Text style={styles.meta}>Raised: Rs {item.amountRaised.toLocaleString()}</Text>
      <Text style={styles.meta}>Target: Rs {item.amountRequested.toLocaleString()}</Text>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${(item.amountRaised / item.amountRequested) * 100}%`,
            },
          ]}
        />
      </View>
      <Text style={styles.userInfo}>
        By: {item.userName} on {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loadingPosts) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff5528" />
        <Text>Loading fund requests...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
    />
  );
};

export default ApprovedRequestsScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: "#555",
    fontSize: 12,
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#444",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginVertical: 6,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#ff5528",
    borderRadius: 3,
  },
  userInfo: {
    fontSize: 11,
    color: "#777",
    fontStyle: "italic",
    marginTop: 4,
  },
});
