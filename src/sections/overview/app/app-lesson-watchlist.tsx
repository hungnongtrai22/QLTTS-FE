import { ReactNode, useMemo, useState } from 'react';
// @mui
import { alpha, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import {
  PACE_SLOW,
  PACE_MIN_MONTHS,
  DEPARTURE_TARGET,
  LessonWatchItem,
  LessonProgressIntern,
  lessonForecast,
  lessonWatchlist,
} from './lesson-progress-utils';
import { useLessonLabels } from './use-lesson-labels';

// ----------------------------------------------------------------------
// Thẻ "Cần theo dõi trước ngày bay" (ý 3 + 4): TTS học chậm, hoặc dự kiến chưa hết bài 25 (N5)
// lúc xuất cảnh. Ngày bay gần nhất lên đầu. Cách ước tính: xem lessonForecast.
// ----------------------------------------------------------------------

type Filter = 'all' | 'behind' | 'slow';

// Cột: TTS | hiện tại | tốc độ | xuất cảnh dự kiến | dự kiến lúc bay. Điện thoại: tên một hàng,
// bốn ô số liệu chia 2 cột (mỗi ô có nhãn riêng vì không có dòng tiêu đề cột).
const ROW_GRID = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    md: 'minmax(0, 4fr) repeat(4, minmax(0, 2fr))',
  },
  columnGap: 2,
  rowGap: 1,
  alignItems: 'center',
};

const NAME_CELL = { gridColumn: { xs: '1 / -1', md: 'auto' } };

const warningText = (theme: Theme) =>
  theme.palette.mode === 'light' ? theme.palette.warning.dark : theme.palette.warning.light;

