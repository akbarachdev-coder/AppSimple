import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { IoniconName } from '@/constants/categories';
import { Spacing, type AccentTint } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { IconTile } from '@/components/ui/icon-tile';
import { ItemRow } from '@/components/ui/item-row';
import { MovementRow } from '@/components/ui/movement-row';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import {
  getLowStockItems,
  getRecentMovements,
  getStats,
} from '@/store/selectors';
import { useWarehouse } from '@/store/warehouse-context';
import { formatDayName, formatNumber, formatRupiah } from '@/utils/format';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { items, movements } = useWarehouse();

  const stats = useMemo(() => getStats(items), [items]);
  const lowStock = useMemo(() => getLowStockItems(items, 4), [items]);
  const recent = useMemo(() => getRecentMovements(movements, 5), [movements]);

  const now = new Date();
  const greeting =
    now.getHours() < 11
      ? 'Selamat pagi'
      : now.getHours() < 15
        ? 'Selamat siang'
        : now.getHours() < 18
          ? 'Selamat sore'
          : 'Selamat malam';

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.greeting}>
          <IconTile name="business-outline" tint="primary" size="lg" />
          <View style={styles.greetingText}>
            <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>{greeting}</Text>
            <Text style={[styles.greetingTitle, { color: theme.text }]}>Gudang Utama</Text>
            <Text style={[styles.greetingDate, { color: theme.textSecondary }]}>
              {formatDayName(now.toISOString())}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <StatCard
            icon="cube-outline"
            tint="primary"
            label="Total SKU"
            value={formatNumber(stats.totalItems)}
            caption={`${stats.categoryCount} kategori aktif`}
          />
          <StatCard
            icon="layers-outline"
            tint="neutral"
            label="Total Unit"
            value={formatNumber(stats.totalUnits)}
            caption="unit tersimpan"
          />
          <StatCard
            icon="alert-circle-outline"
            tint="warning"
            label="Stok Menipis"
            value={formatNumber(stats.lowStockCount)}
            caption="barang perlu restock"
          />
          <StatCard
            icon="wallet-outline"
            tint="success"
            label="Nilai Stok"
            value={formatRupiah(stats.totalValue, { compact: true })}
            caption={formatRupiah(stats.totalValue)}
          />
        </View>

        <View>
          <SectionHeader title="Aksi Cepat" />
          <View style={styles.actions}>
            <QuickAction
              icon="add-circle-outline"
              tint="primary"
              label="Tambah Barang"
              onPress={() => router.push({ pathname: '/item/form' })}
            />
            <QuickAction
              icon="alert-circle-outline"
              tint="warning"
              label="Stok Menipis"
              onPress={() =>
                router.navigate({ pathname: '/items', params: { filter: 'restock' } })
              }
            />
            <QuickAction
              icon="swap-horizontal"
              tint="neutral"
              label="Riwayat Mutasi"
              onPress={() => router.navigate('/movements')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Stok Menipis"
            caption="Barang yang perlu segera di-restock"
            actionLabel="Lihat semua"
            onAction={() =>
              router.navigate({ pathname: '/items', params: { filter: 'restock' } })
            }
          />
          {lowStock.length > 0 ? (
            <View style={styles.list}>
              {lowStock.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
                />
              ))}
            </View>
          ) : (
            <Card style={styles.emptyCard}>
              <EmptyState
                icon="checkmark-circle-outline"
                title="Semua stok aman"
                message="Tidak ada barang yang melewati batas minimum."
              />
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Mutasi Terakhir"
            caption="Aktivitas gudang terbaru"
            actionLabel="Lihat semua"
            onAction={() => router.navigate('/movements')}
          />
          <Card style={styles.movementCard}>
            {recent.length > 0 ? (
              recent.map((movement, index) => (
                <View key={movement.id}>
                  {index > 0 ? <View style={[styles.divider, { backgroundColor: theme.border }]} /> : null}
                  <MovementRow movement={movement} />
                </View>
              ))
            ) : (
              <EmptyState
                icon="swap-horizontal"
                title="Belum ada mutasi"
                message="Catatan barang masuk dan keluar akan tampil di sini."
              />
            )}
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function QuickAction({
  icon,
  tint,
  label,
  onPress,
}: {
  icon: IoniconName;
  tint: AccentTint;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.actionWrap, { opacity: pressed ? 0.75 : 1 }]}>
      <Card style={styles.actionCard}>
        <IconTile name={icon} tint={tint} />
        <Text style={[styles.actionLabel, { color: theme.text }]} numberOfLines={2}>
          {label}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  greetingText: {
    flex: 1,
    gap: 1,
  },
  greetingLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  greetingTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  greetingDate: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionWrap: {
    flex: 1,
  },
  actionCard: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  actionLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    gap: Spacing.two + 4,
  },
  list: {
    gap: Spacing.two,
  },
  emptyCard: {
    paddingVertical: Spacing.two,
  },
  movementCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
