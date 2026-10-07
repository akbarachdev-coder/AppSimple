import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { IconTile } from '@/components/ui/icon-tile';
import { formatNumber, formatTime } from '@/utils/format';
import { MOVEMENT_META } from '@/utils/stock';
import type { StockMovement } from '@/types/warehouse';

interface MovementRowProps {
  movement: StockMovement;
  showItemName?: boolean;
}

export function MovementRow({ movement, showItemName = true }: MovementRowProps) {
  const theme = useTheme();
  const meta = MOVEMENT_META[movement.type];
  const sign = movement.type === 'out' ? '-' : movement.type === 'in' ? '+' : '';
  const amount = `${sign}${formatNumber(Math.abs(movement.quantity))}`;

  return (
    <View style={styles.row}>
      <IconTile name={meta.icon} tint={meta.tint} size="sm" />
      <View style={styles.body}>
        {showItemName ? (
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {movement.itemName}
          </Text>
        ) : null}
        <Text style={[styles.note, { color: theme.textSecondary }]} numberOfLines={1}>
          {movement.note || meta.label}
        </Text>
        <Text style={[styles.type, { color: theme[meta.tint] }]}>
          {meta.shortLabel} · {formatTime(movement.createdAt)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: theme[meta.tint] }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
  },
  body: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  note: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  type: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  amount: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
});
