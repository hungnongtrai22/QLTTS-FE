import axios from 'axios';
import { m } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyBulkRow, IStudyJlptKey, IStudyScoreKey } from 'src/types/user';
// components
import Label, { LabelColor } from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { SCORE_KEYS, JLPT_KEYS, BulkFieldKey } from './study-bulk-utils';
import {
  SAVABLE,
  ScoreImportRow,
  ScoreImportStatus,
  planScoreImport,
} from './study-score-sheet-utils';

// ----------------------------------------------------------------------
// "Nhập điểm từ phiếu" ở trang Báo cáo học tập: đọc phiếu Excel giáo viên đã điền, so với dữ
// liệu hiện có, xem trước rồi mới lưu qua study/updateBulk — luôn KHÔNG công khai.

type Props = {
  open: boolean;
  onClose: VoidFunction;
  // Lưu xong (ít nhất một báo cáo): tháng của phiếu, để trang chuyển tới tháng đó và tải lại
  onSaved: (month: string) => void;
};

type Phase = 'pick' | 'reading' | 'preview' | 'saving' | 'done';

type SaveResult = { ok: boolean; message?: string };

// Mỗi lần lưu tối đa 200 báo cáo (giới hạn của study/updateBulk).
const CHUNK = 200;

const STATUS_META: Record<ScoreImportStatus, { color: LabelColor; order: number }> = {
  invalid: { color: 'error', order: 0 },
  conflict: { color: 'warning', order: 1 },
  locked: { color: 'warning', order: 2 },
  unknown: { color: 'error', order: 3 },
  create: { color: 'success', order: 4 },
  update: { color: 'info', order: 5 },
  unchanged: { color: 'default', order: 6 },
  empty: { color: 'default', order: 7 },
};

const fadeInUp = varFade({ distance: 16 }).inUp;

