import axios from 'axios';
import { m } from 'framer-motion';
import { saveAs } from 'file-saver';
import { ReactNode, useEffect, useMemo, useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// auth
import { useAuthContext } from 'src/auth/hooks';
// locales
import { useLocales } from 'src/locales';
// utils
import { scoreSymbol } from 'src/utils/studyGrade';
// types
import { IInternItem, IStudyItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Chart, { useChart } from 'src/components/chart';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { MotionContainer, varFade } from 'src/components/animate';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
//
import {
  GENERAL_KEYS,
  JAPANESE_KEYS,
  LESSON_MAX,
  SKILL_KEYS,
  StudyScoreKey,
  StudyView,
  buildStudyViews,
  totalAxis,
} from './study-overview-utils';

// ----------------------------------------------------------------------
// Tab "Học tập" của hồ sơ TTS — trang nghiệp đoàn / công ty xem để theo dõi TTS (admin, nguồn
// cũng dùng). Chọn một tháng ở đầu trang: các ô tóm tắt, 4 kỹ năng và bảng đánh giá đổi theo
// tháng đó; biểu đồ hiện mọi tháng. Admin thêm: công khai / xóa báo cáo.
// ----------------------------------------------------------------------

type Props = {
  // undefined = đang tải
  studies?: IStudyItem[];
  intern?: IInternItem;
  // Sau khi công khai (tải lại danh sách) / sau khi xóa
  onChanged: VoidFunction;
  onRemoved: (id: string) => void;
};

type Tone = 'success' | 'error' | 'default';

const fadeInUp = varFade({ distance: 24 }).inUp;

const CARD_SX = { p: { xs: 2, md: 3 }, height: 1 };

export default function StudyOverview({ studies, intern, onChanged, onRemoved }: Props) {
  const theme = useTheme();

  const { t } = useLocales();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = user?.role === 'admin';

  const smUp = useResponsive('up', 'sm');

  const views = useMemo(() => buildStudyViews(studies || []), [studies]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [mode, setMode] = useState<'total' | 'skills'>('total');

  const [showCriteria, setShowCriteria] = useState(false);

  const [downloading, setDownloading] = useState<'all' | 'month' | null>(null);

  const [publishing, setPublishing] = useState(false);

  const [askDelete, setAskDelete] = useState(false);

  // Mặc định tháng mới nhất; tháng đang chọn bị xóa thì quay về tháng mới nhất.
  useEffect(() => {
    if (!views.length) return;
    if (!selectedId || !views.some((view) => view.report._id === selectedId)) {
      setSelectedId(views[0].report._id);
    }
  }, [views, selectedId]);

  const selectedIndex = Math.max(
    0,
    views.findIndex((view) => view.report._id === selectedId)
  );
  const view: StudyView | undefined = views[selectedIndex];

  const text = (key: string, options?: Record<string, unknown>) => t(key, { ...options }) || '';

  const monthLabel = (item: StudyView) =>
    text('study_view_month', { month: item.month, year: item.year });

  const itemLabel = (key: StudyScoreKey) =>
    SKILL_KEYS.includes(key) ? text(`study_view_${key}`) : text(key);

  // Thay đổi so với báo cáo trước: chữ và màu (tăng xanh, giảm đỏ).
  const change = (current: number, previous: number | undefined | null, digits = 0) => {
    if (previous === undefined || previous === null) return null;
    const value = Math.round((current - previous) * 10 ** digits) / 10 ** digits;
    let tone: Tone = 'default';
    if (value > 0) tone = 'success';
    if (value < 0) tone = 'error';
    const sign = (value > 0 && '+') || (value < 0 && '−') || '±';
    return { text: `${sign}${Math.abs(value).toFixed(digits)}`, tone };
  };

  const toneColor = (tone: Tone) =>
    ({ success: 'success.dark', error: 'error.dark', default: 'text.secondary' }[tone]);

  const barColor = (point: number) => {
    if (point < 50) return theme.palette.error.main;
    if (point < 70) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  // ---------------- Biểu đồ ----------------

  const asc = useMemo(() => [...views].reverse(), [views]);

  const ascSelected = asc.length - 1 - selectedIndex;

  // Điện thoại: nhãn trục ngắn ("9月") — nhãn đủ ("9月（5ヶ月目）") bị xoay và cắt chữ.
  const categories = asc.map((item) =>
    smUp
      ? text('study_view_axis', { month: item.month, time: item.report.time })
      : text('study_view_axis_short', { month: item.month })
  );

  const skillColors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
  ];

  const series =
    mode === 'total'
      ? [{ name: text('study_view_mode_total'), data: asc.map((item) => item.report.total) }]
      : SKILL_KEYS.map((key) => ({
          name: itemLabel(key),
          data: asc.map((item) => item.report[key]),
        }));

  const axis = totalAxis(asc.map((item) => item.report.total));

  const selectPoint = (index?: number) => {
    const target = asc[index ?? -1];
    if (target) setSelectedId(target.report._id);
  };

  const chartOptions = useChart({
    colors: mode === 'total' ? [theme.palette.primary.main] : skillColors,
    stroke: { width: 3, curve: 'straight' },
    fill: { type: 'solid', opacity: 1 },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: theme.palette.background.paper,
      hover: { size: 7 },
      // Tháng đang chọn: chấm to hơn
      discrete: series.map((_, seriesIndex) => ({
        seriesIndex,
        dataPointIndex: ascSelected,
        size: 8,
        fillColor: (mode === 'total' ? [theme.palette.primary.main] : skillColors)[seriesIndex],
        strokeColor: theme.palette.background.paper,
      })),
    },
    dataLabels: {
      enabled: mode === 'total',
      offsetY: -10,
      background: { enabled: false },
      style: { fontSize: '12px', fontWeight: 600, colors: [theme.palette.text.primary] },
    },
    legend: { show: mode === 'skills', position: 'top', horizontalAlign: 'right' },
    xaxis: { categories },
    yaxis:
      mode === 'total'
        ? { min: axis.min, max: axis.max, tickAmount: 4 }
        : { min: 0, max: 100, tickAmount: 5 },
    annotations: {
      xaxis: categories[ascSelected]
        ? [
            {
              x: categories[ascSelected],
              borderColor: alpha(theme.palette.primary.main, 0.4),
              strokeDashArray: 0,
            },
          ]
        : [],
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: { formatter: (value: number) => text('study_view_points', { value }) },
    },
    chart: {
      events: {
        // Bấm vào một chấm = chọn tháng đó. Cần tooltip intersect (bên dưới): tooltip dùng chung
        // (shared) làm chấm không nhận sự kiện chuột.
        markerClick: (_event: unknown, _chart: unknown, options?: { dataPointIndex?: number }) =>
          selectPoint(options?.dataPointIndex),
        click: (_event: unknown, _chart: unknown, options?: { dataPointIndex?: number }) =>
          selectPoint(options?.dataPointIndex),
      },
    },
  });

  // ---------------- Thao tác ----------------

  const downloadPdf = async (scope: 'all' | 'month') => {
    if (!view) return;
    setDownloading(scope);
    try {
      // Thư viện PDF + mẫu báo cáo (~1,3MB) chỉ nạp lúc bấm tải.
      const [{ pdf }, { default: AllStudyPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../order/AllStudyPDF'),
      ]);
      const list = scope === 'all' ? views.map((item) => item.report) : [view.report];
      const blob = await pdf(<AllStudyPDF intern={intern} study={list} />).toBlob();
      const suffix = scope === 'all' ? '' : `_${view.year}-${String(view.month).padStart(2, '0')}`;
      saveAs(blob, `${intern?.name || 'study'}${suffix}.pdf`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(text('study_view_pdf_failed'), { variant: 'error' });
    } finally {
      setDownloading(null);
    }
  };

  const handlePublish = async () => {
    if (!view) return;
    setPublishing(true);
    try {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/study/updatePublic`, {
        isPublic: true,
        _id: view.report._id,
      });
      enqueueSnackbar(text('study_view_published'));
      onChanged();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || text('study_publish_failed'), {
        variant: 'error',
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!view) return;
    try {
      // Báo cáo đã công khai bị khóa bên BE: hộp thoại xác nhận đã cảnh báo riêng trường hợp này,
      // nên bấm Xóa ở đó là đã mở khóa (xem studyLock bên BE).
      await axios.post(`${process.env.REACT_APP_HOST_API}/api/study/delete`, {
        id: view.report._id,
        unlockPublished: !!view.report.isPublic,
      });
      setAskDelete(false);
      onRemoved(view.report._id);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || text('study_delete_failed'), {
        variant: 'error',
      });
    }
  };

  // ---------------- Trạng thái tải / trống ----------------

  if (!studies) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={52} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid key={index} xs={6} md={3}>
              <Skeleton variant="rounded" height={132} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" height={360} />
      </Stack>
    );
  }

  if (!views.length || !view) {
    return (
      <Card sx={{ py: 5 }}>
        <EmptyContent title={text('study_view_empty')} />
      </Card>
    );
  }

  const { report, prev } = view;
  const vsLabel = view.prevIsLastMonth ? 'study_view_vs_last_month' : 'study_view_vs_last_report';
  const totalChange = change(report.total, prev?.total);
  const averageChange = change(Number(report.average), prev ? Number(prev.average) : null, 1);

  const skills = SKILL_KEYS.map((key) => ({
    key,
    value: report[key],
    prev: prev ? prev[key] : null,
    change: change(report[key], prev?.[key]),
  }));
  const weakest = [...skills].sort((a, b) => a.value - b.value)[0];

  const jlpt = [
    { key: 'kanji', value: report.kanji },
    { key: 'grammarAndReading', value: report.grammarAndReading },
    { key: 'listeningComprehension', value: report.listeningComprehension },
  ].filter((item) => typeof item.value === 'number');

  const changeChip = (value: ReturnType<typeof change>) =>
    value ? (
      <Label variant="soft" color={value.tone} sx={{ textTransform: 'none' }}>
        {text(vsLabel, { value: value.text })}
      </Label>
    ) : (
      <Label variant="soft" sx={{ textTransform: 'none' }}>
        {text('study_view_first_report')}
      </Label>
    );

  const kpi = (title: string, body: ReactNode, footer: ReactNode) => (
    <Card sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
      {body}
      <Box sx={{ mt: 'auto' }}>{footer}</Box>
    </Card>
  );

  const bigNumber = (value: ReactNode, unit: string) => (
    <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h3" component="span" sx={{ lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
        {unit}
      </Typography>
    </Stack>
  );

  const scoreRow = (key: StudyScoreKey) => {
    const value = report[key];
    const rowChange = change(value, prev?.[key]);
    return (
      <Box
        key={key}
        sx={{
          display: 'grid',
          alignItems: 'center',
          columnGap: 1.5,
          rowGap: 0.75,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) 24px 36px 44px',
            md: 'minmax(0, 200px) minmax(0, 1fr) 36px 24px 44px',
          },
          gridTemplateAreas: {
            xs: '"label symbol value change" "bar bar bar bar"',
            md: '"label bar value symbol change"',
          },
        }}
      >
        <Typography variant="body2" sx={{ gridArea: 'label', color: 'text.secondary' }}>
          {itemLabel(key)}
        </Typography>
        <Box sx={{ gridArea: 'bar', height: 8, borderRadius: 1, bgcolor: 'background.neutral' }}>
          <Box sx={{ height: 1, borderRadius: 1, width: `${value}%`, bgcolor: barColor(value) }} />
        </Box>
        <Typography variant="subtitle1" sx={{ gridArea: 'value', textAlign: 'right' }}>
          {value}
        </Typography>
        <Typography
          title={text('study_view_points', { value })}
          sx={{ gridArea: 'symbol', textAlign: 'center', color: 'text.secondary' }}
        >
          {scoreSymbol(value)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            gridArea: 'change',
            textAlign: 'right',
            fontWeight: 700,
            color: rowChange ? toneColor(rowChange.tone) : 'text.disabled',
          }}
        >
          {rowChange ? rowChange.text : ''}
        </Typography>
      </Box>
    );
  };

  const group = (title: string, keys: StudyScoreKey[]) => (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
        sx={{ pb: 1, borderBottom: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}` }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {text('study_view_subtotal', {
            value: keys.reduce((sum, key) => sum + (Number(report[key]) || 0), 0),
          })}
        </Typography>
      </Stack>
      {keys.map(scoreRow)}
    </Stack>
  );

  const miniStat = (title: string, value: ReactNode) => (
    <Box sx={{ px: 1.75, py: 1.5, borderRadius: 1.25, bgcolor: 'background.neutral' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );

  const evaluationScale = ['秀', '優', '良', '可', '不可'];

  return (
    // MotionContainer (chạy ngay khi hiện) chứ không phải MotionViewport: khối này cao ~1600px, đòi
    // 30% lọt màn hình mới chạy thì trên laptop phần dưới đầu trang trống cho tới khi cuộn.
    <MotionContainer>
      <Stack spacing={3}>
        {/* Chọn tháng + tải PDF cả kỳ */}
        <Stack
          component={m.div}
          variants={fadeInUp}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', flexShrink: 0, display: { xs: 'none', sm: 'block' } }}
            >
              {text('study_view_pick_month')}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ overflowX: 'auto', pb: 0.5, flexWrap: { md: 'wrap' }, rowGap: 1 }}
            >
              {views.map((item, index) => {
                const active = index === selectedIndex;
                return (
                  <Button
                    key={item.report._id}
                    variant={active ? 'soft' : 'outlined'}
                    color={active ? 'primary' : 'inherit'}
                    aria-pressed={active}
                    onClick={() => setSelectedId(item.report._id)}
                    sx={{
                      flexShrink: 0,
                      minHeight: 44,
                      gap: 1,
                      ...(active && { boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}` }),
                    }}
                  >
                    {monthLabel(item)}
                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                      {text('study_view_points', { value: item.report.total })}
                    </Typography>
                    {!item.report.isPublic && (
                      <Label variant="soft" color="warning" sx={{ textTransform: 'none' }}>
                        {text('study_view_draft')}
                      </Label>
                    )}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          <LoadingButton
            variant="contained"
            loading={downloading === 'all'}
            disabled={!!downloading}
            onClick={() => downloadPdf('all')}
            startIcon={<Iconify icon="eva:download-fill" />}
            sx={{ flexShrink: 0, minHeight: 44 }}
          >
            {text('study_view_download_all')}
          </LoadingButton>
        </Stack>

        {/* 4 ô tóm tắt của tháng đang chọn */}
        <Box component={m.div} variants={fadeInUp}>
          <Grid container spacing={2}>
            <Grid xs={6} md={3}>
              {kpi(
                text('study_view_total', { month: monthLabel(view) }),
                bigNumber(report.total, text('study_view_of_1000')),
                changeChip(totalChange)
              )}
            </Grid>
            <Grid xs={6} md={3}>
              {kpi(
                text('study_view_evaluation'),
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ flexWrap: 'wrap', rowGap: 1 }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      typography: 'h4',
                      color: 'primary.contrastText',
                      bgcolor: 'primary.main',
                    }}
                  >
                    {view.evaluation}
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    {evaluationScale.map((step) => (
                      <Label
                        key={step}
                        variant={step === view.evaluation ? 'filled' : 'soft'}
                        color={step === view.evaluation ? 'primary' : 'default'}
                      >
                        {step}
                      </Label>
                    ))}
                  </Stack>
                </Stack>,
                // Điện thoại: ô hẹp — quy tắc xem ở phần "Tiêu chí đánh giá" cuối trang.
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
                >
                  {text('study_view_evaluation_rule')}
                </Typography>
              )}
            </Grid>
            <Grid xs={6} md={3}>
              {kpi(
                text('study_view_progress'),
                bigNumber(
                  view.lesson === null
                    ? report.learningProcess || '—'
                    : text('dashboard_lesson_one', { lesson: view.lesson }),
                  view.lesson === null ? '' : text('study_view_of_lessons')
                ),
                <Stack spacing={0.75}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Box
                      sx={{
                        height: 1,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        width: `${Math.min(100, ((view.lesson ?? 0) / LESSON_MAX) * 100)}%`,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        top: -4,
                        bottom: -4,
                        borderLeft: `2px dashed ${theme.palette.grey[500]}`,
                      }}
                    />
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      typography: 'caption',
                      color: 'text.secondary',
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    <span>{text('dashboard_lesson_mark_start')}</span>
                    <span>{text('dashboard_lesson_mark_n5')}</span>
                    <span>{text('dashboard_lesson_mark_n4')}</span>
                  </Stack>
                </Stack>
              )}
            </Grid>
            <Grid xs={6} md={3}>
              {kpi(
                text('study_view_average'),
                bigNumber(
                  Number(report.average).toFixed(1),
                  text('study_view_of_100', { grade: view.grade })
                ),
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
                >
                  {changeChip(averageChange)}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {text('study_view_level', { level: report.level || '—' })}
                  </Typography>
                </Stack>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Biểu đồ diễn biến + 4 kỹ năng */}
        <Box component={m.div} variants={fadeInUp}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Card sx={CARD_SX}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Box>
                    <Typography variant="h6">{text('study_view_trend_title')}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {text('study_view_trend_subheader', {
                        from: monthLabel(asc[0]),
                        to: monthLabel(asc[asc.length - 1]),
                      })}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    role="group"
                    aria-label={text('study_view_trend_title')}
                    sx={{ p: 0.5, borderRadius: 1.25, bgcolor: 'background.neutral', gap: 0.5 }}
                  >
                    {(['total', 'skills'] as const).map((value) => (
                      <Button
                        key={value}
                        size="small"
                        color="inherit"
                        aria-pressed={mode === value}
                        onClick={() => setMode(value)}
                        sx={{
                          minHeight: { xs: 44, md: 32 },
                          px: 1.5,
                          ...(mode === value
                            ? { bgcolor: 'background.paper', boxShadow: theme.customShadows.z1 }
                            : { color: 'text.secondary' }),
                        }}
                      >
                        {text(`study_view_mode_${value}`)}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
                <Chart
                  key={mode}
                  dir="ltr"
                  type="line"
                  series={series}
                  options={chartOptions}
                  height={300}
                />
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {text('study_view_chart_hint')}
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                <Box>
                  <Typography variant="h6">{text('study_view_skills_title')}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {prev
                      ? text('study_view_skills_subheader', { month: monthLabel(view) })
                      : monthLabel(view)}
                  </Typography>
                </Box>
                {skills.map((skill) => (
                  <Stack key={skill.key} spacing={1}>
                    <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                      <Typography variant="subtitle2">{itemLabel(skill.key)}</Typography>
                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography variant="h6">{skill.value}</Typography>
                        {skill.change && (
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: toneColor(skill.change.tone) }}
                          >
                            {skill.change.text}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 10,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Box
                        sx={{
                          height: 1,
                          borderRadius: 1,
                          width: `${skill.value}%`,
                          bgcolor: barColor(skill.value),
                        }}
                      />
                      {skill.prev !== null && (
                        <Box
                          title={text('study_view_points', { value: skill.prev })}
                          sx={{
                            position: 'absolute',
                            top: -4,
                            bottom: -4,
                            width: 2,
                            left: `${skill.prev}%`,
                            bgcolor: 'text.secondary',
                          }}
                        />
                      )}
                    </Box>
                  </Stack>
                ))}
                <Box
                  sx={{
                    mt: 'auto',
                    px: 1.75,
                    py: 1.5,
                    borderRadius: 1.25,
                    bgcolor: 'background.neutral',
                    typography: 'body2',
                  }}
                >
                  {text('study_view_weakest', {
                    skill: itemLabel(weakest.key),
                    value: weakest.value,
                  })}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Bảng đánh giá của tháng */}
        <Card component={m.div} variants={fadeInUp} sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
              >
                <Typography variant="h6">
                  {text('study_view_detail_title', { month: monthLabel(view) })}
                </Typography>
                {!report.isPublic && (
                  <Label variant="soft" color="warning" sx={{ textTransform: 'none' }}>
                    {text('study_view_draft')}
                  </Label>
                )}
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {text('study_view_detail_subheader', { time: report.time })}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              {isAdmin && !report.isPublic && (
                <LoadingButton
                  variant="soft"
                  color="success"
                  loading={publishing}
                  onClick={handlePublish}
                  startIcon={<Iconify icon="solar:global-bold" />}
                  sx={{ minHeight: 44 }}
                >
                  {text('study_view_publish')}
                </LoadingButton>
              )}
              <LoadingButton
                variant="outlined"
                color="inherit"
                loading={downloading === 'month'}
                disabled={!!downloading}
                onClick={() => downloadPdf('month')}
                startIcon={<Iconify icon="eva:download-fill" />}
                sx={{ minHeight: 44 }}
              >
                {text('study_view_download_month')}
              </LoadingButton>
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setAskDelete(true)}
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  sx={{ minHeight: 44 }}
                >
                  {text('study_view_delete')}
                </Button>
              )}
            </Stack>
          </Stack>

          <Grid container spacing={4}>
            <Grid xs={12} md={7}>
              <Stack spacing={3}>
                {group(text('study_view_group_general'), GENERAL_KEYS)}
                {group(text('study_view_group_japanese'), JAPANESE_KEYS)}
              </Stack>
            </Grid>
            <Grid xs={12} md={5}>
              <Stack spacing={2}>
                <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1.5}>
                  {miniStat(
                    text('study_view_evaluation'),
                    text('study_view_evaluation_value', {
                      evaluation: view.evaluation,
                      total: report.total,
                    })
                  )}
                  {miniStat(text('study_view_grade'), view.grade)}
                  {miniStat(text('study_view_level_label'), report.level || '—')}
                  {miniStat(text('study_view_progress_short'), report.learningProcess || '—')}
                </Box>

                {jlpt.length > 0 && (
                  <Box
                    sx={{
                      px: 1.75,
                      py: 1.5,
                      borderRadius: 1.25,
                      border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {text('study_view_jlpt', { level: report.level || '' })}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                      {jlpt.map((item) => (
                        <Box key={item.key}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {text(`study_view_jlpt_${item.key}`)}
                          </Typography>
                          <Typography variant="subtitle1">{item.value} / 60</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {report.characteristic && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {text('study_view_character')}
                    </Typography>
                    <Label variant="soft" color="info" sx={{ textTransform: 'none' }}>
                      {report.characteristic}
                    </Label>
                  </Stack>
                )}

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Iconify icon="solar:chat-round-dots-bold" sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2">{text('study_view_comment')}</Typography>
                  </Stack>
                  <Box sx={{ typography: 'body2', '& p': { m: 0 } }}>
                    <Markdown children={report.comment || ''} />
                  </Box>
                  {report.teacher && (
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ color: 'text.secondary', mt: 1 }}
                    >
                      {text('study_view_teacher', { name: report.teacher })}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderStyle: 'dashed', mt: 3, mb: 1.5 }} />
          <Button
            color="inherit"
            onClick={() => setShowCriteria((open) => !open)}
            aria-expanded={showCriteria}
            endIcon={
              <Iconify
                icon={showCriteria ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              />
            }
            sx={{ minHeight: 44, color: 'text.secondary' }}
          >
            {text('study_view_criteria')}
          </Button>
          <Collapse in={showCriteria} unmountOnExit>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 5 }}
              sx={{ pt: 1.5, typography: 'body2', color: 'text.secondary' }}
            >
              <Box display="grid" gridTemplateColumns="28px auto" gap="6px 12px">
                {[
                  ['●', text('study_view_range_gte', { min: 90 })],
                  ['◎', text('study_view_range', { min: 80, max: 89 })],
                  ['○', text('study_view_range', { min: 70, max: 79 })],
                  ['△', text('study_view_range', { min: 50, max: 69 })],
                  ['×', text('study_view_range_lt', { max: 50 })],
                ].map(([symbol, range]) => (
                  <Box key={symbol} sx={{ display: 'contents' }}>
                    <Box component="b" sx={{ color: 'text.primary' }}>
                      {symbol}
                    </Box>
                    <span>{range}</span>
                  </Box>
                ))}
              </Box>
              <Box display="grid" gridTemplateColumns="36px auto" gap="6px 12px">
                {[
                  ['秀', text('study_view_total_range_gte', { min: 900 })],
                  ['優', text('study_view_total_range', { min: 800, max: 899 })],
                  ['良', text('study_view_total_range', { min: 700, max: 799 })],
                  ['可', text('study_view_total_range', { min: 500, max: 699 })],
                  ['不可', text('study_view_fail_rule')],
                ].map(([step, range]) => (
                  <Box key={step} sx={{ display: 'contents' }}>
                    <Box component="b" sx={{ color: 'text.primary' }}>
                      {step}
                    </Box>
                    <span>{range}</span>
                  </Box>
                ))}
              </Box>
              <Box display="grid" gridTemplateColumns="36px auto" gap="6px 12px">
                {[
                  ['A+', text('study_view_range_gte', { min: 90 })],
                  ['A', text('study_view_range', { min: 80, max: 89 })],
                  ['B+', text('study_view_range', { min: 70, max: 79 })],
                  ['B', text('study_view_range', { min: 60, max: 69 })],
                  ['B-', text('study_view_range', { min: 50, max: 59 })],
                  ['C', text('study_view_range_lt', { max: 50 })],
                ].map(([step, range]) => (
                  <Box key={step} sx={{ display: 'contents' }}>
                    <Box component="b" sx={{ color: 'text.primary' }}>
                      {step}
                    </Box>
                    <span>{range}</span>
                  </Box>
                ))}
                <Box sx={{ gridColumn: '1 / -1', typography: 'caption' }}>
                  {text('study_view_grade_note')}
                </Box>
              </Box>
            </Stack>
          </Collapse>
        </Card>

        <ConfirmDialog
          open={askDelete}
          onClose={() => setAskDelete(false)}
          title={text('study_view_delete')}
          content={
            report.isPublic
              ? text('study_delete_published_confirm')
              : text('study_view_delete_confirm')
          }
          action={
            <Button variant="contained" color="error" onClick={handleDelete}>
              {text('study_view_delete')}
            </Button>
          }
        />
      </Stack>
    </MotionContainer>
  );
}
