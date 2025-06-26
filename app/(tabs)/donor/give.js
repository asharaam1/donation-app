import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import img from "../../../assets/images/give.jpg";
import { db } from "../../../Firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import EmergencyCard from "../../../components/DonateCard";

export default function GiveDonation() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fundRequests"));
      const fetchedData = querySnapshot.docs.map((doc) => {
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
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
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

        {/* Cards in 2-column layout with no spacing */}
        <View>
          {Array.from({ length: Math.ceil(data.length / 2) }).map(
            (_, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {data.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => (
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
            )
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 0,
    margin: 0,
  },
  safe: {
    padding: 0,
    margin: 0,
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

  row: {
    flexDirection: "row",
    gap: 5,
    margin: 5,
  },
  cardContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
});