export default function AppLessonWatchlist({ interns }: { interns?: LessonProgressIntern[] }) {
  const labels = useLessonLabels();

  const [filter, setFilter] = useState<Filter>('all');

  const items = useMemo(() => lessonWatchlist(interns || []), [interns]);

  // Số TTS ước tính được (đã học đủ PACE_MIN_MONTHS tháng, có số bài và ngày bay dự kiến)
  const estimated = useMemo(
    () => (interns || []).filter((intern) => lessonForecast(intern).projected !== null).length,
    [interns]
  );

  const counts: Record<Filter, number> = {
    all: items.length,
    behind: items.filter((item) => item.forecast.behind).length,
    slow: items.filter((item) => item.forecast.slow).length,
  };

  const shown = filter === 'all' ? items : items.filter((item) => item.forecast[filter]);

  const filters: Array<{ value: Filter; label: string }> = [
    { value: 'all', label: labels.text('dashboard_lesson_watch_all') },
    {
      value: 'behind',
      label: labels.text('dashboard_lesson_watch_behind', { target: DEPARTURE_TARGET }),
    },
    { value: 'slow', label: labels.text('dashboard_lesson_watch_slow', { pace: PACE_SLOW }) },
  ];

  const columns = [
    labels.text('dashboard_lesson_col_intern'),
    labels.text('dashboard_lesson_col_now'),
    labels.text('dashboard_lesson_col_pace'),
    labels.text('dashboard_lesson_col_departure'),
    labels.text('dashboard_lesson_col_forecast'),
  ];

  // Ô số liệu: trên điện thoại kèm nhãn cột phía trên (màn hình rộng đã có dòng tiêu đề).
  const cell = (column: number, primary: ReactNode, secondary?: ReactNode) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        component="div"
        noWrap
        sx={{ color: 'text.disabled', display: { xs: 'block', md: 'none' } }}
      >
        {columns[column]}
      </Typography>
      {primary}
      {secondary && (
        <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
          {secondary}
        </Typography>
      )}
    </Box>
  );

  const renderRow = ({ intern, forecast }: LessonWatchItem) => (
    <Box sx={{ ...ROW_GRID, px: 1, py: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, ...NAME_CELL }}>
        <Avatar alt={intern.name} src={intern.avatar} sx={{ width: 36, height: 36 }} />
        <Box sx={{ minWidth: 0 }}>
          <Link
            component={RouterLink}
            href={paths.dashboard.intern.profile(intern._id)}
            color="inherit"
            underline="hover"
            variant="subtitle2"
            noWrap
            title={intern.name}
            sx={{ display: 'block' }}
          >
            {intern.name}
          </Link>
          <Typography
            variant="caption"
            component="div"
            noWrap
            title={`${labels.company(intern.company)} · ${labels.union(
              intern.tradeUnion
            )} · ${labels.source(intern.source)}`}
            sx={{ color: 'text.secondary' }}
          >
            {labels.company(intern.company)} · {labels.source(intern.source)}
          </Typography>
        </Box>
      </Stack>

      {cell(
        1,
        <Typography variant="body2">
          {intern.lesson === null ? '—' : labels.lesson(intern.lesson)}
        </Typography>,
        intern.lessonMonth
          ? labels.text('dashboard_lesson_reported', { month: labels.month(intern.lessonMonth) })
          : undefined
      )}

      {cell(
        2,
        <Typography
          variant="body2"
          noWrap
          sx={forecast.slow ? { color: warningText, fontWeight: 600 } : undefined}
        >
          {forecast.pace === null ? '—' : labels.pace(forecast.pace)}
        </Typography>,
        forecast.slow ? labels.text('dashboard_lesson_slow') : undefined
      )}

      {cell(
        3,
        <Typography variant="body2">
          {forecast.departure ? labels.month(forecast.departure) : '—'}
        </Typography>,
        forecast.monthsToDeparture !== null
          ? labels.untilDeparture(forecast.monthsToDeparture)
          : undefined
      )}

      {cell(
        4,
        <Typography
          variant="body2"
          sx={forecast.behind ? { color: warningText, fontWeight: 600 } : undefined}
        >
          {forecast.projected === null
            ? '—'
            : labels.text('dashboard_lesson_forecast_short', { lesson: forecast.projected })}
        </Typography>,
        forecast.projected === null
          ? undefined
          : labels.text(
              forecast.behind ? 'dashboard_lesson_target_miss' : 'dashboard_lesson_target_ok',
              { target: DEPARTURE_TARGET }
            )
      )}
    </Box>
  );

  const renderBody = () => {
    if (!interns) {
      return [...Array(3)].map((_, index) => (
        <Box key={index} sx={{ ...ROW_GRID, px: 1, py: 1.5 }}>
          <Skeleton variant="text" sx={{ width: 0.6, ...NAME_CELL }} />
          {[...Array(4)].map((__, col) => (
            <Skeleton key={col} variant="text" sx={{ width: 0.7 }} />
          ))}
        </Box>
      ));
    }

    if (!shown.length) {
      return <EmptyContent title={labels.text('dashboard_lesson_watch_empty')} sx={{ py: 6 }} />;
    }

    return shown.map((item, index) => (
      <Box key={item.intern._id}>
        {index > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
        {renderRow(item)}
      </Box>
    ));
  };

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.25,
            color: 'warning.main',
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.12),
          }}
        >
          <Iconify icon="solar:flag-bold-duotone" width={22} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6">{labels.text('dashboard_lesson_watch_title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {labels.text('dashboard_lesson_watch_subheader', {
              count: estimated,
              months: PACE_MIN_MONTHS,
              target: DEPARTURE_TARGET,
            })}
          </Typography>
        </Box>
      </Stack>

      {interns && items.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {filters.map((item) => {
            const active = filter === item.value;
            return (
              <Button
                key={item.value}
                variant={active ? 'soft' : 'outlined'}
                color={active ? 'warning' : 'inherit'}
                aria-pressed={active}
                disabled={!counts[item.value] && !active}
                onClick={() => setFilter(item.value)}
                sx={{ minHeight: { xs: 44, md: 36 } }}
              >
                {item.label}
                <Label variant={active ? 'filled' : 'soft'} color="warning" sx={{ ml: 1 }}>
                  {counts[item.value]}
                </Label>
              </Button>
            );
          })}
        </Stack>
      )}

      {/* Dòng tiêu đề cột — chỉ màn hình rộng */}
      {interns && shown.length > 0 && (
        <Box
          sx={{
            ...ROW_GRID,
            display: { xs: 'none', md: 'grid' },
            px: 1,
            py: 1,
            borderRadius: 1,
            bgcolor: 'background.neutral',
          }}
        >
          {columns.map((column) => (
            <Typography
              key={column}
              variant="caption"
              noWrap
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              {column}
            </Typography>
          ))}
        </Box>
      )}

      {renderBody()}
    </Card>
  );
}
