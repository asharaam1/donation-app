// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
// import { Camera } from "expo-camera";
// import * as ImagePicker from "expo-image-picker";
// import { auth, db } from "../../../Firebase/config";
// import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import { uploadToCloudinary } from "../../../Firebase/cloudinaryUpload";
// // import { MotiView, AnimatePresence } from "moti";

// const RaiseFundScreen = () => {
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [cnicFront, setCnicFront] = useState(null);
//   const [cnicBack, setCnicBack] = useState(null);
//   const [address, setAddress] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [selfie, setSelfie] = useState(null);
//   const [kycLoading, setKycLoading] = useState(false);

//   const [fundTitle, setFundTitle] = useState("");
//   const [fundAmount, setFundAmount] = useState("");
//   const [fundDescription, setFundDescription] = useState("");
//   const [blogImgFile, setBlogImgFile] = useState(null);
//   const [fundLoading, setFundLoading] = useState(false);

//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         setUserData(null);
//         setLoading(false);
//         return;
//       }
//       const docRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setUserData(docSnap.data());
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const getPermission = async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(status === 'granted');
//     };
//     getPermission();
//   }, []);

//   const pickImage = async (setImage) => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//     }
//   };

//   const captureSelfie = async () => {
//     if (cameraRef.current) {
//       let photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
//       setSelfie(photo);
//     }
//   };

//   const submitKyc = async () => {
//     if (!cnicFront || !cnicBack || !address.trim() || !mobile.trim() || !selfie) {
//       Alert.alert("Error", "Please fill all KYC fields and capture selfie");
//       return;
//     }

//     const mobileRegex = /^03\d{9}$/;
//     if (!mobileRegex.test(mobile)) {
//       Alert.alert("Error", "Please enter a valid mobile number starting with 03");
//       return;
//     }

//     setKycLoading(true);
//     try {
//       const user = auth.currentUser;
//       const kycQuery = query(collection(db, "kycRequests"), where("userId", "==", user.uid));
//       const kycSnapshot = await getDocs(kycQuery);
//       if (!kycSnapshot.empty) {
//         Alert.alert("KYC Exists", "You have already submitted KYC.");
//         setKycLoading(false);
//         return;
//       }

//       const [frontUrl, backUrl, selfieUrl] = await Promise.all([
//         uploadToCloudinary(cnicFront.uri, "kyc"),
//         uploadToCloudinary(cnicBack.uri, "kyc"),
//         uploadToCloudinary(selfie.uri, "kyc"),
//       ]);

//       await setDoc(doc(db, "kycRequests", user.uid), {
//         userId: user.uid,
//         cnicFrontUrl: frontUrl,
//         cnicBackUrl: backUrl,
//         selfieUrl: selfieUrl,
//         address: address.trim(),
//         mobile: mobile.trim(),
//         status: "pending",
//         submittedAt: new Date(),
//         reviewedby: null,
//       });

//       Alert.alert("Success", "KYC submitted successfully.");
//       setCnicFront(null);
//       setCnicBack(null);
//       setAddress("");
//       setMobile("");
//       setSelfie(null);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to submit KYC");
//     }
//     setKycLoading(false);
//   };

//   const submitFundRaise = async () => {
//     if (!fundTitle.trim() || !fundAmount || Number(fundAmount) <= 0 || !fundDescription.trim() || !blogImgFile) {
//       Alert.alert("Error", "Please fill all fund details and upload an image");
//       return;
//     }

//     setFundLoading(true);
//     try {
//       const user = auth.currentUser;
//       const blogImageUrl = await uploadToCloudinary(blogImgFile.uri, "fund_requests");

//       await addDoc(collection(db, "fundRequests"), {
//         userId: user.uid,
//         title: fundTitle.trim(),
//         description: fundDescription.trim(),
//         amountRequested: Number(fundAmount),
//         amountRaised: 0,
//         status: "pending",
//         createdAt: new Date(),
//         blogImg: blogImageUrl,
//       });

//       Alert.alert("Success", "Fundraising request submitted successfully.");
//       setFundTitle("");
//       setFundAmount("");
//       setFundDescription("");
//       setBlogImgFile(null);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to submit fund request");
//     }
//     setFundLoading(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <MotiView
//         from={{ opacity: 0, translateY: 20 }}
//         animate={{ opacity: 1, translateY: 0 }}
//         transition={{ type: "timing", duration: 600 }}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#ff5528" />
//         ) : !userData ? (
//           <Text style={styles.errorText}>Please login to continue.</Text>
//         ) : userData.kycStatus !== "approved" ? (
//           <>
//             <Text style={styles.title}>KYC Verification</Text>
//             <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setCnicFront)}>
//               <Text>Select CNIC Front</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setCnicBack)}>
//               <Text>Select CNIC Back</Text>
//             </TouchableOpacity>
//             <TextInput style={styles.inputBox} placeholder="Full Address" value={address} onChangeText={setAddress} />
//             <TextInput style={styles.inputBox} placeholder="Mobile Number (03XXXXXXXXX)" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
//             <Camera style={{ height: 240 }} ref={cameraRef} />
//             <TouchableOpacity style={styles.button} onPress={captureSelfie}>
//               <Text style={styles.buttonText}>Capture Selfie</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={submitKyc} disabled={kycLoading}>
//               <Text style={styles.buttonText}>{kycLoading ? "Submitting..." : "Submit KYC"}</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <>
//             <Text style={styles.title}>Raise Fund</Text>
//             <TextInput style={styles.inputBox} placeholder="Fund Title" value={fundTitle} onChangeText={setFundTitle} />
//             <TextInput style={styles.inputBox} placeholder="Amount Needed" value={fundAmount} onChangeText={setFundAmount} keyboardType="numeric" />
//             <TextInput style={styles.inputBox} placeholder="Tell us your story..." value={fundDescription} onChangeText={setFundDescription} multiline numberOfLines={4} />
//             <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setBlogImgFile)}>
//               <Text>Select Image for Fund</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={submitFundRaise} disabled={fundLoading}>
//               <Text style={styles.buttonText}>{fundLoading ? "Submitting..." : "Raise Fund"}</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </MotiView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center'
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#ff5528'
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 50,
//   },
//   inputBox: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 10,
//   },
//   button: {
//     backgroundColor: '#ff5528',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default RaiseFundScreen;

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
// import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
// import { Platform } from "react-native";
// import Webcam from "react-webcam"; // ✅ React-based camera for Web
// console.log("typeof Webcam", typeof Webcam);

