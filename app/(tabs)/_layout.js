// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
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
    <Tabs screenOptions={{ headerShown: false }}>
      {userRole === 'donor' ? (
        <>
          <Tabs.Screen 
            name="donor/index" 
            options={{ 
              title: 'Donor',
              tabBarLabel: 'Donor Dashboard'
            }} 
          />
          <Tabs.Screen 
            name="donor/donations" 
            options={{ 
              title: 'My Donations',
              tabBarLabel: 'My Donations'
            }} 
          />
        </>
      ) : (
        <>
          <Tabs.Screen 
            name="needy/index" 
            options={{ 
              title: 'Needy',
              tabBarLabel: 'Needy Dashboard'
            }} 
          />
          <Tabs.Screen 
            name="needy/requests" 
            options={{ 
              title: 'My Requests',
              tabBarLabel: 'My Requests'
            }} 
          />
        </>
      )}
    </Tabs>
  );
}
