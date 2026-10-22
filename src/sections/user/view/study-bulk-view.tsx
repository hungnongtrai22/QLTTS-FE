import { m } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hook';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { DEFAULT_SOURCE_NAME } from 'src/utils/source';
// types
import {
  IStudyBulkRow,
  IStudyScoreKey,
  IStudyReportStatus,
  IStudyReportFilters,
  IStudyReportFilterValue,
} from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
//
import StudyBulkTable from '../study-bulk-table';
import StudyBulkMobile from '../study-bulk-mobile';
import StudyMonthPicker from '../study-month-picker';
import StudyBulkDetailDrawer from '../study-bulk-detail-drawer';
import StudyReportTableToolbar from '../study-report-table-toolbar';
import { STATUS_COLOR } from '../study-report-table-row';
import { classFilterValue, classOptions, expectedTeacher } from '../study-class-utils';
import {
  currentMonth,
  monthKey,
  normalizeSearch,
  parseMonthKey,
  uniqueSorted,
} from '../study-report-utils';
import {
  SCORE_KEYS,
  BulkDraft,
  BulkEntry,
  BulkFieldKey,
  baselineEntry,
  isLocked,
  commentText,
  isDirty,
  loadDraft,
  parsePastedTable,
  parseScore,
  rowState,
  saveDraft,
  toPayload,
} from '../study-bulk-utils';

// ----------------------------------------------------------------------

const STATUS_TABS: Array<'all' | IStudyReportStatus> = ['all', 'missing', 'draft', 'published'];

const defaultFilters: IStudyReportFilters = {
  name: '',
  status: 'all',
  tradeUnion: [],
  company: [],
  source: [],
  studyClass: [],
  teacher: [],
  attention: false,
  attentionReason: '',
};

const fadeInUp = varFade({ distance: 24 }).inUp;

// Trạng thái báo cáo ĐÃ LƯU của tháng (cùng nghĩa với tab ở trang Báo cáo học tập).
const savedStatus = (row: IStudyBulkRow): IStudyReportStatus => {
  if (!row.report) return 'missing';
  return row.report.isPublic ? 'published' : 'draft';
};

const sourceName = (row: IStudyBulkRow) => row.source || DEFAULT_SOURCE_NAME;

const teacherName = (row: IStudyBulkRow) => expectedTeacher(row);

const omit = (record: Record<string, string>, ids: string[]) => {
  if (!ids.some((id) => id in record)) return record;
  const next = { ...record };
  ids.forEach((id) => delete next[id]);
  return next;
};

type Banner = { severity: 'info' | 'warning' | 'success'; text: string } | null;

// ----------------------------------------------------------------------

