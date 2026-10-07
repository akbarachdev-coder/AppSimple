import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChips, type ChipOption } from '@/components/ui/filter-chips';
import { ItemRow } from '@/components/ui/item-row';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchBar } from '@/components/ui/search-bar';
import { filterItems } from '@/store/selectors';
import { useWarehouse } from '@/store/warehouse-context';
import { getStockStatus } from '@/utils/stock';

type StatusFilter = 'all' | 'restock' | 'ok' | 'low' | 'out';

const FILTER_OPTIONS: ChipOption<StatusFilter>[] = [
  { value: 'all', label: 'Semua' },
  { value: 'restock', label: 'Perlu Restock' },
  { value: 'ok', label: 'Aman' },
  { value: 'low', label: 'Menipis' },
  { value: 'out', label: 'Habis' },
];

function normalizeFilter(value?: string): StatusFilter {
  return value === 'restock' || value === 'ok' || value === 'low' || value === 'out'
    ? value
    : 'all';
}

export default function ItemsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { items } = useWarehouse();
  const params = useLocalSearchParams<{ filter?: string }>();

  const [query, setQuery] = useState('');
  // The active filter lives in the route params so it can be deep-linked from other screens.
  const status = normalizeFilter(params.filter);

  const searched = useMemo(() => filterItems(items, { query }), [items, query]);

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: searched.length,
      restock: 0,
      ok: 0,
      low: 0,
      out: 0,
    };
    for (const item of searched) base[getStockStatus(item)] += 1;
    base.restock = base.low + base.out;
    return base;
  }, [searched]);

  const results = useMemo(() => {
    if (status === 'all') return searched;
    if (status === 'restock') return searched.filter((item) => getStockStatus(item) !== 'ok');
    return searched.filter((item) => getStockStatus(item) === status);
  }, [searched, status]);

  return (
    <Screen>
      <ScreenHeader
        title="Barang"
        subtitle={`${items.length} SKU terdaftar di gudang`}
        actions={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah barang"
            onPress={() => router.push({ pathname: '/item/form' })}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}>
            <Ionicons name="add" size={24} color={theme.onAccent} />
          </Pressable>
        }
      />

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Cari nama, SKU, atau supplier..." />
      </View>

      <FilterChips
        options={FILTER_OPTIONS.map((option) => ({ ...option, count: counts[option.value] }))}
        value={status}
        onChange={(value) => void router.setParams({ filter: value })}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
            Menampilkan {results.length} dari {items.length} barang
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Barang tidak ditemukan"
            message="Coba ubah kata kunci atau pilih filter status stok lainnya."
            actionLabel="Reset filter"
            onAction={() => {
              setQuery('');
              void router.setParams({ filter: 'all' });
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.one,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  resultCount: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
