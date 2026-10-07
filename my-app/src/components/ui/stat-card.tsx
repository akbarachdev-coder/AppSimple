import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IoniconName } from '@/constants/categories';
import { Spacing, type AccentTint } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';

interface StatCardProps {
  icon: IoniconName;
  tint: AccentTint;
  label: string;
  value: string;
  caption?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({ icon, tint, label, value, caption, style }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.row}>
        <IconTile name={icon} tint={tint} size="sm" />
        <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {caption ? (
        <Text style={[styles.caption, { color: theme.textSecondary }]} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
    flexBasis: '46%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    flexShrink: 1,
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
