import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { IconButton } from '@/components/ui/icon-button';
import { formatNumber } from '@/utils/format';
import { CATEGORY_META } from '@/constants/categories';
import type { WarehouseItem } from '@/types/warehouse';

interface StockAdjustSheetProps {
  visible: boolean;
  type: 'in' | 'out';
  item: WarehouseItem;
  onClose: () => void;
  onSubmit: (quantity: number, note: string) => void;
}

const QUICK_STEPS = [1, 5, 10, 50];

export function StockAdjustSheet({ visible, type, item, onClose, onSubmit }: StockAdjustSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setQuantity('1');
    setNote('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const parsed = Number(quantity);
  const isValid = Number.isInteger(parsed) && parsed >= 1;
  const exceedsStock = type === 'out' && isValid && parsed > item.quantity;
  const nextStock = type === 'in' ? item.quantity + (isValid ? parsed : 0) : item.quantity - (isValid ? parsed : 0);
  const isOut = type === 'out';
  const meta = CATEGORY_META[item.category];

  function applyStep(step: number) {
    const current = Number.isFinite(parsed) ? parsed : 0;
    setQuantity(String(Math.max(1, current + step)));
    setError(null);
  }

  function submit() {
    if (!isValid) {
      setError('Masukkan jumlah bilangan bulat minimal 1.');
      return;
    }
    if (exceedsStock) {
      setError(`Jumlah melebihi stok tersedia (${formatNumber(item.quantity)} ${item.unit}).`);
      return;
    }
    const submittedNote = note.trim();
    reset();
    onSubmit(parsed, submittedNote);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={handleClose} accessibilityLabel="Tutup" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.backgroundElement,
                paddingBottom: Math.max(insets.bottom, Spacing.three),
              },
            ]}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {isOut ? 'Barang Keluar' : 'Barang Masuk'}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {isOut ? 'Kurangi stok gudang' : 'Tambah stok gudang'}
                </Text>
              </View>
              <IconButton icon="close" onPress={handleClose} accessibilityLabel="Tutup" />
            </View>

            <Card style={styles.itemCard}>
              <IconTile name={meta.icon} tint={meta.tint} />
              <View style={styles.itemBody}>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.itemMeta, { color: theme.textSecondary }]}>
                  {item.sku} · Stok {formatNumber(item.quantity)} {item.unit}
                </Text>
              </View>
            </Card>

            <View style={styles.stepper}>
              <Pressable
                accessibilityLabel="Kurangi"
                onPress={() => applyStep(-1)}
                disabled={!isValid || parsed <= 1}
                style={({ pressed }) => [
                  styles.stepButton,
                  {
                    backgroundColor: theme.backgroundSelected,
                    opacity: !isValid || parsed <= 1 ? 0.4 : pressed ? 0.7 : 1,
                  },
                ]}>
                <Ionicons name="remove" size={24} color={theme.text} />
              </Pressable>

              <View style={[styles.valueWrap, { borderColor: error ? theme.danger : theme.border }]}>
                <TextInput
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text.replace(/[^0-9]/g, ''));
                    setError(null);
                  }}
                  keyboardType="number-pad"
                  style={[styles.value, { color: theme.text }]}
                  textAlign="center"
                  accessibilityLabel="Jumlah"
                />
                <Text style={[styles.unit, { color: theme.textSecondary }]}>{item.unit}</Text>
              </View>

              <Pressable
                accessibilityLabel="Tambah"
                onPress={() => applyStep(1)}
                style={({ pressed }) => [
                  styles.stepButton,
                  { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.7 : 1 },
                ]}>
                <Ionicons name="add" size={24} color={theme.text} />
              </Pressable>
            </View>

            <View style={styles.quickRow}>
              {QUICK_STEPS.map((step) => (
                <Pressable
                  key={step}
                  onPress={() => setQuantity(String(step))}
                  style={({ pressed }) => [
                    styles.quickChip,
                    {
                      backgroundColor: theme.backgroundSelected,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}>
                  <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>{step}</Text>
                </Pressable>
              ))}
              <Text style={[styles.preview, { color: theme.textSecondary }]}>
                → {formatNumber(Math.max(0, nextStock))} {item.unit}
              </Text>
            </View>

            <View style={styles.noteField}>
              <Text style={[styles.noteLabel, { color: theme.textSecondary }]}>Catatan (opsional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={isOut ? 'Contoh: Pengiriman ke toko cabang' : 'Contoh: Penerimaan PO #2026-015'}
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.noteInput,
                  { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
                ]}
                multiline
              />
            </View>

            {error ? (
              <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
            ) : null}

            <Button
              label={isOut ? 'Simpan Barang Keluar' : 'Simpan Barang Masuk'}
              variant={isOut ? 'danger' : 'success'}
              size="lg"
              fullWidth
              onPress={submit}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 12, 20, 0.55)',
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrap: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.two,
  },
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    minWidth: 60,
    padding: 0,
  },
  unit: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  quickChip: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
  quickLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  preview: {
    marginLeft: 'auto',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  noteField: {
    gap: Spacing.one + 2,
  },
  noteLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginLeft: Spacing.one,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginLeft: Spacing.one,
  },
});
