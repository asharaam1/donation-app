import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import carouselImage1 from "../../../assets/images/carosuel-1.jpg";
import cardimg from "../../../assets/images/Donationcard1.jpg";
import cardimg2 from "../../../assets/images/Donationcard2.jpg";
import cardimg3 from "../../../assets/images/Donationcard3.jpg";
import cardimg4 from "../../../assets/images/Donationcard4.webp";
import {
  default as carouselImage2,
  default as carouselImage4,
} from "../../../assets/images/donationpagebanner-copy.jpg";
import carouselImage3 from "../../../assets/images/poverty_2226036b.webp";
import { Card } from "../../../components/Card.js";
import Testimonial from "../../../components/Testimonials.js";
import { auth, db } from "../../../Firebase/config.js";
import { collection, getDocs } from "firebase/firestore";

const DonorScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fundRequests"));
      const fetchedData = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          blogImg: d.blogImg,
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.push("/");
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5F15" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#FF5F15" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setError(null)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Carousel */}
        <View style={styles.heroContainer}>
          <Swiper
            style={styles.swiper}
            showsButtons={false}
            autoplay={true}
            dotColor="#FF5F15"
            activeDotColor="#FFFFFF"
            loop={true}
          >
            <View style={styles.slide}>
              <Image source={carouselImage1} style={styles.slideImage} resizeMode="cover" />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>Make a Difference Today</Text>
                <Text style={styles.slideSubtitle}>Your donation can change lives</Text>
              </View>
            </View>
            <View style={styles.slide}>
              <Image source={carouselImage2} style={styles.slideImage} resizeMode="cover" />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>Impact Statistics</Text>
                <Text style={styles.slideSubtitle}>Over 10,000 lives impacted</Text>
              </View>
            </View>
            <View style={styles.slide}>
              <Image source={carouselImage3} style={styles.slideImage} resizeMode="cover" />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>Join Our Cause</Text>
                <Text style={styles.slideSubtitle}>Be part of something bigger</Text>
              </View>
            </View>
            <View style={styles.slide}>
              <Image source={carouselImage4} style={styles.slideImage} resizeMode="cover" />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>Together, We can make difference</Text>
                <Text style={styles.slideSubtitle}>Be a part of the change.</Text>
              </View>
            </View>
          </Swiper>
        </View>

        {/* Horizontal Card Scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Together We Can Empower Lives</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {[cardimg, cardimg2, cardimg3, cardimg4].map((img, idx) => (
              <Card
                key={idx}
                imageSource={img}
                title="Education Support"
                description="Providing access to quality education and learning resources for underprivileged children."
                raised={45.0}
                goal={120.0}
              />
            ))}
          </ScrollView>
        </View>

        {/* Impact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12,540+</Text>
              <Text style={styles.statLabel}>Lives Changed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>78</Text>
              <Text style={styles.statLabel}>Projects Funded</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Rs,3.2M+</Text>
              <Text style={styles.statLabel}>Donations Raised</Text>
            </View>
          </View>
        </View>

     {/* Fund Requests Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Recent Fund Requests</Text>

  {data.length === 0 ? (
    <Text style={{ textAlign: "center", color: "#999" }}>
      No fund requests available.
    </Text>
  ) : (
    data.map((item, index) => (
      <View key={index} style={styles.fundCard}>
        {/* Description on top */}
        <Text style={styles.fundDescription}>{item.description}</Text>

        {/* Image below */}
        <Image source={{ uri: item.blogImg }} style={styles.fundImage} />
      </View>
    ))
  )}
</View>


        {/* Testimonials */}
        <Testimonial />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF5F15",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF5F15",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#FF5F15",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
  heroContainer: {
    height: 300,
  },
  swiper: {
    height: "100%",
  },
  slide: {
    flex: 1,
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  slideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  slideSubtitle: {
    fontSize: 18,
    color: "#e2f0ff",
    textAlign: "center",
  },
  section: {
    padding: 20,
    backgroundColor: "white",
    marginVertical: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    width: "30%",
    borderWidth: 1,
    borderColor: "#FF9D80",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#047857",
  },
  statLabel: {
    fontSize: 14,
    color: "#65a30d",
    textAlign: "center",
    marginTop: 5,
  },
  fundCard: {
  marginBottom: 30,
  backgroundColor: "lightgray",
  borderRadius: 10,
  overflow: "hidden",
  // elevation: 2,
  padding: 6,
},
fundDescription: {
  fontSize: 16,
  color: "#333",
  marginBottom: 10,
},
fundImage: {
  width: "100%",
  height:450,
  borderRadius: 2,
},
});

export default DonorScreen;
