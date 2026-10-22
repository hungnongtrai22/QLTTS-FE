import { m } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hook';
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
  IStudyAttentionReason,
} from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import StudyReportDialog from '../study-report-dialog';
import StudyExportDialog from '../study-export-dialog';
import StudyMonthPicker from '../study-month-picker';
import {
  addMonths,
  currentMonth,
  monthKey,
  normalizeSearch,
  parseMonthKey,
  uniqueSorted,
} from '../study-report-utils';
// Cùng ngưỡng với tab 出席 của đối tác
import { ATTEND_LOW } from '../attendance-overview-utils';
import StudyReportTableToolbar from '../study-report-table-toolbar';
import StudyReportTableRow, { STATUS_COLOR, StudyReportViewRow } from '../study-report-table-row';

// ----------------------------------------------------------------------

// "Cần chú ý" — ba lý do, ngưỡng chọn theo dữ liệu thật:
// - Tổng điểm (10 mục, tối đa 1000) giảm từ ATTENTION_DROP trở lên so với tháng trước. Trung vị
//   thay đổi là -6, chỉ ~12% lượt giảm từ 50 điểm.
// - Điểm chuyên cần (0–100) dưới ATTEND_LOW. Trung vị 100, chỉ ~2% báo cáo dưới 80.
// - Chưa nhập báo cáo cả tháng trước lẫn tháng này, dù đã nhập học từ trước tháng trước.
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
  attentionReason: '',
};

const fadeInUp = varFade({ distance: 24 }).inUp;

