import { useMemo } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fNumber } from 'src/utils/format-number';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
// Thẻ thống kê một chương trình (3 năm, 1 năm, Kỹ sư, Tokutei KS, Đặc định) trên trang
// tổng quan — thay cho các bảng HTML kẻ ô trước đây.
//
// Tổng = xuất cảnh (mọi năm) + chờ bay + đang học. Đã kiểm trên dữ liệu thật: người có
// ngày xuất cảnh đều ở trạng thái đã đi / về sớm / hoàn thành, nên ba nhóm không chồng nhau.
// ----------------------------------------------------------------------

export type StatItem = { label: string; value: number };

type Props = {
  title: string;
  icon: string;
  loading?: boolean;
  departures: StatItem[];
  waiting: number;
  studying?: StatItem[];
  // Thẻ rộng (Đơn hàng 3 năm, 11 cơ sở đào tạo): danh sách cơ sở chia 2 cột từ cỡ tablet
  // lớn để thẻ không cao gấp đôi thẻ bên cạnh.
  wide?: boolean;
};

const sum = (items: StatItem[] = []) => items.reduce((total, item) => total + item.value, 0);

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      component="div"
      sx={{ color: 'text.disabled', mb: 1.25, lineHeight: 1.5 }}
    >
      {children}
    </Typography>
  );
}

export default function AppProgramStats({
  title,
  icon,
  loading,
  departures,
  waiting,
  studying = [],
  wide,
}: Props) {
  const theme = useTheme();
  const { t } = useLocales();

  const departed = sum(departures);
  const studyTotal = sum(studying);
  const total = departed + waiting + studyTotal;

  // Cơ sở đông nhất lên đầu; cơ sở bằng 0 xuống cuối và làm mờ (vẫn hiện để biết chỗ nào trống).
  const centers = useMemo(
    () =>
      studying
        .map((item, index) => ({ ...item, index }))
        .sort((a, b) => b.value - a.value || a.index - b.index),
    [studying]
  );
  const maxCenter = Math.max(1, ...studying.map((item) => item.value));

  const segments = [
    { key: 'departed', label: t('dashboard_departed'), value: departed, color: 'primary' as const },
    { key: 'waiting', label: t('dashboard_waiting'), value: waiting, color: 'warning' as const },
    ...(studying.length
      ? [
          {
            key: 'studying',
            label: t('dashboard_studying'),
            value: studyTotal,
            color: 'info' as const,
          },
        ]
      : []),
  ];

  const header = (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1.25,
          color: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Iconify icon={icon} width={22} />
      </Box>

      <Typography variant="h6" sx={{ flexGrow: 1, minWidth: 0 }} noWrap>
        {title}
      </Typography>

      <Box sx={{ textAlign: 'right' }}>
        {loading ? (
          <Skeleton variant="text" width={56} sx={{ fontSize: '1.75rem' }} />
        ) : (
          <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
            {fNumber(total) || 0}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('dashboard_total')}
        </Typography>
      </Box>
    </Stack>
  );

  // Thanh tỷ lệ + chú thích: màu chỉ dùng để phân biệt trạng thái.
  const proportion = (
    <Box sx={{ mb: 2.5 }}>
      <Stack
        direction="row"
        sx={{
          height: 8,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.neutral',
          mb: 1.5,
        }}
      >
        {total > 0 &&
          segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <Box
                key={segment.key}
                sx={{ flexGrow: segment.value, bgcolor: `${segment.color}.main` }}
              />
            ))}
      </Stack>

      <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={0.75}>
        {segments.map((segment) => (
          <Stack
            key={segment.key}
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ opacity: segment.value ? 1 : 0.48 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: `${segment.color}.main`,
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {segment.label}
            </Typography>
            <Typography variant="subtitle2">{fNumber(segment.value) || 0}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );

  const years = (
    <Box>
      <SectionTitle>{t('dashboard_departures_by_year')}</SectionTitle>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
        }}
      >
        {departures.map((item) => (
          <Box
            key={item.label}
            sx={{
              px: 1.25,
              py: 1,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              opacity: item.value ? 1 : 0.48,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {item.label}
            </Typography>
            <Typography variant="subtitle1">{fNumber(item.value) || 0}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const centerList = studying.length > 0 && (
    <Box>
      <SectionTitle>{t('dashboard_studying_by_center')}</SectionTitle>
      <Box
        sx={{
          display: 'grid',
          columnGap: 4,
          rowGap: 1.25,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', sm: wide ? '1fr 1fr' : '1fr' },
          // Danh sách xếp hạng đọc theo cột: cột trái hạng 1 trở xuống, rồi sang cột phải.
          ...(wide && {
            gridAutoFlow: { sm: 'column' },
            gridTemplateRows: { sm: `repeat(${Math.ceil(centers.length / 2)}, auto)` },
          }),
        }}
      >
        {centers.map((item) => (
          <Box key={item.label} sx={{ color: item.value ? 'text.primary' : 'text.disabled' }}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="body2"
                sx={{ flexGrow: 1, minWidth: 0 }}
                noWrap
                title={item.label}
              >
                {item.label}
              </Typography>
              <Typography variant="subtitle2">{fNumber(item.value) || 0}</Typography>
            </Stack>
            {item.value > 0 && (
              <LinearProgress
                variant="determinate"
                color="info"
                value={(item.value / maxCenter) * 100}
                sx={{ mt: 0.5, height: 4, bgcolor: alpha(theme.palette.info.main, 0.12) }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
        {header}
        <Skeleton variant="rounded" height={8} sx={{ mb: 2.5 }} />
        <Skeleton variant="rounded" height={wide ? 240 : 140} />
      </Card>
    );
  }

  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
      {header}
      {proportion}

      <Stack
        spacing={3}
        divider={centerList ? <Divider sx={{ borderStyle: 'dashed' }} /> : undefined}
      >
        {years}
        {centerList}
      </Stack>
    </Card>
  );
}
