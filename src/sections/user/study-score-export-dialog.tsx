import axios from 'axios';
import { m } from 'framer-motion';
import { useMemo, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyBulkRow, IStudyReportRow } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { monthKey } from './study-report-utils';
import { scoreSheetItems } from './study-score-sheet-utils';

// ----------------------------------------------------------------------
// "Tải phiếu nhập điểm" ở trang Báo cáo học tập: phiếu Excel cho các TTS theo bộ lọc đang chọn
// (bỏ qua tab trạng thái). Báo cáo đã công khai đang bị khóa nên không đưa vào phiếu.

type Props = {
  open: boolean;
  onClose: VoidFunction;
  rows: IStudyReportRow[];
  month: Date;
  monthLabel: string;
  // Lớp / giáo viên đang lọc — ghi trong phiếu và tên file; rỗng = tất cả
  scope: string;
};

const fadeInUp = varFade({ distance: 16 }).inUp;

export default function StudyScoreExportDialog({
  open,
  onClose,
  rows,
  month,
  monthLabel,
  scope,
}: Props) {
  const { t } = useLocales();

  const smUp = useResponsive('up', 'sm');

  const { enqueueSnackbar } = useSnackbar();

  const [exporting, setExporting] = useState(false);

  const counts = useMemo(() => {
    const result = { missing: 0, draft: 0, published: 0 };
    rows.forEach((row) => {
      if (!row.report) result.missing += 1;
      else if (row.report.isPublic) result.published += 1;
      else result.draft += 1;
    });
    return result;
  }, [rows]);

  const exportable = counts.missing + counts.draft;

  const handleExport = async () => {
    setExporting(true);
    try {
      const key = monthKey(month);
      // Cần đủ các ô của báo cáo (điểm, nhận xét…) và gợi ý tháng trước: lấy từ study/bulk.
      const [{ data }, { exportScoreSheet }] = await Promise.all([
        axios.get(`${process.env.REACT_APP_HOST_API}/api/study/bulk`, { params: { month: key } }),
        import('src/utils/StudyScoreSheet'),
      ]);
      const wanted = new Set(rows.filter((row) => !row.report?.isPublic).map((row) => row._id));
      // Giữ thứ tự theo tên như trên trang.
      const bulkRows: IStudyBulkRow[] = (data.rows || []).filter(
        (row: IStudyBulkRow) => wanted.has(row._id) && !row.report?.isPublic
      );
      await exportScoreSheet(scoreSheetItems(bulkRows), {
        month: key,
        scope,
        teachers: data.teachers || [],
      });
      enqueueSnackbar(t('score_sheet_exported', { count: bulkRows.length }));
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('score_sheet_export_failed'), {
        variant: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={exporting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={!smUp}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t('score_sheet_export_title')}
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {monthLabel}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <MotionContainer>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack component={m.div} variants={fadeInUp} spacing={1}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {t('study_export_scope')}
              </Typography>
              <Typography variant="subtitle1">{scope || t('score_sheet_scope_all')}</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Label variant="soft" color="error">
                  {t('study_report_tab_missing')}: {counts.missing}
                </Label>
                <Label variant="soft" color="warning">
                  {t('study_report_tab_draft')}: {counts.draft}
                </Label>
              </Stack>
            </Stack>

            {counts.published > 0 && (
              <m.div variants={fadeInUp}>
                <Alert severity="info">
                  {t('score_sheet_skip_published', { count: counts.published })}
                </Alert>
              </m.div>
            )}

            <Stack component={m.div} variants={fadeInUp} spacing={1}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {t('score_sheet_how')}
              </Typography>
              {['score_sheet_how_1', 'score_sheet_how_2', 'score_sheet_how_3'].map((key, index) => (
                <Stack key={key} direction="row" spacing={1.5} alignItems="flex-start">
                  <Label variant="soft" color="primary" sx={{ flexShrink: 0 }}>
                    {index + 1}
                  </Label>
                  <Typography variant="body2">{t(key)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </MotionContainer>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={exporting}>
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={exporting}
          disabled={!exportable}
          onClick={handleExport}
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          sx={{ minHeight: 44 }}
        >
          {t('score_sheet_export_n', { count: exportable })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
