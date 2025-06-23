import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import img from "../../../assets/images/give.jpg";
import { db } from "../../../Firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import EmergencyCard from "../../../components/DonateCard";
import { ScrollView } from "react-native-web";

export default function GiveDonation() {
  const [data, setData] = useState([]);

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fundRequests"));
      const fetchedData = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id, // optional: helpful for keys
          amountRaised: d.amountRaised,
          amountRequested: d.amountRequested,
          blogImg: d.blogImg,
          title: d.title,
          status: d.status,
        };
      });
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <ScrollView>
    <SafeAreaView>
      <ImageBackground source={img} style={styles.img}>
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.text}>Give a Helping Hand</Text>
        </View>
      </ImageBackground>

      {data.map((item) => (
        <EmergencyCard
          key={item.id}
          amountraise={item.amountRaised}
          requestedamm={item.amountRequested}
          img={item.blogImg}
          title={item.title}
          status={item.status}
        />
      ))}
    </SafeAreaView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 250,
    width: "100%",
    resizeMode: "cover",
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
});
