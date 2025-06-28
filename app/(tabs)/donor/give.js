import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import img from "../../../assets/images/give.jpg";
import { db } from "../../../Firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import EmergencyCard from "../../../components/DonateCard";

export default function GiveDonation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "fundRequests"),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            amountRaised: d.amountRaised,
            amountRequested: d.amountRequested,
            blogImg: d.blogImg,
            title: d.title,
            status: d.status,
            createdAt: d.createdAt,
            description: d.description,
          };
        });
        setData(fetchedData);
      },
      (error) => {
        console.error("Error listening to fundRequests:", error);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.scroll}>
      <SafeAreaView style={styles.safe}>
        <ImageBackground source={img} style={styles.img}>
          <View style={styles.overlay} />
          <View style={styles.content}>
            <Text style={styles.text}>Give a Helping Hand</Text>
          </View>
        </ImageBackground>

        <View style={styles.cardGrid}>
          {data.map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              <EmergencyCard
                amountraise={item.amountRaised}
                requestedamm={item.amountRequested}
                img={item.blogImg}
                title={item.title}
                status={item.status}
                createat={item.createdAt}
                description={item.description}
                id={item.id}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safe: {
    flex: 1,
  },
  img: {
    height: 250,
    width: "100%",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  cardContainer: {
    width: "48.5%",
    marginBottom: 12,
  },
});
