import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { IoniconName } from '@/constants/categories';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IoniconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const SIZES: Record<ButtonSize, { paddingV: number; paddingH: number; font: number; icon: number }> = {
  sm: { paddingV: 8, paddingH: 14, font: 14, icon: 16 },
  md: { paddingV: 12, paddingH: 18, font: 15, icon: 18 },
  lg: { paddingV: 15, paddingH: 22, font: 16, icon: 20 },
};

const PALETTE: Record<
  ButtonVariant,
  { background: ThemeColor | 'transparent'; text: ThemeColor; border: ThemeColor | 'transparent' }
> = {
  primary: { background: 'primary', text: 'onAccent', border: 'transparent' },
  success: { background: 'success', text: 'onAccent', border: 'transparent' },
  danger: { background: 'danger', text: 'onAccent', border: 'transparent' },
  secondary: { background: 'backgroundSelected', text: 'text', border: 'transparent' },
  outline: { background: 'transparent', text: 'primary', border: 'primary' },
  ghost: { background: 'transparent', text: 'textSecondary', border: 'transparent' },
};

function resolveColor(theme: Record<ThemeColor, string>, key: ThemeColor | 'transparent'): string {
  return key === 'transparent' ? 'transparent' : theme[key];
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useTheme();
  const dims = SIZES[size];
  const palette = PALETTE[variant];
  const textColor = theme[palette.text];
  const gap = icon ? Spacing.two : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: resolveColor(theme, palette.background),
          borderColor: resolveColor(theme, palette.border),
          paddingVertical: dims.paddingV,
          paddingHorizontal: dims.paddingH,
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {icon && iconPosition === 'left' ? (
        <Ionicons name={icon} size={dims.icon} color={textColor} style={{ marginRight: gap }} />
      ) : null}
      <Text style={[styles.label, { color: textColor, fontSize: dims.font }]}>{label}</Text>
      {icon && iconPosition === 'right' ? (
        <Ionicons name={icon} size={dims.icon} color={textColor} style={{ marginLeft: gap }} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: '600',
    lineHeight: 22,
  },
});
