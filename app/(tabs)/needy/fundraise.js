import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../Firebase/config";

const RaiseFundScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [fundTitle, setFundTitle] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [blogImgFile, setBlogImgFile] = useState(null);
  const [fundLoading, setFundLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const file = result.assets[0].uri;
      console.log("Selected image file:", file);
      setImage(file);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const data = new FormData();
      data.append("file", blob, "profile-image.jpg");
      data.append("upload_preset", "react-native");
      data.append("cloud_name", "do8y0zgci");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/do8y0zgci/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.secure_url) {
        console.log("Uploaded Image URL:", result.secure_url);
        return result.secure_url;
      } else {
        console.error("Cloudinary Upload Error:", result);
        return null;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const submitFundRaise = async () => {
    if (!fundTitle.trim() || !fundAmount || Number(fundAmount) <= 0 || !fundDescription.trim() || !blogImgFile) {
      Alert.alert("Error", "Please fill all fund details and upload an image");
      return;
    }

    setFundLoading(true);
    try {
      const user = auth.currentUser;
      const blogImageUrl = await uploadToCloudinary(blogImgFile.uri, "fund_requests");

      await addDoc(collection(db, "fundRequests"), {
        userId: user.uid,
        title: fundTitle.trim(),
        description: fundDescription.trim(),
        amountRequested: Number(fundAmount),
        amountRaised: 0,
        status: "pending",
        createdAt: new Date(),
        blogImg: blogImageUrl,
      });

      Alert.alert("Success", "Fundraising request submitted successfully.");
      setFundTitle("");
      setFundAmount("");
      setFundDescription("");
      setBlogImgFile(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit fund request");
    }
    setFundLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff5528" />
      ) : !userData ? (
        <Text style={styles.errorText}>Please login to continue.</Text>
      ) : userData.kycStatus !== "approved" ? (
        <>
          <Text style={styles.title}>Please Verify KYC First</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/kycVerify")}
          >
            <Text style={styles.buttonText}>Let&apos;s Verify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Raise Fund</Text>
          <TextInput style={styles.inputBox} placeholder="Fund Title" value={fundTitle} onChangeText={setFundTitle} />
          <TextInput style={styles.inputBox} placeholder="Amount Needed" value={fundAmount} onChangeText={setFundAmount} keyboardType="numeric" />
          <TextInput style={styles.inputBox} placeholder="Tell us your story..." value={fundDescription} onChangeText={setFundDescription} multiline numberOfLines={4} />
          <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setBlogImgFile)}>
            <Text>Select Image for Fund</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={submitFundRaise} disabled={fundLoading}>
            <Text style={styles.buttonText}>{fundLoading ? "Submitting..." : "Raise Fund"}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#ff5528'
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#ff5528',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RaiseFundScreen;
