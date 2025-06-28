import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React from "react";
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import cardimg1 from "../../../assets/images/Donationcard1.jpg";
import cardimg2 from "../../../assets/images/Donationcard2.jpg";
import povertyImg from "../../../assets/images/poverty_2226036b.webp";


export default function NeedyHome() {
  // Helper for card press animation
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const renderCard = (img, title, desc, raised, goal) => {
    const scale = new Animated.Value(1);
    return (
      <AnimatedTouchable
        key={title}
        style={styles.customCard}
        activeOpacity={0.9}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {/* Accent Bar */}
          <View style={styles.accentBar} />
          {/* Image with gradient overlay */}
          <View style={styles.imageContainer}>
            <Image source={img} style={styles.cardImage} resizeMode="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.0)"]}
              style={styles.gradientOverlay}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{desc}</Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Raised Rs.{raised}</Text>
              <Text style={styles.progressText}>Goal Rs.{goal}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(raised/goal)*100}%` }]} />
            </View>
            <TouchableOpacity style={styles.cardButton} activeOpacity={0.85}>
              <Text style={styles.cardButtonText}>Fundraise Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </AnimatedTouchable>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section with Carousel */}
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
            <Image
              source={povertyImg}
              style={styles.slideImage}
              resizeMode="cover"
            />
            <View style={styles.slideOverlay}>
              <Text style={styles.slideTitle}>Welcome Needy User</Text>
              <Text style={styles.slideSubtitle}>Get support for your needs</Text>
            </View>
          </View>
          <View style={styles.slide}>
            <Image
              source={cardimg1}
              style={styles.slideImage}
              resizeMode="cover"
            />
            <View style={styles.slideOverlay}>
              <Text style={styles.slideTitle}>Raise Funds Easily</Text>
              <Text style={styles.slideSubtitle}>Start your fundraising journey</Text>
            </View>
          </View>
          <View style={styles.slide}>
            <Image
              source={cardimg2}
              style={styles.slideImage}
              resizeMode="cover"
            />
            <View style={styles.slideOverlay}>
              <Text style={styles.slideTitle}>Connect with Donors</Text>
              <Text style={styles.slideSubtitle}>Share your story and get help</Text>
            </View>
          </View>
        </Swiper>
      </View>

      {/* Animated Welcome Section */}
      <View style={styles.animatedWelcome}>
        <Text style={styles.animatedText}>👋 Welcome! Let&apos;s empower your future together.</Text>
      </View>

      {/* Fundraise Button */}
      <TouchableOpacity style={styles.fundraiseButton} onPress={() => router.push('/(tabs)/needy/fundraise')}>
        <Text style={styles.fundraiseButtonText}>Start Fundraising</Text>
      </TouchableOpacity>

      {/* Example Fundraising Cards - custom layout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Fundraising Opportunities</Text>
        {renderCard(
          povertyImg,
          "Medical Emergency",
          "Raise funds for urgent medical needs and treatments.",
          1200,
          5000
        )}
        {renderCard(
          cardimg1,
          "Education Support",
          "Get help for school fees, books, and supplies.",
          800,
          3000
        )}
        {renderCard(
          cardimg2,
          "Family Support",
          "Support your family in times of crisis.",
          500,
          2500
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heroContainer: {
    height: 260,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  slideSubtitle: {
    fontSize: 16,
    color: "#e2f0ff",
    textAlign: "center",
  },
  animatedWelcome: {
    marginTop: 20,
    alignItems: "center",
  },
  animatedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5F15",
  },
  fundraiseButton: {
    backgroundColor: "#FF5F15",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    elevation: 2,
  },
  fundraiseButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
  },
  customCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 2,
  },
  accentBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#FF5F15",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 60,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardContent: {
    padding: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 14,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF5F15",
    borderRadius: 4,
  },
  cardButton: {
    backgroundColor: "#FF5F15",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
