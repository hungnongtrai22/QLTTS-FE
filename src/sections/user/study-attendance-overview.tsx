import axios from 'axios';
import { m } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CardActionArea from '@mui/material/CardActionArea';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IInternItem, IStudyItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Chart, { useChart } from 'src/components/chart';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { MotionContainer, varFade } from 'src/components/animate';
//
import {
  ATTEND_LOW,
  ATTEND_RECENT,
  AttendItem,
  AttendanceMonth,
  AttendRecordGroup,
  buildAttendanceMonths,
  summarizeAttendance,
} from './attendance-overview-utils';

// ----------------------------------------------------------------------
// Tab 出席 của hồ sơ TTS cho đối tác (nghiệp đoàn / công ty / demo / Đồng Tháp). Admin và nguồn
// vẫn dùng lịch điểm danh để nhập (CalendarPage).
//
// Chuyên cần = điểm 出席状況 trong báo cáo học tập đã công khai (study/listByInternIdPublic).
// Ô / cột "ghi nhận nghỉ" chỉ hiện khi lịch điểm danh thật sự có ghi nhận — lịch hầu như không
// được nhập, hiện "không có" sẽ khiến đối tác hiểu nhầm là đi học đầy đủ.
// ----------------------------------------------------------------------

type Props = {
  intern?: IInternItem;
  // Mở báo cáo của tháng đó ở tab 学習成績
  onOpenReport: (reportId: string) => void;
};

// Biểu đồ chỉ vẽ chừng này tháng gần nhất; bảng bên dưới đủ mọi tháng.
const CHART_MONTHS = 12;

const fadeInUp = varFade({ distance: 24 }).inUp;

const TILE_SX = { p: { xs: 2, md: 3 }, height: 1 };

