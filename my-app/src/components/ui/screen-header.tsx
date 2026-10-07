import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { IconButton } from '@/components/ui/icon-button';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backIcon?: 'back' | 'close';
  actions?: ReactNode;
  variant?: 'large' | 'compact';
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backIcon = 'back',
  actions,
  variant,
  style,
}: ScreenHeaderProps) {
  const theme = useTheme();
  const resolvedVariant = variant ?? (onBack ? 'compact' : 'large');
  const isLarge = resolvedVariant === 'large';

  const titleBlock = (
    <View style={styles.titleBlock}>
      <Text
        style={[
          isLarge ? styles.largeTitle : styles.compactTitle,
          { color: theme.text },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.row, style]}>
      {onBack ? (
        <IconButton
          icon={backIcon === 'close' ? 'close' : 'chevron-back'}
          onPress={onBack}
          accessibilityLabel={backIcon === 'close' ? 'Tutup' : 'Kembali'}
        />
      ) : null}
      {titleBlock}
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  largeTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  compactTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