{/* <Camera ref={cameraRef} /> */ }

import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
// import { uploadToCloudinary } from "../../../Firebase/cloudinaryUpload";
import { auth, db } from "../../../Firebase/config";
console.log("typeof uploadToCloudinary", typeof uploadToCloudinary);


const RaiseFundScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  // const [selfie, setSelfie] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);

  const [fundTitle, setFundTitle] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [blogImgFile, setBlogImgFile] = useState(null);
  const [fundLoading, setFundLoading] = useState(false);

  // const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // const cameraRef = useRef(null);
  // const webcamRef = useRef(null);

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

  // useEffect(() => {
  //   const getPermission = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasCameraPermission(status === 'granted');
  //   };
  //   getPermission();
  // }, []);

  // useEffect(() => {
  //   const getPermission = async () => {
  //     if (Platform.OS !== "web") {
  //       const { status } = await Camera.requestCameraPermissionsAsync();
  //       setHasCameraPermission(status === "granted");
  //     }
  //   };
  //   getPermission();
  // }, []);

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


  // const captureSelfie = async () => {
  //   if (cameraRef.current) {
  //     let photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
  //     setSelfie(photo);
  //   }
  // };


  // const captureSelfie = async () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();

  //     if (!imageSrc) {
  //       alert("Unable to capture selfie. Please allow camera access.");
  //       return;
  //     }

  //     // Convert base64 image to Blob
  //     const res = await fetch(imageSrc);
  //     const blob = await res.blob();

  //     // Create a File object from the Blob (for upload)
  //     const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

  //     setSelfie(file); // ✅ Save for uploadToCloudinary
  //     console.log("Captured selfie file:", file);
  //   } else {
  //     alert("Webcam not ready");
  //   }
  // };


  const submitKyc = async () => {
    if (!cnicFront || !cnicBack || !address.trim() || !mobile.trim()) { //|| !selfie
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
        setKycLoading(false);
        console.log("File check - fundraise.js loaded properly");
        return;
      }

      const [frontUrl, backUrl] = await Promise.all([ //selfieUrl
        uploadToCloudinary(cnicFront.uri, "kyc"),
        uploadToCloudinary(cnicBack.uri, "kyc"),
        // uploadToCloudinary(selfie.uri, "kyc"),
      ]);

      await setDoc(doc(db, "kycRequests", user.uid), {
        userId: user.uid,
        cnicFrontUrl: frontUrl,
        cnicBackUrl: backUrl,
        // selfieUrl: selfieUrl,
        address: address.trim(),
        mobile: mobile.trim(),
        status: "pending",
        submittedAt: new Date(),
        reviewedby: null,
      });

      Alert.alert("Success", "KYC submitted successfully.");
      setCnicFront(null);
      setCnicBack(null);
      setAddress("");
      setMobile("");
      // setSelfie(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit KYC");
    }
    setKycLoading(false);
  };

  const submitFundRaise = async () => {
    if (!fundTitle.trim() || !fundAmount || Number(fundAmount) <= 0 || !fundDescription.trim() || !blogImgFile) {
      Alert.alert("Error", "Please fill all fund details and upload an image");
      console.log("File check - fundraise.js loaded properly");
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
          <Text style={styles.title}>KYC Verification</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setCnicFront)}>
            <Text>Select CNIC Front</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputBox} onPress={() => pickImage(setCnicBack)}>
            <Text>Select CNIC Back</Text>
          </TouchableOpacity>
          <TextInput style={styles.inputBox} placeholder="Full Address" value={address} onChangeText={setAddress} />
          <TextInput style={styles.inputBox} placeholder="Mobile Number (03XXXXXXXXX)" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
          {/* <Camera style={{ height: 240 }} ref={cameraRef} /> */}
          {/* <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          /> */}

          {/* <TouchableOpacity style={styles.button} onPress={captureSelfie}>
            <Text style={styles.buttonText}>Capture Selfie</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={submitKyc} disabled={kycLoading}>
            <Text style={styles.buttonText}>{kycLoading ? "Submitting..." : "Submit KYC"}</Text>
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
console.log(typeof RaiseFundScreen); // should print 'function'

export default RaiseFundScreen;

//Above work in pending 