import { dayKey, formatDayName } from '@/utils/format';
import { getStockStatus } from '@/utils/stock';
import type { StockMovement, StockStatus, WarehouseItem } from '@/types/warehouse';

export interface WarehouseStats {
  totalItems: number;
  totalUnits: number;
  lowStockCount: number;
  totalValue: number;
  categoryCount: number;
}

export function getItemValue(item: WarehouseItem): number {
  return item.quantity * item.unitPrice;
}

export function getStats(items: WarehouseItem[]): WarehouseStats {
  let totalUnits = 0;
  let lowStockCount = 0;
  let totalValue = 0;

  for (const item of items) {
    totalUnits += item.quantity;
    totalValue += getItemValue(item);
    if (getStockStatus(item) !== 'ok') lowStockCount += 1;
  }

  return {
    totalItems: items.length,
    totalUnits,
    lowStockCount,
    totalValue,
    categoryCount: new Set(items.map((item) => item.category)).size,
  };
}

const STATUS_PRIORITY: Record<StockStatus, number> = { out: 0, low: 1, ok: 2 };

/** Items that need reordering, most urgent first. */
export function getLowStockItems(items: WarehouseItem[], limit?: number): WarehouseItem[] {
  const lowStock = items
    .filter((item) => getStockStatus(item) !== 'ok')
    .sort((a, b) => {
      const statusDiff = STATUS_PRIORITY[getStockStatus(a)] - STATUS_PRIORITY[getStockStatus(b)];
      if (statusDiff !== 0) return statusDiff;
      return a.quantity - b.quantity;
    });

  return limit ? lowStock.slice(0, limit) : lowStock;
}

export function getRecentMovements(movements: StockMovement[], limit = 5): StockMovement[] {
  return movements.slice(0, limit);
}

export interface ItemFilter {
  query?: string;
  status?: StockStatus | 'all';
}

export function filterItems(items: WarehouseItem[], filter: ItemFilter = {}): WarehouseItem[] {
  const query = filter.query?.trim().toLowerCase() ?? '';

  return items.filter((item) => {
    if (filter.status && filter.status !== 'all' && getStockStatus(item) !== filter.status) {
      return false;
    }
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  });
}

export interface MovementSection {
  title: string;
  data: StockMovement[];
}

export function groupMovementsByDay(movements: StockMovement[]): MovementSection[] {
  const today = dayKey(new Date().toISOString());
  const yesterday = dayKey(new Date(Date.now() - 86_400_000).toISOString());
  const sections: MovementSection[] = [];
  const indexByDay = new Map<string, number>();

  for (const movement of movements) {
    const key = dayKey(movement.createdAt);
    let index = indexByDay.get(key);

    if (index === undefined) {
      index = sections.length;
      indexByDay.set(key, index);
      const title = key === today ? 'Hari ini' : key === yesterday ? 'Kemarin' : formatDayName(movement.createdAt);
      sections.push({ title, data: [] });
    }

    sections[index].data.push(movement);
  }

  return sections;
}
