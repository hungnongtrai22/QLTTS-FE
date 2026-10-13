import { m } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/ja';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { DEFAULT_SOURCE_NAME } from 'src/utils/source';
// types
import {
  IStudyReportRow,
  IStudyReportStatus,
  IStudyReportFilters,
  IStudyReportFilterValue,
} from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import StudyReportDialog from '../study-report-dialog';
import StudyReportTableToolbar from '../study-report-table-toolbar';
import StudyReportTableRow, { STATUS_COLOR, StudyReportViewRow } from '../study-report-table-row';

// ----------------------------------------------------------------------

// Tổng điểm (10 mục, tối đa 1000) giảm từ mức này trở lên so với tháng trước thì đánh dấu
// "Cần chú ý". Trên dữ liệu thật trung vị thay đổi là -6, chỉ ~12% lượt giảm từ 50 điểm.
const ATTENTION_DROP = 50;

const STATUS_TABS: Array<'all' | IStudyReportStatus> = ['all', 'missing', 'draft', 'published'];

const STATUS_ORDER: Record<IStudyReportStatus, number> = { missing: 0, draft: 1, published: 2 };

const defaultFilters: IStudyReportFilters = {
  name: '',
  status: 'all',
  tradeUnion: [],
  company: [],
  source: [],
  teacher: [],
  attention: false,
};

const fadeInUp = varFade({ distance: 24 }).inUp;

// Ngày 1 lúc 00:00 giờ máy — cùng dạng giá trị DatePicker và form nhập điểm dùng.
const addMonths = (date: Date, count: number) =>
  new Date(date.getFullYear(), date.getMonth() + count, 1);

// Tháng hiện tại theo giờ Việt Nam.
const currentMonth = () => {
  const vn = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return new Date(vn.getUTCFullYear(), vn.getUTCMonth(), 1);
};

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

// Bỏ dấu để tìm "cuong" ra "CƯỜNG".
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

const toViewRow = (row: IStudyReportRow, month: Date): StudyReportViewRow => {
  const total = row.report?.total ?? null;
  const delta = total !== null && row.prevTotal !== null ? total - row.prevTotal : null;

  let reportStatus: IStudyReportStatus = 'missing';
  if (row.report) reportStatus = row.report.isPublic ? 'published' : 'draft';

  const studyDate = row.studyDate ? new Date(row.studyDate) : null;

  return {
    ...row,
    reportStatus,
    total,
    delta,
    attention: delta !== null && delta <= -ATTENTION_DROP,
    teacherName: row.report?.teacher || row.lastTeacher,
    // TTS chưa có nguồn thuộc "Nhật Tân" — cùng quy ước với bộ lọc danh sách TTS.
    sourceName: row.source || DEFAULT_SOURCE_NAME,
    isNew: !!studyDate && studyDate >= month && studyDate < addMonths(month, 1),
  };
};

const sortValue = (row: StudyReportViewRow, orderBy: string): string | number | null => {
  switch (orderBy) {
    case 'reportStatus':
      return STATUS_ORDER[row.reportStatus];
    case 'total':
      return row.total;
    case 'delta':
      return row.delta;
    case 'company':
      return row.company || null;
    case 'teacherName':
      return row.teacherName || null;
    default:
      return row.name;
  }
};

// Ô trống luôn xuống cuối dù sắp tăng hay giảm; bằng nhau thì xếp theo tên.
const compareRows = (order: 'asc' | 'desc', orderBy: string) => {
  const byName = (a: StudyReportViewRow, b: StudyReportViewRow) =>
    a.name.localeCompare(b.name, 'vi');

  return (a: StudyReportViewRow, b: StudyReportViewRow) => {
    const valueA = sortValue(a, orderBy);
    const valueB = sortValue(b, orderBy);
    if (valueA === null && valueB === null) return byName(a, b);
    if (valueA === null) return 1;
    if (valueB === null) return -1;
    const diff =
      typeof valueA === 'string'
        ? valueA.localeCompare(String(valueB), 'vi')
        : valueA - Number(valueB);
    return (order === 'asc' ? diff : -diff) || byName(a, b);
  };
};

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'vi'));

// ----------------------------------------------------------------------

