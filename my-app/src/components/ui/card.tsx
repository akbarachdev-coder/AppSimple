import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CardShadow, Radius, type AccentTint, AccentSoft } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Card({ children, style, ...rest }: ComponentProps<typeof View>) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

/** Card without shadow, tinted with one of the soft accent colors. */
export function SoftSurface({
  children,
  tint = 'neutral',
  style,
}: {
  children: ReactNode;
  tint?: AccentTint;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme[AccentSoft[tint]] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    ...CardShadow,
  },
});
