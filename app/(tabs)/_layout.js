// app/(tabs)/_layout.js
import { Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../Firebase/config';

export default function TabsLayout() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);

  // This is a no-op edit to force re-evaluation
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  if (!userRole) {
    return null; // or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userRole === 'donor' ? (
        <Stack.Screen 
          name="donor" 
          options={{ 
            title: 'Donor'
          }} 
        />
      ) : userRole === 'needy' ? (
        <Stack.Screen 
          name="needy" 
          options={{ 
            title: 'Needy'
          }} 
        />
      ) : null}
    </Stack>
  );
}
