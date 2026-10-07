import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { AccentSoft, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getLowStockItems } from '@/store/selectors';
import { useWarehouse } from '@/store/warehouse-context';

export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const theme = useTheme();
  const { items } = useWarehouse();
  const lowStockCount = getLowStockItems(items).length;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, Spacing.two),
        },
      ]}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key].options;
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);
        const color = focused ? theme.primary : theme.textSecondary;
        const badge = route.name === 'items' && lowStockCount > 0 ? lowStockCount : undefined;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: focused ? theme[AccentSoft.primary] : 'transparent' },
              ]}>
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              {badge !== undefined ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.warning, borderColor: theme.backgroundElement },
                  ]}>
                  <Text style={[styles.badgeLabel, { color: theme.onAccent }]}>{badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color, fontWeight: focused ? '700' : '600' },
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    minWidth: 62,
    height: 34,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
  },
});
