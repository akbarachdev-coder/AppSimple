import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CATEGORY_META } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { IconTile } from '@/components/ui/icon-tile';
import { IconButton } from '@/components/ui/icon-button';
import { MovementRow } from '@/components/ui/movement-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { StockAdjustSheet } from '@/components/ui/stock-adjust-sheet';
import { getItemValue } from '@/store/selectors';
import { useWarehouse } from '@/store/warehouse-context';
import { formatDate, formatNumber, formatRupiah } from '@/utils/format';
import { getStockStatus, STOCK_STATUS_META } from '@/utils/stock';
import { confirmAction } from '@/utils/confirm';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { getItem, movementsFor, removeItem, recordStockMovement } = useWarehouse();
  const [sheet, setSheet] = useState<'in' | 'out' | null>(null);

  const item = getItem(id);
  const history = useMemo(
    () => (item ? movementsFor(item.id).slice(0, 8) : []),
    [item, movementsFor],
  );

  if (!item) {
    return (
      <Screen>
        <ScreenHeader title="Barang" onBack={() => router.back()} />
        <EmptyState
          icon="alert-circle-outline"
          title="Barang tidak ditemukan"
          message="Barang ini mungkin sudah dihapus dari gudang."
          actionLabel="Kembali"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const meta = CATEGORY_META[item.category];
  const status = getStockStatus(item);
  const statusMeta = STOCK_STATUS_META[status];
  const target = Math.max(item.minQuantity * 2, 1);
  const progress = item.quantity / target;
  const sheetType = sheet ?? 'out';

  async function handleDelete() {
    const confirmed = await confirmAction({
      title: 'Hapus barang?',
      message: `"${item?.name}" akan dihapus dari daftar gudang. Riwayat mutasi tetap disimpan.`,
      confirmLabel: 'Hapus',
      destructive: true,
    });

    if (confirmed && item) {
      removeItem(item.id);
      router.back();
    }
  }

  return (
    <Screen>
      <ScreenHeader
        title={item.name}
        subtitle={`${item.sku} · ${meta.label}`}
        onBack={() => router.back()}
        actions={
          <>
            <IconButton
              icon="create-outline"
              accessibilityLabel="Ubah barang"
              onPress={() => router.push({ pathname: '/item/form', params: { id: item.id } })}
            />
            <IconButton
              icon="trash-outline"
              accessibilityLabel="Hapus barang"
              onPress={() => void handleDelete()}
            />
          </>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <IconTile name={meta.icon} tint={meta.tint} size="lg" />
            <View style={styles.heroIdentity}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.sku, { color: theme.textSecondary }]}>
                {item.sku} · {meta.label}
              </Text>
            </View>
            <StatusBadge status={status} />
          </View>

          <View style={styles.stockRow}>
            <View style={styles.stockValue}>
              <Text style={[styles.quantity, { color: theme.text }]}>
                {formatNumber(item.quantity)}
              </Text>
              <Text style={[styles.unit, { color: theme.textSecondary }]}>{item.unit}</Text>
            </View>
            <View style={styles.stockTarget}>
              <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>Minimum stok</Text>
              <Text style={[styles.targetValue, { color: theme.text }]}>
                {formatNumber(item.minQuantity)} {item.unit}
              </Text>
            </View>
          </View>

          <ProgressBar progress={progress} tint={statusMeta.tint} />
          <View style={styles.progressMeta}>
            <Text style={[styles.caption, { color: theme[statusMeta.tint] }]}>{statusMeta.label}</Text>
            <Text style={[styles.caption, { color: theme.textSecondary }]}>
              Target aman {formatNumber(target)} {item.unit}
            </Text>
          </View>
        </Card>

        <View style={styles.actionRow}>
          <Button
            label="Barang Masuk"
            icon="arrow-down"
            variant="success"
            size="lg"
            fullWidth
            onPress={() => setSheet('in')}
          />
          <Button
            label="Barang Keluar"
            icon="arrow-up"
            variant="danger"
            size="lg"
            fullWidth
            onPress={() => setSheet('out')}
          />
        </View>

        <Card style={styles.infoCard}>
          <InfoRow label="Harga satuan" value={formatRupiah(item.unitPrice)} />
          <InfoRow label="Nilai persediaan" value={formatRupiah(getItemValue(item))} divider />
          <InfoRow label="Lokasi rak" value={item.location || '-'} divider />
          <InfoRow label="Supplier" value={item.supplier || '-'} divider />
          <InfoRow label="Terakhir diperbarui" value={formatDate(item.updatedAt)} divider />
        </Card>

        {item.description ? (
          <Card style={styles.descriptionCard}>
            <SectionHeader title="Tentang barang" />
            <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
          </Card>
        ) : null}

        <View style={styles.historySection}>
          <SectionHeader title="Riwayat Mutasi" caption={`${history.length} catatan terakhir`} />
          <Card style={styles.historyCard}>
            {history.length > 0 ? (
              history.map((movement, index) => (
                <View key={movement.id}>
                  {index > 0 ? (
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  ) : null}
                  <MovementRow movement={movement} showItemName={false} />
                </View>
              ))
            ) : (
              <EmptyState
                icon="swap-horizontal"
                title="Belum ada mutasi"
                message="Catat barang masuk atau keluar untuk memulai riwayat."
              />
            )}
          </Card>
        </View>
      </ScrollView>

      <StockAdjustSheet
        visible={sheet !== null}
        type={sheetType}
        item={item}
        onClose={() => setSheet(null)}
        onSubmit={(quantity, note) => {
          recordStockMovement({ itemId: item.id, type: sheetType, quantity, note });
          setSheet(null);
        }}
      />
    </Screen>
  );
}

function InfoRow({ label, value, divider = false }: { label: string; value: string; divider?: boolean }) {
  const theme = useTheme();

  return (
    <View>
      {divider ? <View style={[styles.divider, { backgroundColor: theme.border }]} /> : null}
      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  hero: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroIdentity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  sku: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  stockValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  quantity: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
  },
  unit: {
    fontSize: 15,
    fontWeight: '600',
  },
  stockTarget: {
    alignItems: 'flex-end',
    gap: 1,
  },
  targetLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  targetValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  infoCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 4,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  descriptionCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  historySection: {
    gap: Spacing.two + 4,
  },
  historyCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
