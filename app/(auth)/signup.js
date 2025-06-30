import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../Firebase/config";
import logo from "../../assets/images/logo.png";
import * as Location from "expo-location";

export default function Signup() {
  const [role, setRole] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [Latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    let position = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (!status) {
        setError(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    };

    position();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("Selected Image URI:", result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });
      data.append("upload_preset", "react-native");
      data.append("cloud_name", "do8y0zgci");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/do8y0zgci/image/upload",
        {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await res.json();
      if (result.secure_url) {
        console.log("Image uploaded:", result.secure_url);
        return result.secure_url;
      } else {
        console.error("Cloudinary error:", result);
        return null;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const signup = async () => {
    if (!role || !fullName || !email || !password || !confirmPassword) {
      alert("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

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

      const userData = {
        uid: user.uid,
        fullName,
        email,
        role,
        profileImageUrl: imageUrl,
        latitude: Latitude,
        longitude: longitude,
        createdAt: Date.now(),
      };

      if (role === "needy") {
        userData.contact = contact;
        userData.city = city;
      }

      await setDoc(doc(db, "users", user.uid), userData);
      await AsyncStorage.setItem("uid", user.uid);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      if (role === "donor") {
        router.push("/donor");
      } else {
        router.push("/needy");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.signupContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.roleButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role !== "donor" && styles.inactiveRole,
                ]}
                onPress={() => setRole("donor")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role !== "donor" && styles.inactiveRoleText,
                  ]}
                >
                  Donor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role !== "needy" && styles.inactiveRole,
                ]}
                onPress={() => setRole("needy")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role !== "needy" && styles.inactiveRoleText,
                  ]}
                >
                  Needy
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={pickImage}>
              <View style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <Text style={{ color: "#666" }}>Pick Profile Image</Text>
                )}
              </View>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {role === "needy" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={city}
                  onChangeText={setCity}
                />
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[
                styles.signupButton,
                uploading && { backgroundColor: "#ccc" },
              ]}
              onPress={signup}
              disabled={uploading}
            >
              <Text style={styles.signupButtonText}>
                {uploading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.loginLink}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  signupContainer: {
    width: "85%",
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF5F15",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 13,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
  },
  signupButton: {
    backgroundColor: "#FF5F15",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  roleButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  roleButton: {
    backgroundColor: "#FF5F15",
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  inactiveRole: {
    backgroundColor: "#d1d5dc",
  },
  roleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveRoleText: {
    color: "#000",
  },
  loginLink: {
    color: "#FF5F15",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
