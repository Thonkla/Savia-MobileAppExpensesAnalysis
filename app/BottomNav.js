import { View } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: 55,
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderColor: '#ccc',
      }}
    >
      <Link href="/" asChild>
        <Ionicons
          name="home"
          size={24}
          color={pathname === '/' ? 'gray' : 'black'}
        />
      </Link>
      <Link href="/analyze" asChild>
        <Ionicons
          name="analytics-outline"
          size={24}
          color={pathname === '/analyze' ? 'gray' : 'black'}
        />
      </Link>
      <Link href="/add" asChild>
        <Ionicons
          name="create"
          size={24}
          color={pathname === '/add' ? 'gray' : 'black'}
        />
      </Link>
    </View>
  );
}
