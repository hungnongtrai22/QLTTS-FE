import { useCallback, useMemo, useState } from 'react';
// @mui
import { alpha, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';
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
  LESSON_MAX,
  LESSON_N5,
  LessonStats,
  LessonProgressIntern,
  groupLessonProgress,
  lessonForecast,
  reportMonthRange,
} from './lesson-progress-utils';
import { useLessonLabels } from './use-lesson-labels';

// Một dòng phụ ở cột số bài; warn = chữ màu cảnh báo (học chậm, dự kiến chưa tới mốc lúc bay).
type SummaryLine = { text: string; warn?: boolean };

// Chữ cảnh báo: đậm trên nền sáng, nhạt trên nền tối để vẫn đọc được.
const warningText = (theme: Theme) =>
  theme.palette.mode === 'light' ? theme.palette.warning.dark : theme.palette.warning.light;

// ----------------------------------------------------------------------
// Thẻ "Tiến độ học theo nghiệp đoàn / công ty" trên trang tổng quan.
// Mỗi dòng: thanh thang bài 0 → 50 — đoạn tô từ người chậm nhất tới người nhanh nhất, chấm tròn là
// trung vị, vạch đứt ở bài 25 (hết N5). Bấm nghiệp đoàn → công ty → từng TTS.
// ----------------------------------------------------------------------

// Cột: tên | thanh tiến độ | số bài. Điện thoại: tên và số bài chung một hàng, thanh xuống hàng
// dưới trải hết bề ngang — mọi cấp (nghiệp đoàn, công ty, TTS) dùng chung một thang với dòng chia
// mốc ở đầu thẻ.
const ROW_GRID = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'minmax(0, 1fr) auto',
    md: 'minmax(0, 5fr) minmax(0, 4fr) minmax(0, 3fr)',
  },
  columnGap: 2,
  rowGap: 0.75,
  alignItems: 'center',
};

// Điện thoại: thanh xuống hàng riêng, trải hết bề ngang (tên và số bài nằm chung hàng trên).
const BAR_CELL = { gridColumn: { xs: '1 / -1', md: 'auto' }, order: { xs: 3, md: 0 } };

const position = (lesson: number) =>
  `${(Math.min(Math.max(lesson, 0), LESSON_MAX) / LESSON_MAX) * 100}%`;

