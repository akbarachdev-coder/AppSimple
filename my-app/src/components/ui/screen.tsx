import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Page container: applies the top safe-area inset and keeps content readable on wide screens. */
export function Screen({ children, style, ...rest }: ViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? Spacing.four : insets.top;

  return (
    <View
      style={[styles.root, { backgroundColor: theme.background, paddingTop: topInset }, style]}
      {...rest}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
