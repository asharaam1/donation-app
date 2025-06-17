import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function DonorHome() {
  return (
    <View>
      <Text>Welcome Donor</Text>
      <Button title="Give Donation" onPress={() => router.push('/(tabs)/donor/give')} />
    </View>
  );
}
