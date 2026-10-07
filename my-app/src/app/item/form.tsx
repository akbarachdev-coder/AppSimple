import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterChips, type ChipOption } from '@/components/ui/filter-chips';
import { FormField } from '@/components/ui/form-field';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useWarehouse } from '@/store/warehouse-context';
import type {
  ItemCategory,
  ItemUnit,
  WarehouseItem,
  WarehouseItemInput,
} from '@/types/warehouse';

interface FormState {
  name: string;
  sku: string;
  category: ItemCategory;
  quantity: string;
  minQuantity: string;
  unit: ItemUnit;
  unitPrice: string;
  location: string;
  supplier: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: '',
  sku: '',
  category: 'elektronik',
  quantity: '0',
  minQuantity: '0',
  unit: 'pcs',
  unitPrice: '',
  location: '',
  supplier: '',
  description: '',
};

const CATEGORY_CHIPS: ChipOption<ItemCategory>[] = CATEGORY_OPTIONS;
const UNIT_CHIPS: ChipOption<ItemUnit>[] = UNIT_OPTIONS;

function toFormState(item: WarehouseItem): FormState {
  return {
    name: item.name,
    sku: item.sku,
    category: item.category,
    quantity: String(item.quantity),
    minQuantity: String(item.minQuantity),
    unit: item.unit,
    unitPrice: String(item.unitPrice),
    location: item.location,
    supplier: item.supplier,
    description: item.description,
  };
}

function parseCount(value: string): number | null {
  const normalized = value.replace(/\./g, '').replace(',', '.').trim();
  if (normalized === '') return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

function FieldLabel({ children }: { children: string }) {
  const theme = useTheme();

  return (
    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{children}</Text>
  );
}

export default function ItemFormScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { getItem, addItem, updateItem, items } = useWarehouse();

  const existing = getItem(params.id);
  const [form, setForm] = useState<FormState>(() =>
    existing ? toFormState(existing) : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    const name = form.name.trim();

    if (name.length < 2) next.name = 'Nama barang wajib diisi (min. 2 karakter).';

    const sku = form.sku.trim().toUpperCase();
    if (sku) {
      const duplicated = items.some(
        (item) => item.id !== existing?.id && item.sku.toUpperCase() === sku,
      );
      if (duplicated) next.sku = 'SKU sudah dipakai oleh barang lain.';
    }

    if (parseCount(form.quantity) === null) next.quantity = 'Stok awal tidak valid (angka ≥ 0).';
    if (parseCount(form.minQuantity) === null) next.minQuantity = 'Stok minimum tidak valid (angka ≥ 0).';
    if (parseCount(form.unitPrice) === null) next.unitPrice = 'Harga satuan tidak valid (angka ≥ 0).';

    return next;
  }

  function buildInput(quantity: number, sku: string): WarehouseItemInput {
    return {
      name: form.name.trim(),
      sku,
      category: form.category,
      quantity,
      minQuantity: parseCount(form.minQuantity) ?? 0,
      unit: form.unit,
      unitPrice: parseCount(form.unitPrice) ?? 0,
      location: form.location.trim(),
      supplier: form.supplier.trim(),
      description: form.description.trim(),
    };
  }

  function generateSku(name: string): string {
    const letters = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'ITM';
    let candidate = '';
    do {
      candidate = `${letters}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (items.some((item) => item.sku.toUpperCase() === candidate));
    return candidate;
  }

  function handleSave() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const quantity = parseCount(form.quantity) ?? 0;
    const sku = form.sku.trim().toUpperCase() || generateSku(form.name.trim());
    const input = buildInput(quantity, sku);

    if (existing) updateItem(existing.id, input);
    else addItem(input);

    router.back();
  }

  return (
    <Screen>
      <ScreenHeader
        title={existing ? 'Ubah Barang' : 'Tambah Barang'}
        subtitle={existing ? existing.sku : 'Lengkapi data barang masuk gudang'}
        onBack={() => router.back()}
        backIcon="close"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <FormField
              label="Nama barang"
              value={form.name}
              onChangeText={(value) => update('name', value)}
              placeholder="Contoh: Kabel HDMI 2 Meter"
              error={errors.name}
              autoCapitalize="words"
            />
            <FormField
              label="SKU"
              value={form.sku}
              onChangeText={(value) => update('sku', value.toUpperCase())}
              placeholder="Otomatis jika dikosongkan"
              error={errors.sku}
              hint="Kosongkan agar SKU dibuat otomatis."
              autoCapitalize="characters"
            />
            <View>
              <FieldLabel>Kategori</FieldLabel>
              <FilterChips
                inset={false}
                options={CATEGORY_CHIPS}
                value={form.category}
                onChange={(value) => update('category', value)}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FormField
                  label="Stok awal"
                  value={form.quantity}
                  onChangeText={(value) => update('quantity', value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  keyboardType="number-pad"
                  error={errors.quantity}
                />
              </View>
              <View style={styles.rowItem}>
                <FormField
                  label="Stok minimum"
                  value={form.minQuantity}
                  onChangeText={(value) => update('minQuantity', value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  keyboardType="number-pad"
                  error={errors.minQuantity}
                />
              </View>
            </View>

            <FormField
              label="Harga satuan"
              value={form.unitPrice}
              onChangeText={(value) => update('unitPrice', value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              keyboardType="number-pad"
              prefix="Rp"
              error={errors.unitPrice}
            />

            <View>
              <FieldLabel>Satuan</FieldLabel>
              <FilterChips
                inset={false}
                options={UNIT_CHIPS}
                value={form.unit}
                onChange={(value) => update('unit', value)}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <FormField
              label="Lokasi rak"
              value={form.location}
              onChangeText={(value) => update('location', value.toUpperCase())}
              placeholder="Contoh: A-01-2"
              autoCapitalize="characters"
            />
            <FormField
              label="Supplier"
              value={form.supplier}
              onChangeText={(value) => update('supplier', value)}
              placeholder="Contoh: PT Sinar Elektronik"
              autoCapitalize="words"
            />
            <FormField
              label="Deskripsi"
              value={form.description}
              onChangeText={(value) => update('description', value)}
              placeholder="Catatan singkat tentang barang"
              multiline
            />
          </Card>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
              paddingBottom: Math.max(insets.bottom, Spacing.three),
            },
          ]}>
          <Button
            label={existing ? 'Simpan Perubahan' : 'Simpan Barang'}
            icon="checkmark"
            size="lg"
            fullWidth
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rowItem: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginLeft: Spacing.one,
    marginBottom: Spacing.one,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