const toViewRow = (row: IStudyReportRow, month: Date): StudyReportViewRow => {
  const total = row.report?.total ?? null;
  const delta = total !== null && row.prevTotal !== null ? total - row.prevTotal : null;

  let reportStatus: IStudyReportStatus = 'missing';
  if (row.report) reportStatus = row.report.isPublic ? 'published' : 'draft';

  const studyDate = row.studyDate ? new Date(row.studyDate) : null;

  const attend = row.report?.attend ?? null;

  const reasons: IStudyAttentionReason[] = [];
  if (delta !== null && delta <= -ATTENTION_DROP) reasons.push('drop');
  if (attend !== null && attend < ATTEND_LOW) reasons.push('attend');
  // prevTotal null = tháng trước không có báo cáo (total là trường bắt buộc). Chỉ tính TTS đã
  // học trọn tháng trước — mới nhập học thì chưa có báo cáo là bình thường.
  if (!row.report && row.prevTotal === null && !!studyDate && studyDate < addMonths(month, -1)) {
    reasons.push('missing2');
  }

  return {
    ...row,
    reportStatus,
    total,
    delta,
    reasons,
    attention: reasons.length > 0,
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

// ----------------------------------------------------------------------

export default function StudyReportView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const table = useTable({ defaultOrderBy: 'name', defaultRowsPerPage: 25 });

  const { onResetPage, selected, onSelectRow, onSelectAllRows } = table;

  const thisMonth = useMemo(() => currentMonth(), []);

  const searchParams = useSearchParams();

  // Mở đúng tháng khi quay về từ trang Nhập điểm hàng loạt (?month=YYYY-MM).
  const [month, setMonth] = useState<Date>(() => {
    const fromUrl = parseMonthKey(searchParams.get('month'));
    return fromUrl && fromUrl <= thisMonth ? fromUrl : thisMonth;
  });

  const [rows, setRows] = useState<IStudyReportRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<IStudyReportFilters>(defaultFilters);

  const [editing, setEditing] = useState<IStudyReportRow | null>(null);

  // Công khai / thu hồi hàng loạt: chờ xác nhận (reportIds = id báo cáo, không phải id TTS).
  const [publishAsk, setPublishAsk] = useState<{ isPublic: boolean; reportIds: string[] } | null>(
    null
  );

  const [publishing, setPublishing] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);

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
    const keyword = normalizeSearch(filters.name.trim());
    return viewRows.filter(
      (row) =>
        (!filters.tradeUnion.length || filters.tradeUnion.includes(row.tradeUnion)) &&
        (!filters.company.length || filters.company.includes(row.company)) &&
        (!filters.source.length || filters.source.includes(row.sourceName)) &&
        (!filters.teacher.length || filters.teacher.includes(row.teacherName)) &&
        (!keyword ||
          normalizeSearch(row.name).includes(keyword) ||
          normalizeSearch(row.namejp).includes(keyword))
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
  const tabRows = useMemo(() => {
    const reason = filters.attentionReason;
    if (reason) return scopedRows.filter((row) => row.reasons.includes(reason));
    return filters.attention ? scopedRows.filter((row) => row.attention) : scopedRows;
  }, [scopedRows, filters.attention, filters.attentionReason]);

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

  // Một TTS có thể có nhiều lý do: "all" đếm người, từng lý do đếm riêng.
  const attentionCounts = useMemo(() => {
    const result: Record<'all' | IStudyAttentionReason, number> = {
      all: 0,
      drop: 0,
      attend: 0,
      missing2: 0,
    };
    scopedRows.forEach((row) => {
      if (row.attention) result.all += 1;
      row.reasons.forEach((reason) => {
        result[reason] += 1;
      });
    });
    return result;
  }, [scopedRows]);

  const attentionFilters: Array<{
    value: '' | IStudyAttentionReason;
    label: string;
    hint: string;
    count: number;
  }> = [
    { value: '', label: t('study_report_tab_all') || '', hint: '', count: attentionCounts.all },
    {
      value: 'drop',
      label: t('study_attention_filter_drop', { points: ATTENTION_DROP }) || '',
      hint: t('study_report_attention_hint', { points: ATTENTION_DROP }) || '',
      count: attentionCounts.drop,
    },
    {
      value: 'attend',
      label: t('study_attention_filter_attend', { value: ATTEND_LOW }) || '',
      hint: t('study_attention_hint_attend', { value: ATTEND_LOW }) || '',
      count: attentionCounts.attend,
    },
    {
      value: 'missing2',
      label: t('study_attention_filter_missing2') || '',
      hint: t('study_attention_hint_missing2') || '',
      count: attentionCounts.missing2,
    },
  ];

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

  // Ô chọn ở đầu bảng chỉ chọn trong trang hiện tại, và chỉ dòng đã có báo cáo.
  const pageSelectableIds = dataInPage.filter((row) => row.report).map((row) => row._id);

  const selectedReports = useMemo(
    () => viewRows.filter((row) => row.report && selected.includes(row._id)),
    [viewRows, selected]
  );

  const selectedDraftIds = selectedReports
    .filter((row) => !row.report?.isPublic)
    .map((row) => row.report?._id as string);

  const selectedPublishedIds = selectedReports
    .filter((row) => row.report?.isPublic)
    .map((row) => row.report?._id as string);

  // "Công khai tất cả": mọi báo cáo chưa công khai trong danh sách đang lọc (mọi trang).
  const draftInView = dataFiltered
    .filter((row) => row.reportStatus === 'draft')
    .map((row) => row.report?._id as string);

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
            // Có thêm ô chọn ở đầu dòng: thu cột Tên / Công ty cho bảng vẫn vừa laptop.
            { id: 'name', label: t('study_report_col_intern'), minWidth: 180, width: 200 },
            { id: 'company', label: t('study_report_col_company'), width: 185 },
            { id: 'teacherName', label: t('teacher'), width: 150 },
            // Ngày cập nhật hiện ngay dưới nhãn trạng thái (bớt một cột cho vừa laptop).
            { id: 'reportStatus', label: t('status'), width: 150 },
            { id: 'total', label: t('study_report_col_total'), width: 90 },
            { id: 'delta', label: t('study_report_col_change'), width: 110 },
            { id: '', width: 120 },
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
      setFilters((prev) => ({
        ...prev,
        [name]: value,
        // Tắt "Cần chú ý" thì bỏ luôn lý do đang chọn.
        ...(name === 'attention' && !value && { attentionReason: '' }),
      }));
    },
    [onResetPage]
  );

  const handleAttentionReason = useCallback(
    (reason: '' | IStudyAttentionReason) => {
      onResetPage();
      setFilters((prev) => ({
        ...prev,
        attention: true,
        // Bấm lại lý do đang chọn = quay về mọi lý do.
        attentionReason: prev.attentionReason === reason ? '' : reason,
      }));
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
      onSelectAllRows(false, []);
      setMonth(next);
    },
    [onResetPage, onSelectAllRows]
  );

  const handleViewProfile = useCallback((id: string) => {
    window.open(paths.dashboard.intern.profile(id), '_blank');
  }, []);

  const handlePublish = async () => {
    if (!publishAsk) return;
    setPublishing(true);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/study/updatePublicBulk`,
        { ids: publishAsk.reportIds, isPublic: publishAsk.isPublic }
      );
      enqueueSnackbar(
        t(publishAsk.isPublic ? 'study_publish_done' : 'study_unpublish_done', {
          count: data.modified ?? publishAsk.reportIds.length,
        })
      );
      setPublishAsk(null);
      onSelectAllRows(false, []);
      fetchRows();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_publish_failed'), {
        variant: 'error',
      });
    } finally {
      setPublishing(false);
    }
  };

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
        action={
          // Điện thoại: hai nút xếp dọc để không chèn mất chỗ của tiêu đề.
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="stretch">
            <Button
              variant="outlined"
              color="inherit"
              disabled={loading}
              startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
              onClick={() => setExportOpen(true)}
              sx={{ minHeight: 44 }}
            >
              {t('study_export_open')}
            </Button>
            <Button
              component={RouterLink}
              href={`${paths.dashboard.intern.studyBulk}?month=${monthKey(month)}`}
              variant="contained"
              startIcon={<Iconify icon="solar:pen-new-square-bold" />}
              sx={{ minHeight: 44 }}
            >
              {t('study_bulk_open')}
            </Button>
          </Stack>
        }
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
            <StudyMonthPicker month={month} maxMonth={thisMonth} onChange={handleChangeMonth} />

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
            attentionCount={attentionCounts.all}
          />

          {/* Đang bật "Cần chú ý": thu hẹp theo từng lý do để giáo viên xử lý từng nhóm. */}
          {filters.attention && (
            <Stack
              component={m.div}
              variants={fadeInUp}
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              gap={1}
              sx={{ px: 2.5, pb: 2 }}
            >
              {attentionFilters.map((item) => {
                const active = filters.attentionReason === item.value;
                return (
                  <Tooltip key={item.value || 'all'} title={item.hint} arrow>
                    {/* span: Tooltip vẫn hiện khi nút bị vô hiệu (lý do không có ai). */}
                    <span>
                      <Button
                        variant={active ? 'soft' : 'outlined'}
                        color={active ? 'warning' : 'inherit'}
                        aria-pressed={active}
                        disabled={!item.count && !active}
                        onClick={() => handleAttentionReason(item.value)}
                        sx={{ minHeight: { xs: 44, md: 36 } }}
                      >
                        {item.label}
                        <Label variant={active ? 'filled' : 'soft'} color="warning" sx={{ ml: 1 }}>
                          {item.count}
                        </Label>
                      </Button>
                    </span>
                  </Tooltip>
                );
              })}
            </Stack>
          )}

          {!loading && draftInView.length > 0 && (
            <Stack
              component={m.div}
              variants={fadeInUp}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ px: 2.5, pb: 2 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('study_publish_pending', { count: draftInView.length })}
              </Typography>
              <Button
                variant="soft"
                color="success"
                startIcon={<Iconify icon="solar:global-bold" />}
                onClick={() => setPublishAsk({ isPublic: true, reportIds: draftInView })}
                sx={{ minHeight: 44, flexShrink: 0 }}
              >
                {t('study_publish_all', { count: draftInView.length })}
              </Button>
            </Stack>
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={selected.length}
              rowCount={pageSelectableIds.length}
              onSelectAllRows={(checked) => onSelectAllRows(checked, pageSelectableIds)}
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled={!selectedDraftIds.length}
                    sx={{ minHeight: { xs: 44, md: 30 } }}
                    onClick={() => setPublishAsk({ isPublic: true, reportIds: selectedDraftIds })}
                  >
                    {t('study_publish_n', { count: selectedDraftIds.length })}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    disabled={!selectedPublishedIds.length}
                    sx={{ minHeight: { xs: 44, md: 30 } }}
                    onClick={() =>
                      setPublishAsk({ isPublic: false, reportIds: selectedPublishedIds })
                    }
                  >
                    {t('study_unpublish_n', { count: selectedPublishedIds.length })}
                  </Button>
                </Stack>
              }
            />
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: mdUp ? 960 : 0 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={tableHead}
                  rowCount={pageSelectableIds.length}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) => onSelectAllRows(checked, pageSelectableIds)}
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
                          selected={selected.includes(row._id)}
                          onSelectRow={onSelectRow}
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

      <ConfirmDialog
        open={!!publishAsk}
        onClose={() => setPublishAsk(null)}
        title={t(publishAsk?.isPublic === false ? 'study_unpublish_title' : 'study_publish_title', {
          count: publishAsk?.reportIds.length ?? 0,
        })}
        content={t(
          publishAsk?.isPublic === false ? 'study_unpublish_content' : 'study_publish_content'
        )}
        action={
          <LoadingButton
            variant="contained"
            color={publishAsk?.isPublic === false ? 'inherit' : 'success'}
            loading={publishing}
            onClick={handlePublish}
          >
            {t(publishAsk?.isPublic === false ? 'study_unpublish_n' : 'study_publish_n', {
              count: publishAsk?.reportIds.length ?? 0,
            })}
          </LoadingButton>
        }
      />

      <StudyReportDialog
        row={editing}
        month={month}
        monthLabel={monthLabel}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />

      {/* Gói báo cáo gửi đối tác: theo bộ lọc đang chọn (bỏ qua tab trạng thái — hộp thoại tự
          tách đã công khai / chưa công khai / chưa nhập). */}
      <StudyExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        rows={tabRows}
        month={month}
        monthLabel={monthLabel}
      />
    </Container>
  );
}
