# Manajemen Gudang

Aplikasi manajemen gudang (inventory) dibangun dengan **Expo SDK 57 + React Native + TypeScript** dan navigasi **Expo Router**.

## Fitur

- **Beranda** — ringkasan gudang: total SKU, total unit, barang stok menipis, nilai persediaan, aksi cepat, daftar restock, dan mutasi terakhir.
- **Barang** — pencarian (nama, SKU, supplier, lokasi), filter status stok dengan hitungan, dan tombol tambah barang.
- **Detail Barang** — status stok, progress terhadap batas minimum, informasi harga/lokasi/supplier, serta **Barang Masuk** dan **Barang Keluar** lewat bottom sheet.
- **Mutasi Stok** — riwayat transaksi dikelompokkan per hari dengan filter Masuk / Keluar / Penyesuaian.
- **Form Barang** — tambah & ubah data barang dengan validasi (SKU unik bisa dibuat otomatis).
- Data disimpan lokal menggunakan **AsyncStorage** dan otomatis tersinkron setiap perubahan.

## Menjalankan

```bash
npm install
npx expo start          # pilih i (iOS), a (Android), atau w (web)
```

## Perintah Lain

```bash
npm run android   # jalankan di perangkat/emulator Android
npm run ios       # jalankan di simulator iOS
npm run web       # jalankan di browser
npm run lint      # lint (ESLint)
npx tsc --noEmit  # typecheck
```

## Struktur

```
src/
  app/                  # layar (Expo Router, file-based routing)
    _layout.tsx         # root stack + provider
    (tabs)/             # tab: Beranda, Barang, Mutasi
    item/[id].tsx       # detail barang
    item/form.tsx       # tambah / ubah barang (modal)
  components/ui/        # komponen UI (Card, Button, FilterChips, TabBar, dll.)
  constants/            # design token (warna, spacing) & metadata kategori
  data/seed.ts          # data awal
  store/                # state gudang (context + reducer) & selector
  types/warehouse.ts    # tipe domain
  utils/                # format rupiah/tanggal, status stok, dll.
```
