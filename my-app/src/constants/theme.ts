/**
 * Design tokens for the whole app: colors (light/dark), spacing, radius and shadows.
 * Components read these values through `useTheme()` / `useColorScheme()`.
 */

import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F4F6FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E7EDF9',
    textSecondary: '#64748B',
    border: '#E4E8EF',
    primary: '#2563EB',
    primarySoft: '#E8F0FE',
    success: '#16A34A',
    successSoft: '#E6F6EC',
    warning: '#D97706',
    warningSoft: '#FDF2E1',
    danger: '#DC2626',
    dangerSoft: '#FDECEC',
    neutral: '#475569',
    neutralSoft: '#EDF0F5',
    onAccent: '#FFFFFF',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0A0E15',
    backgroundElement: '#151B26',
    backgroundSelected: '#1E2735',
    textSecondary: '#94A3B8',
    border: '#232C3B',
    primary: '#60A5FA',
    primarySoft: '#16233A',
    success: '#4ADE80',
    successSoft: '#11251A',
    warning: '#FBBF24',
    warningSoft: '#2A2113',
    danger: '#F87171',
    dangerSoft: '#2B1618',
    neutral: '#94A3B8',
    neutralSoft: '#1E2735',
    onAccent: '#0A0E15',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export type AccentTint = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

/** Maps an accent tint to its soft (background) counterpart. */
export const AccentSoft: Record<AccentTint, ThemeColor> = {
  primary: 'primarySoft',
  success: 'successSoft',
  warning: 'warningSoft',
  danger: 'dangerSoft',
  neutral: 'neutralSoft',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const CardShadow: ViewStyle = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.07,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const MaxContentWidth = 720;
