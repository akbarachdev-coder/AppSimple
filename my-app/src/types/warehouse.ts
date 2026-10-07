/** Domain model for the warehouse management feature. */

export const ITEM_CATEGORIES = [
  'elektronik',
  'pakaian',
  'makanan',
  'peralatan',
  'kesehatan',
  'lainnya',
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const ITEM_UNITS = [
  'pcs',
  'box',
  'dus',
  'sak',
  'botol',
  'set',
  'rim',
  'kg',
  'liter',
  'lusin',
] as const;
export type ItemUnit = (typeof ITEM_UNITS)[number];

/** `out` = stok habis, `low` = stok menyentuh batas minimum, `ok` = aman. */
export type StockStatus = 'out' | 'low' | 'ok';

export type MovementType = 'in' | 'out' | 'adjustment';

export interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  minQuantity: number;
  unit: ItemUnit;
  unitPrice: number;
  location: string;
  supplier: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Input used when creating or updating an item (id/timestamps handled by the store). */
export type WarehouseItemInput = Omit<WarehouseItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface StockMovement {
  id: string;
  itemId: string;
  /** Kept on purpose so history stays readable after an item is removed. */
  itemName: string;
  type: MovementType;
  /**
   * Quantity of the movement:
   * - `in`: always positive
   * - `out`: always positive (the UI renders it with a `-` sign)
   * - `adjustment`: signed delta (can be negative)
   */
  quantity: number;
  note: string;
  createdAt: string;
}
