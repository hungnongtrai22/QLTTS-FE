// Danh sách role của tài khoản đăng nhập.
// Phải khớp với ALLOWED_ROLES trong QLTTS-BE/src/pages/api/account/register.ts và edit.ts.

export const roleAccount = [
  {
    label: 'Quản trị viên',
    labelJP: '管理者',
    value: 'admin',
  },
  {
    label: 'Nghiệp đoàn',
    labelJP: '組合',
    value: 'tradeunion',
  },
  {
    label: 'Nguồn tuyển',
    labelJP: '募集元',
    value: 'source',
  },
  {
    label: 'Xem thử',
    labelJP: 'デモ',
    value: 'demo',
  },
  {
    label: 'Đồng Tháp',
    labelJP: 'ドンタップ',
    value: 'dongthap',
  },
];

// Màu của Label theo role. Dùng token màu của theme, không đặt mã màu trực tiếp.
export const roleColor: Record<string, 'error' | 'info' | 'warning' | 'success' | 'default'> = {
  admin: 'error',
  tradeunion: 'info',
  source: 'warning',
  dongthap: 'success',
  demo: 'default',
};

export const getRoleLabel = (value: string, lang?: string) => {
  const found = roleAccount.find((item) => item.value === value);

  if (!found) {
    return value || '—';
  }

  return lang === 'jp' ? found.labelJP : found.label;
};
