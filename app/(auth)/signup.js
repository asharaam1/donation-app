// app/auth/signup.js
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../Firebase/config"; // ✅ adjust path

export default function Signup() {
  const [role, setRole] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
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
      return result.secure_url || null;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const signup = async () => {
    if (!role || !fullName || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;

    setUploading(true);
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }
    setUploading(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,
        contact,
        country,
        role,
        profileImageUrl: imageUrl,
        createdAt: new Date(),
      });

      router.push("/auth/login"); // ✅ go to login page
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          {/* ... same UI as before ... */}
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.loginLink}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // same as before
});
