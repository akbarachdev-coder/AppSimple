import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Remove the default horizontal screen padding (e.g. when rendered inside a card). */
  inset?: boolean;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  inset = true,
}: FilterChipsProps<T>) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.content, !inset && styles.contentFlush]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: selected ? theme.primary : theme.backgroundElement,
                borderColor: selected ? theme.primary : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
            <Text
              style={[
                styles.label,
                { color: selected ? theme.onAccent : theme.textSecondary },
              ]}>
              {option.label}
            </Text>
            {option.count !== undefined ? (
              <View
                style={[
                  styles.count,
                  { backgroundColor: selected ? theme.onAccent : theme.backgroundSelected },
                ]}>
                <Text
                  style={[
                    styles.countLabel,
                    { color: selected ? theme.primary : theme.textSecondary },
                  ]}>
                  {option.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  contentFlush: {
    paddingHorizontal: 0,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  count: {
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
});
