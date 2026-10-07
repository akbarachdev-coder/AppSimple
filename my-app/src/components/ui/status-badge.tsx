import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { AccentSoft, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { STOCK_STATUS_META, getStockStatus } from '@/utils/stock';
import type { StockStatus, WarehouseItem } from '@/types/warehouse';

interface StatusBadgeProps {
  status: StockStatus;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const theme = useTheme();
  const meta = STOCK_STATUS_META[status];
  const color = theme[meta.tint];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: theme[AccentSoft[meta.tint]] },
        style,
      ]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{meta.label}</Text>
    </View>
  );
}

export function ItemStatusBadge({ item, style }: { item: WarehouseItem; style?: StyleProp<ViewStyle> }) {
  return <StatusBadge status={getStockStatus(item)} style={style} />;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    paddingVertical: 3,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
});
