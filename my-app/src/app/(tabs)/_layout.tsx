import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';

import type { IoniconName } from '@/constants/categories';
import { TabBar } from '@/components/ui/tab-bar';

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  items: { active: 'cube', inactive: 'cube-outline' },
  movements: { active: 'swap-horizontal', inactive: 'swap-horizontal' },
};

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] ?? TAB_ICONS.index;
          return (
            <Ionicons name={focused ? icons.active : icons.inactive} color={color} size={size} />
          );
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="items" options={{ title: 'Barang' }} />
      <Tabs.Screen name="movements" options={{ title: 'Mutasi' }} />
    </Tabs>
  );
}
