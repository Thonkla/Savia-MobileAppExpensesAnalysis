import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <BottomNav />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ให้ layout เต็มจอ
    flexDirection: 'column',
  },
  content: {
    flex: 1, // ให้ Slot เต็มพื้นที่ที่เหลือ
  },
});
