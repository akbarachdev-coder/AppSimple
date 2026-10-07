const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Groups digits with `.` (Indonesian thousands separator). */
export function formatNumber(value: number): string {
  const sign = value < 0 ? '-' : '';
  const digits = Math.abs(Math.trunc(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatRupiah(value: number, options?: { compact?: boolean }): string {
  const amount = Math.round(value);
  if (options?.compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_000_000_000) return `Rp ${trimDecimal(amount / 1_000_000_000)} M`;
    if (abs >= 1_000_000) return `Rp ${trimDecimal(amount / 1_000_000)} jt`;
    if (abs >= 1_000) return `Rp ${trimDecimal(amount / 1_000)} rb`;
  }
  return `Rp ${formatNumber(amount)}`;
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace('.0', '').replace('.', ',');
}

export function formatQuantity(value: number): string {
  return formatNumber(value);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDayName(iso: string): string {
  const date = new Date(iso);
  return `${DAYS[date.getDay()]}, ${formatDate(iso)}`;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari lalu`;

  return formatDate(iso);
}

export function dayKey(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