export default function StudyAttendanceOverview({ intern, onOpenReport }: Props) {
  const theme = useTheme();

  const { t, currentLang } = useLocales();

  const lang = currentLang.value;

  // t() có thể trả null — nơi cần chuỗi (join, nhãn biểu đồ) dùng tx.
  const tx = (key: string, options?: Record<string, unknown>) => t(key, { ...options }) || '';

  const mdUp = useResponsive('up', 'md');

  // Điện thoại: 12 cột không đủ chỗ cho nhãn số của mọi cột.
  const smUp = useResponsive('up', 'sm');

  const { enqueueSnackbar } = useSnackbar();

  const [reports, setReports] = useState<IStudyItem[]>();

  const [items, setItems] = useState<AttendItem[]>([]);

  const internId = intern?._id;

  useEffect(() => {
    if (!internId) return;
    const host = process.env.REACT_APP_HOST_API;
    axios
      .post(`${host}/api/study/listByInternIdPublic`, { internId })
      .then(({ data }) => setReports(data.studies || []))
      .catch((error) => {
        console.error(error);
        setReports([]);
        enqueueSnackbar(t('attend_view_failed'), { variant: 'error' });
      });
    // Ghi nhận nghỉ chỉ để kèm chi tiết — lỗi thì bỏ qua, không chặn phần chuyên cần.
    axios
      .post(`${host}/api/attendance/getAllAttendByInternId`, { internId })
      .then(({ data }) => setItems(data.attend || []))
      .catch((error) => console.error(error));
  }, [internId, enqueueSnackbar, t]);

  const months = useMemo(() => buildAttendanceMonths(reports || [], items), [reports, items]);

  const summary = useMemo(() => summarizeAttendance(months), [months]);

  const chartMonths = useMemo(() => months.slice(0, CHART_MONTHS).reverse(), [months]);

  const monthLabel = (row: { year: number; month: number }) =>
    t('study_view_month', { month: row.month, year: row.year });

  // "4月13日" / "4月13日〜17日" / "4月29日〜5月2日" (vi: "13/4", "13–17/4", "29/4–2/5")
  const dateText = ({ start, end }: AttendRecordGroup) => {
    const month = (date: Date) => date.getUTCMonth() + 1;
    const day = (date: Date) => date.getUTCDate();
    if (lang === 'jp') {
      const from = `${month(start)}月${day(start)}日`;
      if (!end) return from;
      return month(end) === month(start)
        ? `${from}〜${day(end)}日`
        : `${from}〜${month(end)}月${day(end)}日`;
    }
    if (!end) return `${day(start)}/${month(start)}`;
    return month(end) === month(start)
      ? `${day(start)}–${day(end)}/${month(start)}`
      : `${day(start)}/${month(start)}–${day(end)}/${month(end)}`;
  };

  const recordText = (group: AttendRecordGroup) =>
    tx('attend_view_record_line', {
      date: dateText(group),
      kind: tx(`attend_view_kind_${group.kind}`),
      reason: group.reason,
    }).trim();

  const recordsSummary = (absent: number, late: number, soon: number) =>
    [
      absent > 0 && t('attend_view_absent_days', { days: absent }),
      late > 0 && t('attend_view_late_count', { count: late }),
      soon > 0 && t('attend_view_soon_count', { count: soon }),
    ]
      .filter(Boolean)
      .join(tx('attend_view_separator'));

  const deltaInfo = () => {
    if (summary.delta === null) return null;
    const value =
      (summary.delta > 0 && `▲ +${summary.delta}`) ||
      (summary.delta < 0 && `▼ −${Math.abs(summary.delta)}`) ||
      '±0';
    return {
      text: summary.deltaVsLastMonth
        ? t('study_view_vs_last_month', { value })
        : t('study_view_vs_last_report', { value }),
      color: (summary.delta > 0 && 'success.dark') || 'text.secondary',
    };
  };

  const chartOptions = useChart({
    colors: chartMonths.map((row) =>
      row.low ? theme.palette.warning.main : theme.palette.primary.main
    ),
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: '42%',
        borderRadius: 6,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      // Điện thoại chỉ ghi số của tháng dưới mức (vạch 80 đã nói tháng nào đạt).
      formatter: (value: number) => (smUp || value < ATTEND_LOW ? value : ''),
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: chartMonths.map((row) =>
          row.low ? theme.palette.warning.dark : theme.palette.text.primary
        ),
      },
    },
    legend: { show: false },
    xaxis: {
      categories: chartMonths.map((row) => t('study_view_axis_short', { month: row.month })),
    },
    yaxis: { min: 0, max: 100, tickAmount: 5 },
    // Vạch 80 trùng vạch chia "80" của trục dọc và phụ đề đã giải thích, nên không ghi nhãn
    // (nhãn đặt trong vùng vẽ sẽ đè lên cột đầu ở màn hình hẹp).
    annotations: {
      yaxis: [
        {
          y: ATTEND_LOW,
          borderColor: theme.palette.text.disabled,
          strokeDashArray: 4,
        },
      ],
    },
    tooltip: {
      y: { formatter: (value: number) => t('study_view_points', { value }) },
    },
  });

  if (!reports) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    );
  }

  if (!months.length) {
    return <EmptyContent filled title={t('attend_view_empty') || ''} sx={{ py: 10 }} />;
  }

  const { latest } = summary;
  const delta = deltaInfo();
  const showRecordsTile = summary.recentAbsent + summary.recentLate + summary.recentSoon > 0;
  const tiles = showRecordsTile ? 4 : 3;
  const { recent } = summary;

  const symbolLabel = (row: AttendanceMonth) => (
    <Label variant="soft" color={row.low ? 'warning' : 'default'}>
      {row.symbol}
    </Label>
  );

  const recordsCell = (row: AttendanceMonth) =>
    row.groups.length ? (
      <Stack spacing={0.25}>
        {row.groups.map((group) => (
          <Typography key={group.key} variant="body2">
            {recordText(group)}
          </Typography>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('attend_view_no_records')}
      </Typography>
    );

  const renderTable = (
    <TableContainer>
      <Scrollbar>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 160 }}>{t('attend_view_col_month')}</TableCell>
              <TableCell sx={{ width: 200 }}>{t('attend_view_col_score')}</TableCell>
              {summary.hasRecords && <TableCell>{t('attend_view_records')}</TableCell>}
              <TableCell align="right" sx={{ width: 180 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((row) => (
              <TableRow
                key={row.key}
                sx={{ ...(row.low && { bgcolor: alpha(theme.palette.warning.main, 0.06) }) }}
              >
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {monthLabel(row)}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: row.low ? 'warning.dark' : 'text.primary' }}
                    >
                      {row.score}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      / 100
                    </Typography>
                    {symbolLabel(row)}
                  </Stack>
                </TableCell>
                {summary.hasRecords && <TableCell>{recordsCell(row)}</TableCell>}
                <TableCell align="right">
                  <Button
                    color="primary"
                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    onClick={() => onOpenReport(row.reportId)}
                    sx={{ minHeight: 44, whiteSpace: 'nowrap' }}
                  >
                    {t('attend_view_open_report')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  const renderCards = (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {months.map((row) => (
        <Card
          key={row.key}
          variant="outlined"
          sx={{ ...(row.low && { bgcolor: alpha(theme.palette.warning.main, 0.06) }) }}
        >
          <CardActionArea
            onClick={() => onOpenReport(row.reportId)}
            aria-label={t('attend_view_open_report_for', { month: monthLabel(row) }) || ''}
            sx={{ p: 2, minHeight: 64 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="subtitle2">{monthLabel(row)}</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: row.low ? 'warning.dark' : 'text.primary' }}
                  >
                    {row.score}
                  </Typography>
                  {symbolLabel(row)}
                </Stack>
                {summary.hasRecords && recordsCell(row)}
              </Stack>
              <Iconify icon="eva:arrow-ios-forward-fill" sx={{ color: 'text.secondary' }} />
            </Stack>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );

  return (
    <MotionContainer>
      <Stack spacing={3}>
        <m.div variants={fadeInUp}>
          <Stack spacing={0.5}>
            <Typography variant="h5">{t('attend_view_title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('attend_view_intro')}
            </Typography>
          </Stack>
        </m.div>

        <m.div variants={fadeInUp}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: `repeat(${tiles}, minmax(0, 1fr))`,
              },
            }}
          >
            {latest && (
              <Card sx={TILE_SX}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {t('attend_view_latest', { month: monthLabel(latest) })}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1} flexWrap="wrap">
                    <Typography
                      variant="h3"
                      sx={{ color: latest.low ? 'warning.dark' : 'text.primary' }}
                    >
                      {latest.score}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('attend_view_of_100')}
                    </Typography>
                    {symbolLabel(latest)}
                  </Stack>
                  {delta && (
                    <Typography variant="caption" sx={{ fontWeight: 600, color: delta.color }}>
                      {delta.text}
                    </Typography>
                  )}
                </Stack>
              </Card>
            )}

            <Card sx={TILE_SX}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {t('attend_view_average', { count: recent.length })}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h3">{summary.average}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('attend_view_of_100')}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('attend_view_average_sub', {
                    from: monthLabel(recent[recent.length - 1]),
                    to: monthLabel(recent[0]),
                    count: recent.length,
                  })}
                </Typography>
              </Stack>
            </Card>

            <Card sx={TILE_SX}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {t('attend_view_low', { value: ATTEND_LOW })}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                  <Typography
                    variant="h3"
                    sx={{ color: summary.lowMonths.length ? 'warning.dark' : 'text.primary' }}
                  >
                    {summary.lowMonths.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('attend_view_low_unit')}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: summary.lowMonths.length ? 600 : 400,
                    color: summary.lowMonths.length ? 'warning.dark' : 'text.secondary',
                  }}
                >
                  {summary.lowMonths.length
                    ? summary.lowMonths
                        .slice(0, 3)
                        .map((row) =>
                          t('attend_view_low_item', { month: monthLabel(row), value: row.score })
                        )
                        .join(tx('attend_view_separator'))
                    : t('attend_view_low_none')}
                </Typography>
              </Stack>
            </Card>

            {showRecordsTile && (
              <Card sx={TILE_SX}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {t('attend_view_records')}
                  </Typography>
                  <Typography variant="h5">
                    {recordsSummary(summary.recentAbsent, summary.recentLate, summary.recentSoon)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('attend_view_records_sub', { count: ATTEND_RECENT })}
                  </Typography>
                </Stack>
              </Card>
            )}
          </Box>
        </m.div>

        <m.div variants={fadeInUp}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
              spacing={1}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6">{t('attend_view_chart_title')}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('attend_view_chart_sub', { value: ATTEND_LOW })}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                aria-hidden
                sx={{ typography: 'caption', color: 'text.secondary' }}
              >
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: 'primary.main' }} />
                  <span>{t('attend_view_legend_ok', { value: ATTEND_LOW })}</span>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: 'warning.main' }} />
                  <span>{t('attend_view_legend_low', { value: ATTEND_LOW })}</span>
                </Stack>
              </Stack>
            </Stack>
            <Chart
              dir="ltr"
              type="bar"
              series={[
                { name: tx('attend_view_col_score'), data: chartMonths.map((row) => row.score) },
              ]}
              options={chartOptions}
              height={280}
            />
          </Card>
        </m.div>

        <m.div variants={fadeInUp}>
          <Card>
            <Typography variant="h6" sx={{ p: { xs: 2, md: 3 }, pb: { xs: 0, md: 1 } }}>
              {t('attend_view_list_title')}
            </Typography>
            {mdUp ? renderTable : renderCards}
            <Typography
              variant="caption"
              component="p"
              sx={{
                px: { xs: 2, md: 3 },
                py: 2,
                color: 'text.secondary',
                borderTop: (th) => `dashed 1px ${th.palette.divider}`,
              }}
            >
              {t('attend_view_symbol_legend')}
            </Typography>
          </Card>
        </m.div>
      </Stack>
    </MotionContainer>
  );
}
