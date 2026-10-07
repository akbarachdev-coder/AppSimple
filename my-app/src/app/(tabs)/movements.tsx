import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChips, type ChipOption } from '@/components/ui/filter-chips';
import { MovementRow } from '@/components/ui/movement-row';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { groupMovementsByDay } from '@/store/selectors';
import { useWarehouse } from '@/store/warehouse-context';
import { formatNumber } from '@/utils/format';
import type { MovementType } from '@/types/warehouse';

type TypeFilter = 'all' | MovementType;

const FILTER_OPTIONS: ChipOption<TypeFilter>[] = [
  { value: 'all', label: 'Semua' },
  { value: 'in', label: 'Masuk' },
  { value: 'out', label: 'Keluar' },
  { value: 'adjustment', label: 'Penyesuaian' },
];

export default function MovementsScreen() {
  const theme = useTheme();
  const { movements } = useWarehouse();
  const [type, setType] = useState<TypeFilter>('all');

  const counts = useMemo(() => {
    const base: Record<TypeFilter, number> = { all: movements.length, in: 0, out: 0, adjustment: 0 };
    for (const movement of movements) base[movement.type] += 1;
    return base;
  }, [movements]);

  const sections = useMemo(() => {
    const filtered = type === 'all' ? movements : movements.filter((m) => m.type === type);
    return groupMovementsByDay(filtered);
  }, [movements, type]);

  return (
    <Screen>
      <ScreenHeader
        title="Mutasi Stok"
        subtitle={`${formatNumber(movements.length)} catatan transaksi gudang`}
      />

      <FilterChips
        options={FILTER_OPTIONS.map((option) => ({ ...option, count: counts[option.value] }))}
        value={type}
        onChange={setType}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovementRow movement={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="swap-horizontal"
            title="Belum ada mutasi"
            message="Setiap barang masuk, keluar, dan penyesuaian stok akan tercatat di sini."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
});
