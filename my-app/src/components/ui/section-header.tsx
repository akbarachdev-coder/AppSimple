import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SectionHeaderProps {
  title: string;
  caption?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ title, caption, actionLabel, onAction, style }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, style]}>
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {caption ? (
          <Text style={[styles.caption, { color: theme.textSecondary }]}>{caption}</Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          {({ pressed }) => (
            <Text style={[styles.action, { color: theme.primary, opacity: pressed ? 0.6 : 1 }]}>
              {actionLabel}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleBlock: {
    flexShrink: 1,
    gap: 2,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  action: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