function LessonRangeBar({
  min,
  max,
  median,
}: {
  min: number | null;
  max: number | null;
  median: number | null;
}) {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', height: 16, ...BAR_CELL }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 5,
          height: 6,
          borderRadius: 1,
          bgcolor: 'background.neutral',
        }}
      />
      {/* Mốc hết N5 */}
      <Box
        sx={{
          position: 'absolute',
          left: position(LESSON_N5),
          top: 0,
          bottom: 0,
          borderLeft: `1px dashed ${alpha(theme.palette.grey[500], 0.48)}`,
        }}
      />
      {min !== null && max !== null && max > min && (
        <Box
          sx={{
            position: 'absolute',
            left: position(min),
            width: `calc(${position(max)} - ${position(min)})`,
            top: 5,
            height: 6,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.32),
          }}
        />
      )}
      {median !== null && (
        <Box
          sx={{
            position: 'absolute',
            left: position(median),
            top: 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'primary.main',
            border: `solid 2px ${theme.palette.background.paper}`,
            boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.24)}`,
          }}
        />
      )}
    </Box>
  );
}

type Props = {
  // undefined = đang tải
  interns?: LessonProgressIntern[];
};

export default function AppLessonProgress({ interns }: Props) {
  const labels = useLessonLabels();

  const loading = !interns;

  const groups = useMemo(() => groupLessonProgress(interns || []), [interns]);

  const months = useMemo(() => reportMonthRange(interns || []), [interns]);

  // Khóa của nghiệp đoàn / công ty đang mở
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allUnionsOpen = groups.length > 0 && groups.every((union) => open.has(union.key));

  // "Mở tất cả" chỉ mở tới cấp công ty — mở luôn từng TTS thì thẻ dài cả trăm dòng.
  const handleToggleAll = () =>
    setOpen(allUnionsOpen ? new Set() : new Set(groups.map((union) => union.key)));

  // Dòng chính: khoảng bài. Dòng phụ (mỗi ý một dòng, không ngắt giữa chừng): trung vị, số TTS
  // chưa rõ bài, số TTS cần theo dõi (màu cảnh báo).
  const summary = (stats: LessonStats) => {
    const watch: SummaryLine[] = stats.watch
      ? [{ text: labels.text('dashboard_lesson_watch_count', { count: stats.watch }), warn: true }]
      : [];
    if (stats.min === null || stats.max === null || stats.median === null) {
      return { primary: labels.text('dashboard_lesson_no_report'), secondary: watch };
    }
    return {
      primary: labels.range(stats.min, stats.max),
      secondary: [
        ...(stats.count - stats.missing > 1 ? [{ text: labels.median(stats.median) }] : []),
        ...(stats.missing
          ? [{ text: labels.text('dashboard_lesson_missing', { count: stats.missing }) }]
          : []),
        ...watch,
      ],
    };
  };

  // Cột số bài. Điện thoại: cột phải chỉ giữ dòng chính để tên còn chỗ; dòng phụ (và số TTS
  // của nhóm — mobileExtra) gom thành một dòng chú thích dưới thanh.
  const renderSummary = ({
    primary,
    secondary,
    muted,
    strong,
    mobileExtra = [],
  }: {
    primary: string;
    secondary: SummaryLine[];
    muted: boolean;
    strong: boolean;
    mobileExtra?: SummaryLine[];
  }) => {
    const mobileLines = [...mobileExtra, ...secondary];
    return (
      <>
        <Box sx={{ textAlign: 'right', minWidth: 0 }}>
          <Typography
            variant={strong ? 'subtitle2' : 'body2'}
            noWrap
            sx={{ color: muted ? 'text.disabled' : 'text.primary' }}
          >
            {primary}
          </Typography>
          {secondary.map((line) => (
            <Typography
              key={line.text}
              variant="caption"
              noWrap
              title={line.text}
              sx={{
                color: line.warn ? warningText : 'text.secondary',
                fontWeight: line.warn ? 600 : undefined,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {line.text}
            </Typography>
          ))}
        </Box>
        {mobileLines.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: { xs: 'block', md: 'none' },
              gridColumn: '1 / -1',
              order: 4,
            }}
          >
            {mobileLines.map((line, index) => (
              <Box
                key={line.text}
                component="span"
                sx={line.warn ? { color: warningText, fontWeight: 600 } : undefined}
              >
                {index > 0 && ' · '}
                {line.text}
              </Box>
            ))}
          </Typography>
        )}
      </>
    );
  };

  const renderToggleRow = (key: string, name: string, stats: LessonStats, level: 0 | 1) => {
    const expanded = open.has(key);
    const count = labels.text('dashboard_lesson_count', { count: stats.count });
    return (
      <ButtonBase
        key={key}
        aria-expanded={expanded}
        onClick={() => toggle(key)}
        sx={{
          ...ROW_GRID,
          width: 1,
          textAlign: 'left',
          px: 1,
          py: 1.25,
          minHeight: 52,
          borderRadius: 1,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, pl: level * 3 }}>
          <Iconify
            icon="eva:arrow-ios-forward-fill"
            width={18}
            sx={{
              flexShrink: 0,
              color: 'text.secondary',
              transition: (theme) => theme.transitions.create('transform'),
              ...(expanded && { transform: 'rotate(90deg)' }),
            }}
          />
          <Typography
            variant={level === 0 ? 'subtitle1' : 'subtitle2'}
            noWrap
            title={name}
            sx={{ minWidth: 0 }}
          >
            {name}
          </Typography>
          {/* Điện thoại: số TTS xuống dòng chú thích dưới thanh (renderSummary). */}
          <Label variant="soft" sx={{ flexShrink: 0, display: { xs: 'none', md: 'inline-flex' } }}>
            {count}
          </Label>
        </Stack>
        <LessonRangeBar min={stats.min} max={stats.max} median={stats.median} />
        {renderSummary({
          ...summary(stats),
          muted: stats.min === null,
          strong: true,
          mobileExtra: [{ text: count }],
        })}
      </ButtonBase>
    );
  };

  const renderIntern = (intern: LessonProgressIntern) => {
    // Chưa rõ bài có hai lý do: chưa có báo cáo nào, hoặc chỉ có báo cáo "ôn tập".
    let primary = labels.text('dashboard_lesson_no_report');
    if (intern.lesson !== null) primary = labels.lesson(intern.lesson);
    else if (intern.review) primary = labels.text('dashboard_lesson_review');
    const forecast = lessonForecast(intern);
    const secondary: SummaryLine[] = [
      ...(intern.review && intern.lesson !== null
        ? [{ text: labels.text('dashboard_lesson_review') }]
        : []),
      ...(intern.month
        ? [
            {
              text: labels.text('dashboard_lesson_reported', { month: labels.month(intern.month) }),
            },
          ]
        : []),
      // Ý 3: học chậm — dòng chữ cảnh báo ở cột phải (đặt nhãn cạnh tên thì tên bị cắt cụt).
      ...(forecast.slow && forecast.pace !== null
        ? [{ text: labels.paceSlow(forecast.pace), warn: true }]
        : []),
      // Ý 4: số bài dự kiến lúc bay — hiện cho mọi TTS ước tính được, cảnh báo khi chưa tới mốc.
      // Tháng bay xem ở thẻ "Cần theo dõi trước ngày bay"; ở đây rút gọn cho vừa cột.
      ...(forecast.projected !== null
        ? [
            {
              text: labels.text('dashboard_lesson_forecast', { lesson: forecast.projected }),
              warn: forecast.behind,
            },
          ]
        : []),
    ];

    return (
      <Box key={intern._id} sx={{ ...ROW_GRID, px: 1, py: 0.75 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ minWidth: 0, pl: { xs: 3.5, md: 6.5 } }}
        >
          <Avatar alt={intern.name} src={intern.avatar} sx={{ width: 28, height: 28 }} />
          <Link
            component={RouterLink}
            href={paths.dashboard.intern.profile(intern._id)}
            color="inherit"
            underline="hover"
            variant="body2"
            noWrap
            title={intern.name}
            sx={{ minWidth: 0, py: 1 }}
          >
            {intern.name}
          </Link>
        </Stack>
        <LessonRangeBar min={intern.lesson} max={intern.lesson} median={intern.lesson} />
        {renderSummary({ primary, secondary, muted: intern.lesson === null, strong: false })}
      </Box>
    );
  };

  const renderBody = () => {
    if (loading) {
      return [...Array(5)].map((_, index) => (
        <Box key={index} sx={{ ...ROW_GRID, px: 1, py: 1.5 }}>
          <Skeleton variant="text" sx={{ width: 0.7 }} />
          <Skeleton variant="rounded" height={8} sx={BAR_CELL} />
          <Skeleton variant="text" sx={{ width: 0.6, justifySelf: { md: 'end' } }} />
        </Box>
      ));
    }

    if (!groups.length) {
      return <EmptyContent title={labels.text('dashboard_lesson_empty')} sx={{ py: 6 }} />;
    }

    return groups.map((union, index) => (
      <Box key={union.key}>
        {index > 0 && <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />}
        {renderToggleRow(union.key, labels.union(union.name), union.stats, 0)}
        <Collapse in={open.has(union.key)} unmountOnExit>
          {union.companies.map((company) => (
            <Box key={company.key}>
              {renderToggleRow(company.key, labels.company(company.name), company.stats, 1)}
              <Collapse in={open.has(company.key)} unmountOnExit>
                {company.interns.map(renderIntern)}
              </Collapse>
            </Box>
          ))}
        </Collapse>
      </Box>
    ));
  };

  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
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
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Iconify icon="solar:book-bookmark-bold-duotone" width={22} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6">{labels.text('dashboard_lesson_title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {months.length
                ? labels.text('dashboard_lesson_subheader', { months: labels.months(months) })
                : labels.text('dashboard_lesson_subheader_empty')}
            </Typography>
          </Box>
        </Stack>

        {groups.length > 0 && (
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            onClick={handleToggleAll}
            startIcon={<Iconify icon={allUnionsOpen ? 'eva:collapse-fill' : 'eva:expand-fill'} />}
            sx={{ flexShrink: 0, minHeight: { xs: 44, sm: 32 } }}
          >
            {labels.text(
              allUnionsOpen ? 'dashboard_lesson_collapse_all' : 'dashboard_lesson_expand_all'
            )}
          </Button>
        )}
      </Stack>

      {/* Dòng chia mốc — thẳng hàng với cột thanh tiến độ */}
      <Box sx={{ ...ROW_GRID, px: 1, mb: 0.5 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ position: 'relative', height: 18, ...BAR_CELL }}>
          {[
            { at: 0, label: labels.text('dashboard_lesson_mark_start'), shift: '0%' },
            { at: LESSON_N5, label: labels.text('dashboard_lesson_mark_n5'), shift: '-50%' },
            { at: LESSON_MAX, label: labels.text('dashboard_lesson_mark_n4'), shift: '-100%' },
          ].map((mark) => (
            <Typography
              key={mark.at}
              variant="caption"
              noWrap
              sx={{
                position: 'absolute',
                left: position(mark.at),
                transform: `translateX(${mark.shift})`,
                color: 'text.disabled',
              }}
            >
              {mark.label}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }} />
      </Box>

      {renderBody()}
    </Card>
  );
}
