import type { AccentTint } from '@/constants/theme';
import type { IoniconName } from '@/constants/categories';
import type { MovementType, StockStatus, WarehouseItem } from '@/types/warehouse';

export function getStockStatus(item: Pick<WarehouseItem, 'quantity' | 'minQuantity'>): StockStatus {
  if (item.quantity <= 0) return 'out';
  if (item.quantity <= item.minQuantity) return 'low';
  return 'ok';
}

export const STOCK_STATUS_META: Record<StockStatus, { label: string; tint: AccentTint }> = {
  out: { label: 'Habis', tint: 'danger' },
  low: { label: 'Menipis', tint: 'warning' },
  ok: { label: 'Aman', tint: 'success' },
};

export interface MovementMeta {
  label: string;
  shortLabel: string;
  tint: AccentTint;
  icon: IoniconName;
}

export const MOVEMENT_META: Record<MovementType, MovementMeta> = {
  in: { label: 'Barang Masuk', shortLabel: 'Masuk', tint: 'success', icon: 'arrow-down-circle' },
  out: { label: 'Barang Keluar', shortLabel: 'Keluar', tint: 'danger', icon: 'arrow-up-circle' },
  adjustment: {
    label: 'Penyesuaian Stok',
    shortLabel: 'Penyesuaian',
    tint: 'primary',
    icon: 'swap-horizontal',
  },
};

/** Signed representation of a movement quantity, e.g. `+20`, `-5`. */
export function movementSign(type: MovementType): string {
  if (type === 'out') return '-';
  if (type === 'adjustment') return '';
  return '+';
}