export default function StudyScoreImportDialog({ open, onClose, onSaved }: Props) {
  const { t } = useLocales();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>('pick');

  const [error, setError] = useState('');

  const [fileName, setFileName] = useState('');

  const [month, setMonth] = useState('');

  const [plan, setPlan] = useState<ScoreImportRow[]>([]);

  const [filter, setFilter] = useState<'all' | ScoreImportStatus>('all');

  const [results, setResults] = useState<Record<string, SaveResult>>({});

  const [dragging, setDragging] = useState(false);

  const busy = phase === 'reading' || phase === 'saving';

  const fieldLabel = (field: BulkFieldKey) => {
    if (SCORE_KEYS.includes(field as IStudyScoreKey)) return t(`study_bulk_col_${field}`);
    if (JLPT_KEYS.includes(field as IStudyJlptKey)) return t(`study_bulk_jlpt_${field}`);
    if (field === 'level') return t('study_bulk_col_level');
    if (field === 'comment') return t('study_bulk_comment');
    return t(field);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPhase('reading');
    setError('');
    setFileName(file.name);
    setResults({});
    setFilter('all');
    try {
      const [{ readScoreSheet }, { htmlToText }] = await Promise.all([
        import('src/utils/StudyScoreSheet'),
        import('html-to-text'),
      ]);
      const sheet = await readScoreSheet(file);
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/study/bulk`, {
        params: { month: sheet.month },
      });
      const rows: IStudyBulkRow[] = data.rows || [];
      setMonth(sheet.month);
      setPlan(
        planScoreImport(sheet.records, rows, (html) => htmlToText(html, { wordwrap: false }).trim())
      );
      setPhase('preview');
    } catch (err) {
      console.error(err);
      setError(
        (err?.code && t(`score_sheet_error_${err.code}`)) ||
          err?.response?.data?.message ||
          t('score_sheet_error_unreadable')
      );
      setPhase('pick');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const counts = useMemo(() => {
    const result = {} as Record<ScoreImportStatus, number>;
    plan.forEach((row) => {
      result[row.status] = (result[row.status] || 0) + 1;
    });
    return result;
  }, [plan]);

  const savable = plan.filter((row) => SAVABLE.includes(row.status));

  const shown = useMemo(
    () =>
      plan
        .filter((row) => filter === 'all' || row.status === filter)
        .sort(
          (a, b) =>
            STATUS_META[a.status].order - STATUS_META[b.status].order || a.rowNumber - b.rowNumber
        ),
    [plan, filter]
  );

  const handleSave = async () => {
    setPhase('saving');
    const next: Record<string, SaveResult> = {};
    for (let start = 0; start < savable.length; start += CHUNK) {
      const chunk = savable.slice(start, start + CHUNK);
      try {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/study/updateBulk`, {
          month,
          publish: false,
          reports: chunk.map((row) => row.payload),
        });
        (data.results || []).forEach((item: any) => {
          next[item.internId] = { ok: !!item.ok, message: item.message };
        });
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.message || t('score_sheet_save_failed');
        chunk.forEach((row) => {
          next[row.internId] = { ok: false, message };
        });
      }
    }
    setResults(next);
    setPhase('done');
    if (Object.values(next).some((item) => item.ok)) onSaved(month);
  };

  const savedCount = Object.values(results).filter((item) => item.ok).length;
  const failedCount = Object.values(results).length - savedCount;

  const statusLabel = (row: ScoreImportRow) => {
    const result = results[row.internId];
    if (result) {
      return (
        <Label variant="soft" color={result.ok ? 'success' : 'error'}>
          {t(result.ok ? 'score_sheet_status_saved' : 'score_sheet_status_failed')}
        </Label>
      );
    }
    return (
      <Label variant="soft" color={STATUS_META[row.status].color}>
        {t(`score_sheet_status_${row.status}`)}
      </Label>
    );
  };

  const detailText = (row: ScoreImportRow) => {
    const result = results[row.internId];
    if (result && !result.ok) return result.message || '';
    if (row.problems.length) {
      return row.problems
        .map((problem) =>
          problem.fields?.length
            ? `${t(problem.key)}: ${problem.fields.map(fieldLabel).join(', ')}`
            : t(problem.key)
        )
        .join(' · ');
    }
    if (row.status === 'update') {
      return t('score_sheet_detail_changes', {
        fields: row.changes.map(fieldLabel).join(', '),
      });
    }
    if (row.status === 'create') return '';
    return t(`score_sheet_detail_${row.status}`);
  };

  const totalText = (row: ScoreImportRow) => {
    if (row.status === 'update' && row.currentTotal !== null && row.total !== null) {
      return `${row.currentTotal} → ${row.total}`;
    }
    return row.total ?? '—';
  };

  const renderPicker = (
    <Stack spacing={2} component={m.div} variants={fadeInUp}>
      <Box
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        sx={{
          py: { xs: 5, md: 7 },
          px: 2,
          borderRadius: 1.5,
          cursor: 'pointer',
          textAlign: 'center',
          border: (theme) =>
            `1px dashed ${
              dragging ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.32)
            }`,
          bgcolor: (theme) =>
            dragging
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.grey[500], 0.04),
          transition: (theme) => theme.transitions.create(['background-color', 'border-color']),
        }}
      >
        <Iconify icon="vscode-icons:file-type-excel" width={48} sx={{ mb: 1.5 }} />
        <Typography variant="subtitle1">{t('score_sheet_pick')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {t('score_sheet_pick_hint')}
        </Typography>
      </Box>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t('score_sheet_import_note')}
      </Typography>
    </Stack>
  );

  const filterButtons: Array<'all' | ScoreImportStatus> = [
    'all',
    ...(Object.keys(STATUS_META) as ScoreImportStatus[]).filter((status) => counts[status]),
  ];

  const renderPreview = (
    <Stack spacing={2}>
      <Stack component={m.div} variants={fadeInUp} spacing={0.5}>
        <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
          {fileName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('score_sheet_file_month', {
            month: Number(month.slice(5)),
            year: Number(month.slice(0, 4)),
            count: plan.length,
          })}
        </Typography>
      </Stack>

      {phase === 'done' ? (
        <Alert severity={failedCount ? 'warning' : 'success'}>
          {t('score_sheet_done', { saved: savedCount, failed: failedCount })}
        </Alert>
      ) : (
        <Alert severity={savable.length ? 'info' : 'warning'}>
          {savable.length
            ? t('score_sheet_summary', {
                count: savable.length,
                create: counts.create || 0,
                update: counts.update || 0,
              })
            : t('score_sheet_summary_none')}
        </Alert>
      )}

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {filterButtons.map((status) => {
          const active = filter === status;
          return (
            <Button
              key={status}
              size="small"
              variant={active ? 'soft' : 'outlined'}
              color={active ? 'primary' : 'inherit'}
              aria-pressed={active}
              onClick={() => setFilter(status)}
              sx={{ minHeight: { xs: 44, md: 32 } }}
            >
              {status === 'all' ? t('study_report_tab_all') : t(`score_sheet_status_${status}`)}
              <Label
                variant={active ? 'filled' : 'soft'}
                color={status === 'all' ? 'default' : STATUS_META[status].color}
                sx={{ ml: 1 }}
              >
                {status === 'all' ? plan.length : counts[status]}
              </Label>
            </Button>
          );
        })}
      </Stack>

      {phase === 'saving' && <LinearProgress />}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar sx={{ maxHeight: { md: 420 } }}>
          <Table size="small" sx={{ minWidth: mdUp ? 760 : 0 }}>
            <TableHeadCustom
              headLabel={
                mdUp
                  ? [
                      { id: 'row', label: t('score_sheet_col_row'), width: 64 },
                      { id: 'name', label: t('study_report_col_intern'), width: 220 },
                      { id: 'status', label: t('score_sheet_col_result'), width: 150 },
                      { id: 'total', label: t('study_report_col_total'), width: 120 },
                      { id: 'detail', label: t('score_sheet_col_detail') },
                    ]
                  : [{ id: 'name', label: t('study_report_col_intern') }]
              }
              sx={{ '& th': { whiteSpace: 'nowrap' } }}
            />
            <TableBody>
              {shown.map((row) => (
                <TableRow key={`${row.rowNumber}-${row.internId}`}>
                  {mdUp ? (
                    <>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.rowNumber}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{row.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {[row.namejp, row.studyClass].filter(Boolean).join(' · ')}
                        </Typography>
                      </TableCell>
                      <TableCell>{statusLabel(row)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalText(row)}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', typography: 'body2' }}>
                        {detailText(row)}
                      </TableCell>
                    </>
                  ) : (
                    // Điện thoại: gộp một ô, không phải cuộn ngang.
                    <TableCell>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Typography variant="subtitle2">{row.name}</Typography>
                        {statusLabel(row)}
                      </Stack>
                      <Typography variant="caption" component="p" sx={{ color: 'text.secondary' }}>
                        {t('score_sheet_row_n', { row: row.rowNumber })}
                        {row.total !== null &&
                          ` · ${t('study_report_col_total')}: ${totalText(row)}`}
                      </Typography>
                      {detailText(row) && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {detailText(row)}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth={phase === 'pick' || phase === 'reading' ? 'sm' : 'md'}
      fullScreen={!smUp}
    >
      <DialogTitle sx={{ pb: 1 }}>{t('score_sheet_import_title')}</DialogTitle>

      <DialogContent>
        <MotionContainer>
          <Box sx={{ pt: 1 }}>
            {phase === 'reading' && (
              <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('score_sheet_reading', { name: fileName })}
                </Typography>
                <LinearProgress sx={{ width: 1 }} />
              </Stack>
            )}
            {phase === 'pick' && renderPicker}
            {(phase === 'preview' || phase === 'saving' || phase === 'done') && renderPreview}
          </Box>
        </MotionContainer>
      </DialogContent>

      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        {phase === 'preview' && (
          <Button
            color="inherit"
            onClick={() => {
              setPhase('pick');
              setPlan([]);
            }}
            sx={{ mr: 'auto', minHeight: 44 }}
          >
            {t('score_sheet_pick_other')}
          </Button>
        )}
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={busy}>
          {t(phase === 'done' ? 'score_sheet_close' : 'cancel')}
        </Button>
        {(phase === 'preview' || phase === 'saving') && (
          <LoadingButton
            variant="contained"
            loading={phase === 'saving'}
            disabled={!savable.length}
            onClick={handleSave}
            sx={{ minHeight: 44 }}
          >
            {t('score_sheet_save_n', { count: savable.length })}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
