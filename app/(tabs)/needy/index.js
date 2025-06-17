import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function NeedyHome() {
  return (
    <View>
      <Text>Welcome Needy Person</Text>
      <Button title="Fund Raise" onPress={() => router.push('/(tabs)/needy/fund')} />
    </View>
  );
}
