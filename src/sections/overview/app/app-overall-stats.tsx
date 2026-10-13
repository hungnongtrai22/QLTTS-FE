// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
// utils
import { fNumber } from 'src/utils/format-number';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
// Số liệu toàn bộ TTS theo trạng thái (thay cho bảng "Tất cả" cũ trên trang tổng quan).
//
// Tổng cộng = Đã xuất cảnh + Hoàn thành HĐ + Về trước hạn + Chờ bay + Đang học — các trạng
// thái không chồng nhau. "Xuất cảnh năm nay" đếm theo ngày xuất cảnh nên phần lớn đã nằm
// trong "Đã xuất cảnh": hiện riêng để tham khảo, KHÔNG cộng vào tổng (bảng cũ cộng vào,
// thành ra đếm trùng ~119 người).
// ----------------------------------------------------------------------

export type OverallStats = {
  pass: number;
  passCurrentYear: number;
  complete: number;
  soon: number;
  wait: number;
  study: number;
};

type Color = 'primary' | 'info' | 'warning' | 'success' | 'error' | 'secondary';

type Props = {
  data: OverallStats | null;
};

function StatTile({
  icon,
  color,
  label,
  value,
  hint,
}: {
  icon: string;
  color: Color;
  label: string;
  value: number;
  hint?: string;
}) {
  const theme = useTheme();

  // Dạng dọc: lưới 6 cột trên màn hình lớn chỉ cho mỗi ô ~160px, đặt icon cạnh chữ thì
  // nhãn bị cắt ("Hoàn th..."). Nhãn được xuống dòng thay vì cắt.
  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 2,
        height: 1,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette[color].main, 0.08),
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: `${color}.main`,
          bgcolor: alpha(theme.palette[color].main, 0.16),
        }}
      >
        <Iconify icon={icon} width={22} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
          {fNumber(value) || 0}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          {label}
        </Typography>
        {hint && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.25 }}>
            {hint}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default function AppOverallStats({ data }: Props) {
  const { t } = useLocales();

  const year = new Date().getFullYear();

  const total = data ? data.pass + data.complete + data.soon + data.wait + data.study : 0;

  const tiles: { icon: string; color: Color; label: string; value: number; hint?: string }[] = [
    {
      icon: 'solar:notebook-bold-duotone',
      color: 'info',
      label: t('dashboard_studying'),
      value: data?.study ?? 0,
    },
    {
      icon: 'solar:clock-circle-bold-duotone',
      color: 'warning',
      label: t('dashboard_waiting'),
      value: data?.wait ?? 0,
    },
    {
      icon: 'solar:plain-bold-duotone',
      color: 'primary',
      label: t('dashboard_departed'),
      value: data?.pass ?? 0,
    },
    {
      icon: 'solar:shield-check-bold-duotone',
      color: 'success',
      label: t('dashboard_completed'),
      value: data?.complete ?? 0,
    },
    {
      icon: 'solar:undo-left-round-bold-duotone',
      color: 'error',
      label: t('dashboard_returned_early'),
      value: data?.soon ?? 0,
    },
    {
      icon: 'solar:calendar-mark-bold-duotone',
      color: 'secondary',
      label: t('dashboard_departed_year', { year }),
      value: data?.passCurrentYear ?? 0,
      hint: t('dashboard_departed_year_hint') || '',
    },
  ];

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h6">{t('dashboard_overview_title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('dashboard_total_hint')}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('dashboard_total')}
          </Typography>
          {data ? (
            <Typography variant="h3">{fNumber(total) || 0}</Typography>
          ) : (
            <Skeleton variant="text" width={72} sx={{ fontSize: '2rem' }} />
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
        }}
      >
        {tiles.map((tile) =>
          data ? (
            <StatTile key={tile.icon} {...tile} />
          ) : (
            <Skeleton key={tile.icon} variant="rounded" height={132} />
          )
        )}
      </Box>
    </Card>
  );
}
