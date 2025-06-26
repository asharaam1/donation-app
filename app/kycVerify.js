import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../Firebase/config";

const RaiseFundScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [kycLoading, setKycLoading] = useState(false);

  // const [fundTitle, setFundTitle] = useState("");
  // const [fundAmount, setFundAmount] = useState("");
  // const [fundDescription, setFundDescription] = useState("");
  // const [blogImgFile, setBlogImgFile] = useState(null);
  // const [fundLoading, setFundLoading] = useState(false);

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
      setImage({ uri: file });
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const data = new FormData();
      data.append("file", blob, "cnic.jpg");
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

  const submitKyc = async () => {
    if (!cnicFront || !cnicBack || !address.trim() || !mobile.trim()) {
      Alert.alert("Error", "Please fill all KYC fields and capture selfie");
      return;
    }

    const mobileRegex = /^03\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      Alert.alert("Error", "Please enter a valid mobile number starting with 03");
      console.log("File check - fundraise.js loaded properly");
      return;
    }

    setKycLoading(true);
    try {
      const user = auth.currentUser;
      const kycQuery = query(collection(db, "kycRequests"), where("userId", "==", user.uid));
      const kycSnapshot = await getDocs(kycQuery);
      if (!kycSnapshot.empty) {
        Alert.alert("KYC Exists", "You have already submitted KYC.");
        router.push('/needy/fundraise')
        setKycLoading(false);
        return;
      }

      const [frontUrl, backUrl] = await Promise.all([
        uploadToCloudinary(cnicFront.uri),
        uploadToCloudinary(cnicBack.uri),
      ]);

      const obj = {
        userId: user.uid,
        cnicFrontUrl: frontUrl,
        cnicBackUrl: backUrl,
        address: address.trim(),
        mobile: mobile.trim(),
        status: "pending",
        submittedAt: Date.now(),
        reviewedby: null,
      }
      await setDoc(doc(db, "kycRequests", user.uid), obj);

      Alert.alert("Success", "KYC submitted successfully.");
      setCnicFront(null);
      setCnicBack(null);
      setAddress("");
      setMobile("");
      router.push('/needy')
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit KYC");
    }
    setKycLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff5528" />
      ) : !userData ? (
        <Text style={styles.errorText}>Please login to continue.</Text>
      ) : userData.kycStatus !== "approved" ? (
        <>
          <Text style={styles.title}>KYC Verification</Text>
          <TouchableOpacity onPress={() => pickImage(setCnicFront)}>
            <View style={styles.imagePicker}>
              {cnicFront ? (
                <Image source={{ uri: cnicFront.uri }} style={styles.previewImage} />
              ) : (
                <Text style={{ color: "#666", textAlign: 'center' }}>Pick Cnic Front Image</Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickImage(setCnicBack)}>
            <View style={styles.imagePicker}>
              {cnicBack ? (
                <Image source={{ uri: cnicBack.uri }} style={styles.previewImage} />
              ) : (
                <Text style={{ color: "#666", textAlign: 'center' }}>Pick Cnic Back Image</Text>
              )}
            </View>
          </TouchableOpacity>
          <TextInput style={styles.inputBox} placeholder="Full Address" value={address} onChangeText={setAddress} />
          <TextInput style={styles.inputBox} placeholder="Mobile Number (03XXXXXXXXX)" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={submitKyc} disabled={kycLoading}>
            <Text style={styles.buttonText}>{kycLoading ? "Submitting..." : "Submit KYC"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Wait for Response</Text>
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
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default RaiseFundScreen;