export default function StudyBulkView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const searchParams = useSearchParams();

  const thisMonth = useMemo(() => currentMonth(), []);

  const [month, setMonth] = useState<Date>(() => {
    const fromUrl = parseMonthKey(searchParams.get('month'));
    return fromUrl && fromUrl <= thisMonth ? fromUrl : thisMonth;
  });

  const key = monthKey(month);

  const [rows, setRows] = useState<IStudyBulkRow[]>([]);

  // Tháng của `rows` đang hiện — bản nháp chỉ ghi khi dữ liệu và tháng khớp nhau.
  const [loadedKey, setLoadedKey] = useState('');

  const [teachers, setTeachers] = useState<string[]>([]);

  const [work, setWork] = useState<Record<string, BulkEntry>>({});

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<IStudyReportFilters>(defaultFilters);

  const [banner, setBanner] = useState<Banner>(null);

  const [restored, setRestored] = useState(0);

  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const [publishNow, setPublishNow] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);

  // Báo cáo đã công khai bị khóa; dòng nào người nhập đã "Mở khóa để sửa" (trong phiên này) thì
  // nằm ở đây. Không lưu vào bản nháp: tải lại trang là khóa lại.
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});

  const [unlockAsk, setUnlockAsk] = useState<string | null>(null);

  const unlockedRef = useRef(unlocked);
  unlockedRef.current = unlocked;

  const [mobileIndex, setMobileIndex] = useState(0);

  const confirmSave = useBoolean();

  const confirmReset = useBoolean();

  const monthLabel = t('study_report_month_label', {
    month: month.getMonth() + 1,
    year: month.getFullYear(),
  });

  const scoreLabels = useMemo(() => SCORE_KEYS.map((field) => t(`study_bulk_col_${field}`)), [t]);

  // ----------------------------------------------------------------------
  // Tải dữ liệu. keep = giữ phần đang nhập của các dòng chưa lưu (sau khi lưu một phần);
  // resetIds = các dòng vừa lưu xong, lấy lại giá trị từ báo cáo mới.

  const fetchData = useCallback(
    async (options: { keep?: boolean; resetIds?: string[] } = {}) => {
      if (!options.keep) setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/study/bulk`, {
          params: { month: key },
        });
        const nextRows: IStudyBulkRow[] = data.rows || [];
        const resetIds = new Set(options.resetIds || []);

        if (options.keep) {
          setWork((prev) => {
            const next: Record<string, BulkEntry> = {};
            nextRows.forEach((row) => {
              next[row._id] =
                !resetIds.has(row._id) && prev[row._id] ? prev[row._id] : baselineEntry(row);
            });
            return next;
          });
        } else {
          // Khôi phục bản nháp trên máy — chỉ khi báo cáo chưa bị ai lưu lại kể từ lúc nhập dở.
          const draft = loadDraft(key);
          let restoredCount = 0;
          const next: Record<string, BulkEntry> = {};
          nextRows.forEach((row) => {
            const saved = draft[row._id];
            if (saved && saved.base === (row.report?.updatedAt ?? null) && saved.entry?.values) {
              next[row._id] = saved.entry;
              restoredCount += 1;
            } else {
              next[row._id] = baselineEntry(row);
            }
          });
          setWork(next);
          setRestored(restoredCount);
        }

        setRows(nextRows);
        setTeachers(data.teachers || []);
        setLoadedKey(key);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.response?.data?.message || t('study_bulk_load_failed'), {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [key, enqueueSnackbar, t]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ghi bản nháp (chỉ các dòng có thay đổi) sau khi ngừng gõ.
  useEffect(() => {
    if (loading || loadedKey !== key) return undefined;
    const timer = setTimeout(() => {
      const draft: BulkDraft = {};
      rows.forEach((row) => {
        const entry = work[row._id];
        if (entry && isDirty(row, entry)) {
          draft[row._id] = { entry, base: row.report?.updatedAt ?? null };
        }
      });
      saveDraft(key, draft);
    }, 400);
    return () => clearTimeout(timer);
  }, [work, rows, key, loadedKey, loading]);

  // ----------------------------------------------------------------------
  // Trạng thái từng dòng, bộ lọc, số đếm

  const states = useMemo(() => {
    const result: Record<string, ReturnType<typeof rowState>> = {};
    rows.forEach((row) => {
      const entry = work[row._id];
      if (entry) {
        result[row._id] = rowState(row, entry, saveErrors[row._id], isLocked(row, unlocked));
      }
    });
    return result;
  }, [rows, work, saveErrors, unlocked]);

  const options = useMemo(
    () => ({
      tradeUnion: uniqueSorted(rows.map((row) => row.tradeUnion)),
      company: uniqueSorted(rows.map((row) => row.company)),
      source: [
        DEFAULT_SOURCE_NAME,
        ...uniqueSorted(rows.map((row) => row.source)).filter(
          (name) => name !== DEFAULT_SOURCE_NAME
        ),
      ],
      studyClass: classOptions(rows.map((row) => row.studyClass)),
      teacher: uniqueSorted(rows.map(teacherName)),
    }),
    [rows]
  );

  const scopedRows = useMemo(() => {
    const keyword = normalizeSearch(filters.name.trim());
    return rows.filter(
      (row) =>
        !!work[row._id] &&
        (!filters.studyClass.length ||
          filters.studyClass.includes(classFilterValue(row.studyClass))) &&
        (!filters.tradeUnion.length || filters.tradeUnion.includes(row.tradeUnion)) &&
        (!filters.company.length || filters.company.includes(row.company)) &&
        (!filters.source.length || filters.source.includes(sourceName(row))) &&
        (!filters.teacher.length || filters.teacher.includes(teacherName(row))) &&
        (!keyword ||
          normalizeSearch(row.name).includes(keyword) ||
          normalizeSearch(row.namejp).includes(keyword))
    );
  }, [
    rows,
    work,
    filters.name,
    filters.studyClass,
    filters.tradeUnion,
    filters.company,
    filters.source,
    filters.teacher,
  ]);

  const counts = useMemo(() => {
    const result: Record<'all' | IStudyReportStatus, number> = {
      all: scopedRows.length,
      missing: 0,
      draft: 0,
      published: 0,
    };
    scopedRows.forEach((row) => {
      result[savedStatus(row)] += 1;
    });
    return result;
  }, [scopedRows]);

  const visibleRows = useMemo(
    () =>
      filters.status === 'all'
        ? scopedRows
        : scopedRows.filter((row) => savedStatus(row) === filters.status),
    [scopedRows, filters.status]
  );

  // Handler dán / lấy điểm tháng trước đọc danh sách đang hiện qua ref để giữ ổn định
  // (dòng bảng bọc memo, handler đổi là cả bảng vẽ lại).
  const visibleRowsRef = useRef(visibleRows);
  visibleRowsRef.current = visibleRows;

  const totals = useMemo(() => {
    let dirty = 0;
    let savable = 0;
    let incomplete = 0;
    let errors = 0;
    rows.forEach((row) => {
      const state = states[row._id];
      if (!state) return;
      if (state.dirty) dirty += 1;
      if (state.savable) savable += 1;
      if (state.dirty && !state.check.complete) incomplete += 1;
      errors += state.check.errorCount;
    });
    const savedInScope = scopedRows.filter((row) => !!row.report).length;
    return { dirty, savable, incomplete, errors, savedInScope, scope: scopedRows.length };
  }, [rows, states, scopedRows]);

  const progressPercent = totals.scope ? Math.round((totals.savedInScope / totals.scope) * 100) : 0;

  const canReset =
    !!filters.name ||
    filters.studyClass.length > 0 ||
    filters.tradeUnion.length > 0 ||
    filters.company.length > 0 ||
    filters.source.length > 0 ||
    filters.teacher.length > 0;

  // ----------------------------------------------------------------------
  // Sửa ô

  const handleField = useCallback(
    (id: string, field: BulkFieldKey, value: string | number | null) => {
      setWork((prev) => {
        const entry = prev[id];
        if (!entry) return prev;
        if (field === 'comment') {
          const html = String(value ?? '');
          if (html === entry.values.comment) return prev;
          // Trình soạn thảo chuẩn hóa HTML khi mở; cùng nội dung chữ thì không tính là sửa.
          if (commentText(html) === commentText(entry.values.comment)) {
            return { ...prev, [id]: { ...entry, values: { ...entry.values, comment: html } } };
          }
        } else if (entry.values[field] === value) {
          return prev;
        }
        return {
          ...prev,
          [id]: {
            values: { ...entry.values, [field]: value },
            origin: { ...entry.origin, [field]: 'edited' },
          },
        };
      });
      setSaveErrors((prev) => omit(prev, [id]));
    },
    []
  );

  const handleScore = useCallback(
    (id: string, field: IStudyScoreKey, raw: string) => handleField(id, field, parseScore(raw)),
    [handleField]
  );

  // Dán khối ô từ Excel: rải từ ô đang chọn sang phải và xuống dưới, theo đúng thứ tự dòng
  // đang hiện trên bảng.
  const handlePasteBlock = useCallback(
    (rowIndex: number, colIndex: number, text: string) => {
      const table = parsePastedTable(text);
      const targets = visibleRowsRef.current.slice(rowIndex, rowIndex + table.length);
      const updates: Array<{ id: string; field: IStudyScoreKey; value: number }> = [];
      let skipped = 0;
      let cols = 0;
      let lockedRows = 0;

      table.slice(0, targets.length).forEach((cells, r) => {
        // Dòng báo cáo đã công khai chưa mở khóa: không dán vào.
        if (isLocked(targets[r], unlockedRef.current)) {
          lockedRows += 1;
          return;
        }
        cells.slice(0, SCORE_KEYS.length - colIndex).forEach((cell, c) => {
          cols = Math.max(cols, c + 1);
          const trimmed = cell.trim();
          if (!trimmed) return;
          if (!/^\d{1,3}([.,]0+)?$/.test(trimmed)) {
            skipped += 1;
            return;
          }
          updates.push({
            id: targets[r]._id,
            field: SCORE_KEYS[colIndex + c],
            value: parseInt(trimmed, 10),
          });
        });
      });

      setWork((prev) => {
        const next = { ...prev };
        updates.forEach(({ id, field, value }) => {
          const entry = next[id];
          if (!entry) return;
          next[id] = {
            values: { ...entry.values, [field]: value },
            origin: { ...entry.origin, [field]: 'edited' },
          };
        });
        return next;
      });
      setSaveErrors((prev) =>
        omit(
          prev,
          targets.map((row) => row._id)
        )
      );

      const notes = [t('study_bulk_pasted', { rows: targets.length - lockedRows, cols })];
      if (skipped) notes.push(t('study_bulk_pasted_skipped', { count: skipped }));
      if (lockedRows) notes.push(t('study_bulk_pasted_locked', { count: lockedRows }));
      setBanner({ severity: skipped || lockedRows ? 'warning' : 'info', text: notes.join(' ') });
    },
    [t]
  );

  // Điền điểm tháng trước (dạng gợi ý) cho các dòng đang hiện chưa có báo cáo và chưa nhập ô nào.
  const handleFillPrev = useCallback(() => {
    const targets = visibleRowsRef.current.filter(
      (row) =>
        !row.report &&
        row.prev &&
        work[row._id] &&
        SCORE_KEYS.every((field) => work[row._id].values[field] === null)
    );

    if (!targets.length) {
      setBanner({ severity: 'info', text: t('study_bulk_fill_prev_none') });
      return;
    }

    setWork((prev) => {
      const next = { ...prev };
      targets.forEach((row) => {
        const entry = next[row._id];
        const values = { ...entry.values };
        const origin = { ...entry.origin };
        SCORE_KEYS.forEach((field) => {
          values[field] = row.prev?.[field] ?? null;
          if (values[field] !== null) origin[field] = 'suggested';
        });
        next[row._id] = { values, origin };
      });
      return next;
    });
    setBanner({
      severity: 'info',
      text: t('study_bulk_fill_prev_done', { count: targets.length }),
    });
  }, [work, t]);

  // ----------------------------------------------------------------------
  // Lưu

  const saveReports = useCallback(
    async (ids: string[], publish: boolean) => {
      if (!ids.length) return false;
      const rowById = new Map(rows.map((row) => [row._id, row]));
      setSaving(true);
      try {
        const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/study/updateBulk`, {
          month: key,
          publish,
          reports: ids.map((id) =>
            toPayload(id, work[id].values, !!rowById.get(id)?.report?.isPublic)
          ),
        });
        const results: Array<{ internId: string; ok: boolean; message?: string }> =
          data.results || [];
        const okIds = results.filter((item) => item.ok).map((item) => item.internId);
        const failed = results.filter((item) => !item.ok);

        setSaveErrors((prev) => ({
          ...omit(prev, okIds),
          ...Object.fromEntries(failed.map((item) => [item.internId, item.message || ''])),
        }));
        if (okIds.length) await fetchData({ keep: true, resetIds: okIds });

        if (failed.length) {
          enqueueSnackbar(t('study_bulk_save_partial', { ok: okIds.length, fail: failed.length }), {
            variant: 'warning',
          });
        } else {
          enqueueSnackbar(t('study_bulk_saved', { count: okIds.length }));
        }
        return failed.length === 0;
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.response?.data?.message || t('study_bulk_save_error'), {
          variant: 'error',
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [key, work, rows, fetchData, enqueueSnackbar, t]
  );

  const savableIds = useMemo(
    () => rows.filter((row) => states[row._id]?.savable).map((row) => row._id),
    [rows, states]
  );

  const handleConfirmSave = async () => {
    await saveReports(savableIds, publishNow);
    confirmSave.onFalse();
    setBanner(null);
  };

  const handleSaveOne = useCallback(
    (id: string) => saveReports([id], publishNow),
    [saveReports, publishNow]
  );

  const handleReset = () => {
    const next: Record<string, BulkEntry> = {};
    rows.forEach((row) => {
      next[row._id] = baselineEntry(row);
    });
    setWork(next);
    setSaveErrors({});
    setBanner(null);
    setRestored(0);
    saveDraft(key, {});
    confirmReset.onFalse();
  };

  // ----------------------------------------------------------------------
  // Điều hướng

  const handleChangeMonth = useCallback(
    (next: Date) => {
      // Phần đang nhập của tháng cũ đã nằm trong bản nháp trên máy, đổi tháng không mất.
      setMonth(next);
      setDetailId(null);
      setUnlocked({});
      setMobileIndex(0);
      setBanner(null);
      setSaveErrors({});
      router.replace(`${paths.dashboard.intern.studyBulk}?month=${monthKey(next)}`);
    },
    [router]
  );

  const handleFilters = useCallback((name: string, value: IStudyReportFilterValue) => {
    setMobileIndex(0);
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setMobileIndex(0);
    setFilters((prev) => ({ ...defaultFilters, status: prev.status }));
  }, []);

  const handleOpenDetail = useCallback((id: string) => setDetailId(id), []);

  const handleUnlockAsk = useCallback((id: string) => setUnlockAsk(id), []);

  const detailIndex = detailId ? visibleRows.findIndex((row) => row._id === detailId) : -1;
  const detailRow = detailIndex >= 0 ? visibleRows[detailIndex] : null;

  const reportHref = `${paths.dashboard.intern.studyReport}?month=${key}`;

  // ----------------------------------------------------------------------

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('study_bulk') || ''}
        links={[
          { name: t('dashboard') || '', href: paths.dashboard.root },
          { name: t('study_report') || '', href: reportHref },
          { name: t('study_bulk') || '' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={reportHref}
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ minHeight: 44 }}
          >
            {t('study_bulk_back')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MotionContainer>
        {/* overflow visible: Card mặc định overflow hidden làm thanh Lưu (position: sticky) không dính đáy màn hình. */}
        <Card component={m.div} variants={fadeInUp} sx={{ overflow: 'visible' }}>
          {/* Chọn tháng + tiến độ */}
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
                  {t('study_report_progress', { done: totals.savedInScope, total: totals.scope })}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {progressPercent}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                color={progressPercent === 100 ? 'success' : 'primary'}
                sx={{ height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {t('study_bulk_draft_note')}
              </Typography>
            </Stack>
          </Stack>

          {restored > 0 && (
            <Box component={m.div} variants={fadeInUp} sx={{ px: 2.5, pb: 2 }}>
              <Alert
                severity="info"
                action={
                  <Button color="inherit" size="small" onClick={confirmReset.onTrue}>
                    {t('study_bulk_draft_discard')}
                  </Button>
                }
              >
                {t('study_bulk_draft_restored', { count: restored })}
              </Alert>
            </Box>
          )}

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
          />

          {/* Thao tác nhanh + chú thích ô */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ px: 2.5, pb: 2 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={handleFillPrev}
              disabled={loading}
              sx={{ minHeight: 44, flexShrink: 0 }}
            >
              {t('study_bulk_fill_prev')}
            </Button>
            {mdUp && (
              <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                columnGap={2}
                rowGap={1}
                sx={{ typography: 'caption', color: 'text.secondary' }}
              >
                {(['suggested', 'edited', 'error'] as const).map((kind) => (
                  <Stack key={kind} direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      sx={(theme) => ({
                        width: 16,
                        height: 16,
                        borderRadius: 0.5,
                        border: `1px ${kind === 'suggested' ? 'dashed' : 'solid'} ${
                          (kind === 'suggested' && alpha(theme.palette.grey[500], 0.48)) ||
                          (kind === 'edited' && alpha(theme.palette.success.main, 0.56)) ||
                          theme.palette.error.main
                        }`,
                        bgcolor:
                          (kind === 'suggested' && alpha(theme.palette.grey[500], 0.08)) ||
                          (kind === 'edited' && alpha(theme.palette.success.main, 0.08)) ||
                          alpha(theme.palette.error.main, 0.08),
                      })}
                    />
                    <span>{t(`study_bulk_legend_${kind}`)}</span>
                  </Stack>
                ))}
                <span>{t('study_bulk_keys_hint')}</span>
                <span>{t('study_bulk_paste_hint')}</span>
              </Stack>
            )}
          </Stack>

          {banner && (
            <Box sx={{ px: 2.5, pb: 2 }}>
              <Alert severity={banner.severity} onClose={() => setBanner(null)}>
                {banner.text}
              </Alert>
            </Box>
          )}

          {mdUp ? (
            <StudyBulkTable
              rows={visibleRows}
              work={work}
              saveErrors={saveErrors}
              unlocked={unlocked}
              onUnlock={handleUnlockAsk}
              loading={loading}
              scoreLabels={scoreLabels}
              onScore={handleScore}
              onField={handleField}
              onOpenDetail={handleOpenDetail}
              onPasteBlock={handlePasteBlock}
            />
          ) : (
            <StudyBulkMobile
              rows={visibleRows}
              work={work}
              saveErrors={saveErrors}
              unlocked={unlocked}
              onUnlock={handleUnlockAsk}
              index={mobileIndex}
              onIndex={setMobileIndex}
              scoreLabels={scoreLabels}
              saving={saving}
              publishNow={publishNow}
              onPublishNow={setPublishNow}
              onScore={handleScore}
              onField={handleField}
              onOpenDetail={handleOpenDetail}
              onSaveOne={handleSaveOne}
            />
          )}

          {/* Thanh lưu: luôn thấy khi cuộn bảng dài */}
          {mdUp && (
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 3,
                px: 2.5,
                py: 2,
                bgcolor: 'background.paper',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Stack direction="row" flexWrap="wrap" columnGap={2.5} rowGap={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('study_bulk_footer_dirty', { count: totals.dirty })}
                </Typography>
                <Typography variant="body2" sx={{ color: 'success.dark' }}>
                  {t('study_bulk_footer_ready', { count: totals.savable })}
                </Typography>
                {totals.incomplete > 0 && (
                  <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                    {t('study_bulk_footer_incomplete', { count: totals.incomplete })}
                  </Typography>
                )}
                {totals.errors > 0 && (
                  <Typography variant="body2" sx={{ color: 'error.dark' }}>
                    {t('study_bulk_footer_errors', { count: totals.errors })}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={!totals.dirty || saving}
                  onClick={confirmReset.onTrue}
                  sx={{ minHeight: 44 }}
                >
                  {t('study_bulk_reset')}
                </Button>
                <LoadingButton
                  variant="contained"
                  loading={saving}
                  disabled={!totals.savable}
                  onClick={confirmSave.onTrue}
                  startIcon={<Iconify icon="solar:diskette-bold" />}
                  sx={{ minHeight: 44 }}
                >
                  {t('study_bulk_save', { count: totals.savable })}
                </LoadingButton>
              </Stack>
            </Stack>
          )}
        </Card>
      </MotionContainer>

      <StudyBulkDetailDrawer
        row={detailRow}
        entry={detailRow ? work[detailRow._id] : null}
        saveError={detailRow ? saveErrors[detailRow._id] : undefined}
        locked={!!detailRow && isLocked(detailRow, unlocked)}
        onUnlock={() => detailRow && setUnlockAsk(detailRow._id)}
        monthLabel={monthLabel}
        teachers={teachers}
        onField={handleField}
        onClose={() => setDetailId(null)}
        onPrev={detailIndex > 0 ? () => setDetailId(visibleRows[detailIndex - 1]._id) : undefined}
        onNext={
          detailIndex >= 0 && detailIndex < visibleRows.length - 1
            ? () => setDetailId(visibleRows[detailIndex + 1]._id)
            : undefined
        }
      />

      <ConfirmDialog
        open={!!unlockAsk}
        onClose={() => setUnlockAsk(null)}
        title={t('study_unlock_title')}
        content={t('study_unlock_content')}
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              if (unlockAsk) setUnlocked((prev) => ({ ...prev, [unlockAsk]: true }));
              setUnlockAsk(null);
            }}
          >
            {t('study_unlock')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmSave.value}
        onClose={confirmSave.onFalse}
        title={t('study_bulk_save_title', {
          count: totals.savable,
          month: month.getMonth() + 1,
          year: month.getFullYear(),
        })}
        content={
          <Stack spacing={2}>
            <Typography variant="body2">
              {t('study_bulk_save_content', { skip: totals.dirty - totals.savable })}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={publishNow}
                  onChange={(event) => setPublishNow(event.target.checked)}
                />
              }
              label={t('study_bulk_publish')}
            />
          </Stack>
        }
        action={
          <LoadingButton variant="contained" loading={saving} onClick={handleConfirmSave}>
            {t('study_bulk_save', { count: totals.savable })}
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmReset.value}
        onClose={confirmReset.onFalse}
        title={t('study_bulk_reset')}
        content={t('study_bulk_reset_content', { count: totals.dirty })}
        action={
          <Button variant="contained" color="error" onClick={handleReset}>
            {t('study_bulk_reset')}
          </Button>
        }
      />
    </Container>
  );
}
