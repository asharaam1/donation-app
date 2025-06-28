import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { app } from '../Firebase/config'; // Adjust path as needed

const NeedyHistory = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [fundRequests, setFundRequests] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [totalDonatedAmount, setTotalDonatedAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, 'fundRequests'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let total = 0;
          const requests = snapshot.docs.map((doc) => {
            const data = doc.data();
            total += data.amountRaised || 0;
            return { id: doc.id, ...data };
          });

          setFundRequests(requests);
          setTotalCases(requests.length);
          setTotalDonatedAmount(total);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff5528" />
        <Text style={styles.loadingText}>Loading Fund Requests...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Fund Requests</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Cases</Text>
          <Text style={styles.statValue}>{totalCases}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Raised</Text>
          <Text style={styles.statValue}>Rs {totalDonatedAmount.toLocaleString()}</Text>
        </View>
      </View>

      {fundRequests.length === 0 ? (
        <Text style={styles.noRequests}>No fund requests submitted yet.</Text>
      ) : (
        <FlatList
          data={fundRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.meta}>Requested: Rs {item.amountRequested?.toLocaleString() || 0}</Text>
                <Text style={styles.meta}>Raised: Rs {item.amountRaised?.toLocaleString() || 0}</Text>
              </View>
              <Image
                source={{ uri: item.blogImg || 'https://via.placeholder.com/100' }}
                style={styles.image}
              />
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

export default NeedyHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5ed',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5528',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff1e6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '45%',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5528',
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff7f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  status: {
    color: '#666',
    marginTop: 4,
  },
  meta: {
    color: '#999',
    fontSize: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noRequests: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ed',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff5528',
  },
});
