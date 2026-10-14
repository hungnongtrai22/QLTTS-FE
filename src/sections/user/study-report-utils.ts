// ----------------------------------------------------------------------
// Dùng chung cho trang "Báo cáo học tập" và "Nhập điểm hàng loạt".
// ----------------------------------------------------------------------

// Ngày 1 lúc 00:00 giờ máy — cùng dạng giá trị DatePicker và form nhập điểm dùng.
export const addMonths = (date: Date, count: number) =>
  new Date(date.getFullYear(), date.getMonth() + count, 1);

// Tháng hiện tại theo giờ Việt Nam.
export const currentMonth = () => {
  const vn = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return new Date(vn.getUTCFullYear(), vn.getUTCMonth(), 1);
};

export const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

// "YYYY-MM" (vd từ URL) → ngày 1 của tháng; sai định dạng trả null.
export const parseMonthKey = (value: string | null | undefined) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return new Date(Number(match[1]), monthIndex, 1);
};

// Bỏ dấu để tìm "cuong" ra "CƯỜNG".
export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

export const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'vi'));
