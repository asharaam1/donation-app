import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import logo from "../../assets/images/logo.png"; // updated relative path
import { auth, db } from "../../Firebase/config"; // also update path if needed
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [Timeout, setTimeout] = useState(null);


  // useEffect(() => {
  //   // Check if user is already logged in 
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       router.push("/(tabs)/donor");
  //     }
  //   });
  //   })




  // This is a no-op edit to force re-evaluation
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userRef = doc(db, "users", user.uid);
      AsyncStorage.setItem('uid', user.uid)
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        // Navigate based on user role
        console.log(userData)

        if (userData.role === 'donor') {
          router.replace("/(tabs)/donor");
        } else if (userData.role === 'needy') {
          router.replace("/(tabs)/needy");
        } else {
          setError("Invalid user role");
        }
      } else {
        setError("User data not found");
      }
    } catch (error) {
      console.log(error.message);
      setError("Invalid Email or Password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signUp}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
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
  loginButton: {
    backgroundColor: "#FF5F15",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#FF5F15",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  signUp: {
    color: "#FF5F15",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
