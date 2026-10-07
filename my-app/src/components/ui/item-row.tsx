import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_META } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatNumber, formatRupiah } from '@/utils/format';
import { getStockStatus } from '@/utils/stock';
import type { WarehouseItem } from '@/types/warehouse';

interface ItemRowProps {
  item: WarehouseItem;
  onPress?: () => void;
}

export function ItemRow({ item, onPress }: ItemRowProps) {
  const theme = useTheme();
  const meta = CATEGORY_META[item.category];
  const status = getStockStatus(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Barang ${item.name}, stok ${item.quantity} ${item.unit}`}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Card style={styles.card}>
        <IconTile name={meta.icon} tint={meta.tint} />
        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.sku} · {meta.label} · {item.location}
          </Text>
          <StatusBadge status={status} style={styles.badge} />
        </View>
        <View style={styles.trailing}>
          <Text style={[styles.quantity, { color: theme.text }]}>{formatNumber(item.quantity)}</Text>
          <Text style={[styles.unit, { color: theme.textSecondary }]}>{item.unit}</Text>
          <Text style={[styles.value, { color: theme.textSecondary }]}>
            {formatRupiah(item.unitPrice * item.quantity, { compact: true })}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  badge: {
    marginTop: Spacing.one,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 1,
  },
  quantity: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
});