export default function StudyReportView() {
  const { t, currentLang } = useLocales();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const table = useTable({ defaultOrderBy: 'name', defaultRowsPerPage: 25 });

  const { onResetPage } = table;

  const thisMonth = useMemo(() => currentMonth(), []);

  const [month, setMonth] = useState<Date>(thisMonth);

  const [rows, setRows] = useState<IStudyReportRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<IStudyReportFilters>(defaultFilters);

  const [editing, setEditing] = useState<IStudyReportRow | null>(null);

  const isThisMonth = monthKey(month) === monthKey(thisMonth);

  const monthLabel = t('study_report_month_label', {
    month: month.getMonth() + 1,
    year: month.getFullYear(),
  });

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/study/tracker`, {
        params: { month: monthKey(month) },
      });
      setRows(data.rows || []);
    } catch (error) {
      console.error(error);
      setRows([]);
      enqueueSnackbar(error?.response?.data?.message || t('study_report_load_failed'), {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [month, enqueueSnackbar, t]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const viewRows = useMemo(() => rows.map((row) => toViewRow(row, month)), [rows, month]);

  const options = useMemo(
    () => ({
      tradeUnion: uniqueSorted(viewRows.map((row) => row.tradeUnion)),
      company: uniqueSorted(viewRows.map((row) => row.company)),
      // "Nhật Tân" luôn đứng đầu như ở danh sách TTS.
      source: [
        DEFAULT_SOURCE_NAME,
        ...uniqueSorted(viewRows.map((row) => row.source)).filter(
          (name) => name !== DEFAULT_SOURCE_NAME
        ),
      ],
      teacher: uniqueSorted(viewRows.map((row) => row.teacherName)),
    }),
    [viewRows]
  );

  // Bộ lọc "phạm vi" (nghiệp đoàn, công ty, nguồn, giáo viên, tên): tiến độ tính trên phạm vi này,
  // để giáo viên lọc lớp mình là thấy ngay lớp mình đã nhập được bao nhiêu.
  const scopedRows = useMemo(() => {
    const keyword = normalize(filters.name.trim());
    return viewRows.filter(
      (row) =>
        (!filters.tradeUnion.length || filters.tradeUnion.includes(row.tradeUnion)) &&
        (!filters.company.length || filters.company.includes(row.company)) &&
        (!filters.source.length || filters.source.includes(row.sourceName)) &&
        (!filters.teacher.length || filters.teacher.includes(row.teacherName)) &&
        (!keyword ||
          normalize(row.name).includes(keyword) ||
          normalize(row.namejp).includes(keyword))
    );
  }, [
    viewRows,
    filters.name,
    filters.tradeUnion,
    filters.company,
    filters.source,
    filters.teacher,
  ]);

  // Số trên các tab: theo phạm vi + "Cần chú ý", bỏ qua chính bộ lọc trạng thái.
  const tabRows = useMemo(
    () => (filters.attention ? scopedRows.filter((row) => row.attention) : scopedRows),
    [scopedRows, filters.attention]
  );

  const counts = useMemo(() => {
    const result: Record<'all' | IStudyReportStatus, number> = {
      all: tabRows.length,
      missing: 0,
      draft: 0,
      published: 0,
    };
    tabRows.forEach((row) => {
      result[row.reportStatus] += 1;
    });
    return result;
  }, [tabRows]);

  const progress = useMemo(() => {
    const done = scopedRows.filter((row) => row.reportStatus !== 'missing').length;
    const total = scopedRows.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [scopedRows]);

  const attentionCount = useMemo(
    () => scopedRows.filter((row) => row.attention).length,
    [scopedRows]
  );

  const dataFiltered = useMemo(
    () =>
      tabRows
        .filter((row) => filters.status === 'all' || row.reportStatus === filters.status)
        .sort(compareRows(table.order, table.orderBy)),
    [tabRows, filters.status, table.order, table.orderBy]
  );

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name ||
    filters.attention ||
    filters.tradeUnion.length > 0 ||
    filters.company.length > 0 ||
    filters.source.length > 0 ||
    filters.teacher.length > 0;

  const notFound = !loading && !dataFiltered.length;

  const tableHead = useMemo(
    () =>
      mdUp
        ? [
            { id: 'name', label: t('study_report_col_intern'), minWidth: 200, width: 230 },
            { id: 'company', label: t('study_report_col_company'), width: 200 },
            { id: 'teacherName', label: t('teacher'), width: 150 },
            // Ngày cập nhật hiện ngay dưới nhãn trạng thái (bớt một cột cho vừa laptop).
            { id: 'reportStatus', label: t('status'), width: 150 },
            { id: 'total', label: t('study_report_col_total'), width: 90 },
            { id: 'delta', label: t('study_report_col_change'), width: 110 },
            { id: '', width: 130 },
          ]
        : // Điện thoại: dòng gộp (xem StudyReportTableRow compact) — không phải cuộn ngang.
          [
            { id: 'name', label: t('study_report_col_intern') },
            { id: '', width: 64 },
          ],
    [t, mdUp]
  );

  const handleFilters = useCallback(
    (name: string, value: IStudyReportFilterValue) => {
      onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [onResetPage]
  );

  const handleResetFilters = useCallback(() => {
    onResetPage();
    setFilters((prev) => ({ ...defaultFilters, status: prev.status }));
  }, [onResetPage]);

  const handleChangeMonth = useCallback(
    (next: Date) => {
      onResetPage();
      setMonth(next);
    },
    [onResetPage]
  );

  const handleViewProfile = useCallback((id: string) => {
    window.open(paths.dashboard.intern.profile(id), '_blank');
  }, []);

  const handleSaved = useCallback(() => {
    setEditing(null);
    fetchRows();
  }, [fetchRows]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('study_report') || ''}
        links={[
          { name: t('dashboard') || '', href: paths.dashboard.root },
          { name: t('intern') || '', href: paths.dashboard.intern.list },
          { name: t('study_report') || '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MotionContainer>
        <Card component={m.div} variants={fadeInUp}>
          {/* Chọn tháng + tiến độ nhập */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            spacing={2.5}
            sx={{ p: 2.5 }}
          >
            {/* Điện thoại: nút "Tháng này" xuống dòng riêng để ô chọn tháng không bị bóp. */}
            <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
              <IconButton
                onClick={() => handleChangeMonth(addMonths(month, -1))}
                sx={{ p: { xs: 1.5, md: 1 } }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={currentLang.value === 'jp' ? 'ja' : 'vi'}
              >
                <DatePicker
                  label={t('study_report_month')}
                  views={['year', 'month']}
                  openTo="month"
                  format="MM/YYYY"
                  value={dayjs(month)}
                  maxDate={dayjs(thisMonth)}
                  onChange={(value) => {
                    if (value && value.isValid()) {
                      handleChangeMonth(new Date(value.year(), value.month(), 1));
                    }
                  }}
                  slotProps={{
                    textField: {
                      sx: { flex: { xs: 1, sm: 'none' }, width: { sm: 180 }, minWidth: 0 },
                    },
                  }}
                />
              </LocalizationProvider>

              <IconButton
                disabled={isThisMonth}
                onClick={() => handleChangeMonth(addMonths(month, 1))}
                sx={{ p: { xs: 1.5, md: 1 } }}
              >
                <Iconify icon="eva:arrow-ios-forward-fill" />
              </IconButton>

              {!isThisMonth && (
                <Button
                  onClick={() => handleChangeMonth(thisMonth)}
                  sx={{ flexShrink: 0, minHeight: 44, width: { xs: 1, sm: 'auto' } }}
                >
                  {t('study_report_this_month')}
                </Button>
              )}
            </Stack>

            <Stack spacing={1} sx={{ width: { xs: 1, md: 380 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="subtitle2">
                  {t('study_report_progress', { done: progress.done, total: progress.total })}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {progress.percent}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress.percent}
                color={progress.percent === 100 ? 'success' : 'primary'}
                sx={{ height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {t('study_report_scope_note')}
              </Typography>
            </Stack>
          </Stack>

          <Tabs
            value={filters.status}
            onChange={(event, value) => handleFilters('status', value)}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_TABS.map((tab) => (
              <Tab
                key={tab}
                value={tab}
                iconPosition="end"
                label={t(`study_report_tab_${tab}`)}
                icon={
                  <Label
                    variant={tab === 'all' || tab === filters.status ? 'filled' : 'soft'}
                    color={tab === 'all' ? 'default' : STATUS_COLOR[tab]}
                  >
                    {counts[tab]}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <StudyReportTableToolbar
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            options={options}
            attentionCount={attentionCount}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: mdUp ? 960 : 0 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={tableHead}
                  onSort={table.onSort}
                  sx={{ '& th': { whiteSpace: 'nowrap' } }}
                />

                <TableBody>
                  {loading
                    ? [...Array(5)].map((_, index) => <TableSkeleton key={index} />)
                    : dataInPage.map((row) => (
                        <StudyReportTableRow
                          key={row._id}
                          row={row}
                          compact={!mdUp}
                          attentionDrop={ATTENTION_DROP}
                          onEnter={setEditing}
                          onViewProfile={handleViewProfile}
                        />
                      ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            rowsPerPageOptions={[25, 50, 100]}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </MotionContainer>

      <StudyReportDialog
        row={editing}
        month={month}
        monthLabel={monthLabel}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />
    </Container>
  );
}
