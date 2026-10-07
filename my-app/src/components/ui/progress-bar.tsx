import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AccentTint } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  tint?: AccentTint;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ progress, tint = 'primary', style }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.min(Math.max(Number.isFinite(progress) ? progress : 0, 0), 1);

  return (
    <View
      style={[styles.track, { backgroundColor: theme.backgroundSelected }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <View
        style={[styles.fill, { backgroundColor: theme[tint], width: `${clamped * 100}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
