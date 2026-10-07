import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { seedItems, seedMovements } from '@/data/seed';
import type {
  StockMovement,
  WarehouseItem,
  WarehouseItemInput,
} from '@/types/warehouse';
import { createId } from '@/utils/id';

const STORAGE_KEY = '@manajemen-gudang/v1';

interface PersistedState {
  items: WarehouseItem[];
  movements: StockMovement[];
}

interface State extends PersistedState {
  hydrated: boolean;
}

type Action =
  | { type: 'hydrate'; payload: PersistedState }
  | { type: 'addItem'; payload: { item: WarehouseItem; movement: StockMovement | null } }
  | {
      type: 'updateItem';
      payload: { id: string; input: WarehouseItemInput; movement: StockMovement | null };
    }
  | { type: 'removeItem'; payload: { id: string } }
  | { type: 'stockMovement'; payload: { movement: StockMovement; delta: number } };

const initialState: State = { items: [], movements: [], hydrated: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...action.payload, hydrated: true };

    case 'addItem': {
      const { item, movement } = action.payload;
      return {
        ...state,
        items: [item, ...state.items],
        movements: movement ? [movement, ...state.movements] : state.movements,
      };
    }

    case 'updateItem': {
      const { id, input, movement } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...input, updatedAt: new Date().toISOString() } : item,
        ),
        movements: movement ? [movement, ...state.movements] : state.movements,
      };
    }

    case 'removeItem':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };

    case 'stockMovement': {
      const { movement, delta } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === movement.itemId
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
                updatedAt: movement.createdAt,
              }
            : item,
        ),
        movements: [movement, ...state.movements],
      };
    }

    default:
      return state;
  }
}

export interface StockMovementInput {
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  note: string;
}

export interface WarehouseContextValue extends PersistedState {
  hydrated: boolean;
  getItem: (id?: string) => WarehouseItem | undefined;
  movementsFor: (itemId: string) => StockMovement[];
  addItem: (input: WarehouseItemInput) => WarehouseItem;
  updateItem: (id: string, input: WarehouseItemInput) => void;
  removeItem: (id: string) => void;
  recordStockMovement: (input: StockMovementInput) => void;
}

const WarehouseContext = createContext<WarehouseContextValue | null>(null);

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      let payload: PersistedState = { items: seedItems, movements: seedMovements };
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Partial<PersistedState>) : null;
        if (parsed && Array.isArray(parsed.items) && Array.isArray(parsed.movements)) {
          payload = { items: parsed.items, movements: parsed.movements };
        }
      } catch {
        // Corrupted or unavailable storage: fall back to the seed data.
      }
      if (!cancelled) dispatch({ type: 'hydrate', payload });
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const payload: PersistedState = { items: state.items, movements: state.movements };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [state.hydrated, state.items, state.movements]);

  const getItem = useCallback(
    (id?: string) => (id ? state.items.find((item) => item.id === id) : undefined),
    [state.items],
  );

  const movementsFor = useCallback(
    (itemId: string) => state.movements.filter((movement) => movement.itemId === itemId),
    [state.movements],
  );

  const addItem = useCallback((input: WarehouseItemInput) => {
    const now = new Date().toISOString();
    const item: WarehouseItem = { ...input, id: createId('itm-'), createdAt: now, updatedAt: now };
    const movement: StockMovement | null =
      item.quantity > 0
        ? {
            id: createId('mov-'),
            itemId: item.id,
            itemName: item.name,
            type: 'in',
            quantity: item.quantity,
            note: 'Stok awal',
            createdAt: now,
          }
        : null;
    dispatch({ type: 'addItem', payload: { item, movement } });
    return item;
  }, []);

  const updateItem = useCallback(
    (id: string, input: WarehouseItemInput) => {
      const existing = state.items.find((item) => item.id === id);
      if (!existing) return;

      const delta = input.quantity - existing.quantity;
      const movement: StockMovement | null =
        delta !== 0
          ? {
              id: createId('mov-'),
              itemId: id,
              itemName: input.name,
              type: 'adjustment',
              quantity: delta,
              note: 'Penyesuaian saat edit barang',
              createdAt: new Date().toISOString(),
            }
          : null;

      dispatch({ type: 'updateItem', payload: { id, input, movement } });
    },
    [state.items],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'removeItem', payload: { id } });
  }, []);

  const recordStockMovement = useCallback(
    ({ itemId, type, quantity, note }: StockMovementInput) => {
      const item = state.items.find((entry) => entry.id === itemId);
      if (!item) return;

      const movement: StockMovement = {
        id: createId('mov-'),
        itemId,
        itemName: item.name,
        type,
        quantity,
        note,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: 'stockMovement',
        payload: { movement, delta: type === 'in' ? quantity : -quantity },
      });
    },
    [state.items],
  );

  const value = useMemo<WarehouseContextValue>(
    () => ({
      hydrated: state.hydrated,
      items: state.items,
      movements: state.movements,
      getItem,
      movementsFor,
      addItem,
      updateItem,
      removeItem,
      recordStockMovement,
    }),
    [
      state.hydrated,
      state.items,
      state.movements,
      getItem,
      movementsFor,
      addItem,
      updateItem,
      removeItem,
      recordStockMovement,
    ],
  );

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>;
}

export function useWarehouse(): WarehouseContextValue {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse harus dipakai di dalam <WarehouseProvider>');
  }
  return context;
}
