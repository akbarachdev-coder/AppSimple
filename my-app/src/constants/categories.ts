import type { ComponentProps } from 'react';

import type { Ionicons } from '@expo/vector-icons';

import type { AccentTint } from '@/constants/theme';
import { ITEM_CATEGORIES, ITEM_UNITS, type ItemCategory, type ItemUnit } from '@/types/warehouse';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface CategoryMeta {
  label: string;
  icon: IoniconName;
  tint: AccentTint;
}

export const CATEGORY_META: Record<ItemCategory, CategoryMeta> = {
  elektronik: { label: 'Elektronik', icon: 'hardware-chip-outline', tint: 'primary' },
  pakaian: { label: 'Pakaian', icon: 'shirt-outline', tint: 'warning' },
  makanan: { label: 'Makanan & Minuman', icon: 'fast-food-outline', tint: 'success' },
  peralatan: { label: 'Peralatan', icon: 'construct-outline', tint: 'neutral' },
  kesehatan: { label: 'Kesehatan', icon: 'medkit-outline', tint: 'danger' },
  lainnya: { label: 'Lainnya', icon: 'cube-outline', tint: 'primary' },
};

export const CATEGORY_OPTIONS = ITEM_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_META[value].label,
}));

export const UNIT_OPTIONS = ITEM_UNITS.map((value) => ({ value, label: value }));

export type { ItemCategory, ItemUnit };
