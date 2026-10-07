import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  blurOnSubmit?: TextInputProps['blurOnSubmit'];
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  prefix,
  suffix,
  multiline = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}: FormFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.danger
    : focused
      ? theme.primary
      : theme.border;

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: theme.backgroundElement, borderColor },
          multiline && styles.multilineWrap,
        ]}>
        {prefix ? (
          <Text style={[styles.affix, { color: theme.textSecondary }]}>{prefix}</Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }, multiline && styles.multiline]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
        />
        {suffix ? (
          <Text style={[styles.affix, { color: theme.textSecondary }]}>{suffix}</Text>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.message, { color: theme.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one + 2,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginLeft: Spacing.one,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
  },
  multilineWrap: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
  },
  multiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  affix: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    marginLeft: Spacing.one,
  },
});
