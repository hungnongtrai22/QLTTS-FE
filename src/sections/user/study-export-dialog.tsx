import axios from 'axios';
import { m } from 'framer-motion';
import { saveAs } from 'file-saver';
import { useMemo, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { exportStudyPackageExcel, studyPackageFileName } from 'src/utils/ExportStudyPackage';
// types
import { IStudyPackageItem, IStudyPackageMeta } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { monthKey } from './study-report-utils';
import { StudyReportViewRow } from './study-report-table-row';

// ----------------------------------------------------------------------

type Format = 'pdf' | 'excel';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  // Các dòng theo bộ lọc đang chọn trên trang (mọi trang, bỏ qua tab trạng thái)
  rows: StudyReportViewRow[];
  month: Date;
  monthLabel: string;
};

// Từ số báo cáo này trở lên thì báo trước là tạo PDF sẽ lâu (mỗi trang một ảnh đại diện).
const SLOW_PDF = 30;

const fadeInUp = varFade({ distance: 12, durationIn: 0.24 }).inUp;

// Một giá trị duy nhất thì trả về giá trị đó, nhiều giá trị thì rỗng (gói gồm nhiều nơi).
const single = (values: string[]) => {
  const unique = Array.from(new Set(values.filter(Boolean)));
  return unique.length === 1 ? unique[0] : '';
};

export default function StudyExportDialog({ open, onClose, rows, month, monthLabel }: Props) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const smUp = useResponsive('up', 'sm');

  const [format, setFormat] = useState<Format>('pdf');

  const [includeDrafts, setIncludeDrafts] = useState(false);

  const [exporting, setExporting] = useState(false);

  const counts = useMemo(
    () => ({
      published: rows.filter((row) => row.report?.isPublic).length,
      draft: rows.filter((row) => row.report && !row.report.isPublic).length,
      missing: rows.filter((row) => !row.report).length,
    }),
    [rows]
  );

  // Báo cáo đưa vào gói, xếp theo nghiệp đoàn → công ty → tên để đối tác dễ tra.
  const selected = useMemo(
    () =>
      rows
        .filter((row) => row.report && (row.report.isPublic || includeDrafts))
        .sort(
          (a, b) =>
            a.tradeUnion.localeCompare(b.tradeUnion, 'ja') ||
            a.company.localeCompare(b.company, 'ja') ||
            a.name.localeCompare(b.name, 'vi')
        ),
    [rows, includeDrafts]
  );

  const meta: IStudyPackageMeta = useMemo(
    () => ({
      month: monthKey(month),
      tradeUnion: single(selected.map((row) => row.tradeUnion)),
      company: single(selected.map((row) => row.company)),
    }),
    [selected, month]
  );

  const scopeText =
    [meta.tradeUnion, meta.company].filter(Boolean).join(' · ') ||
    (t('study_export_scope_mixed') as string);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/study/listByIds`, {
        ids: selected.map((row) => row.report?._id),
      });

      const byId = new Map<string, any>(
        (data.reports || []).map((report: any) => [report._id, report])
      );

      const items: IStudyPackageItem[] = selected.flatMap((row) => {
        const report = byId.get(row.report?._id as string);
        return report?.intern ? [{ report, intern: report.intern, prevTotal: row.prevTotal }] : [];
      });

      if (!items.length) {
        enqueueSnackbar(t('study_export_empty'), { variant: 'warning' });
        return;
      }

      if (format === 'excel') {
        await exportStudyPackageExcel(items, meta);
      } else {
        // Thư viện PDF + mẫu báo cáo (~1,3MB) chỉ nạp lúc bấm xuất.
        const [{ pdf }, { default: StudyPackagePDF }] = await Promise.all([
          import('@react-pdf/renderer'),
          import('../order/StudyPackagePDF'),
        ]);
        const blob = await pdf(<StudyPackagePDF items={items} meta={meta} />).toBlob();
        saveAs(blob, studyPackageFileName(meta, 'pdf'));
      }

      enqueueSnackbar(t('study_export_done', { count: items.length }));
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_export_failed'), {
        variant: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  const formatOption = (value: Format, icon: string, title: string, description: string) => {
    const active = format === value;
    return (
      <ButtonBase
        key={value}
        role="radio"
        aria-checked={active}
        onClick={() => setFormat(value)}
        sx={{
          flex: 1,
          p: 2,
          gap: 1.5,
          minHeight: 44,
          borderRadius: 1.5,
          textAlign: 'left',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          border: (theme) =>
            `solid ${active ? 2 : 1}px ${
              active ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.24)
            }`,
          bgcolor: (theme) => (active ? alpha(theme.palette.primary.main, 0.08) : 'transparent'),
          transition: (theme) => theme.transitions.create(['border-color', 'background-color']),
        }}
      >
        <Iconify
          icon={icon}
          width={28}
          sx={{ flexShrink: 0, color: active ? 'primary.main' : 'text.secondary' }}
        />
        <Box>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
      </ButtonBase>
    );
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
        {t('study_export_title')}
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
              <Typography variant="subtitle1">{scopeText}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('study_export_scope_note', { count: rows.length })}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Label variant="soft" color="success">
                  {t('study_report_tab_published')}: {counts.published}
                </Label>
                <Label variant="soft" color="warning">
                  {t('study_report_tab_draft')}: {counts.draft}
                </Label>
                <Label variant="soft" color="error">
                  {t('study_report_tab_missing')}: {counts.missing}
                </Label>
              </Stack>
            </Stack>

            <Stack component={m.div} variants={fadeInUp} spacing={1}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {t('study_export_format')}
              </Typography>
              <Stack role="radiogroup" direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {formatOption(
                  'pdf',
                  'solar:file-text-bold',
                  'PDF',
                  t('study_export_pdf_desc') || ''
                )}
                {formatOption(
                  'excel',
                  'solar:clipboard-list-bold',
                  'Excel',
                  t('study_export_excel_desc') || ''
                )}
              </Stack>
            </Stack>

            <Stack component={m.div} variants={fadeInUp} spacing={1.5}>
              <FormControlLabel
                disabled={!counts.draft}
                control={
                  <Checkbox
                    checked={includeDrafts}
                    onChange={(event) => setIncludeDrafts(event.target.checked)}
                  />
                }
                label={t('study_export_include_drafts', { count: counts.draft })}
                sx={{ minHeight: 44 }}
              />
              {counts.draft > 0 && (
                <Alert severity="warning">
                  {includeDrafts
                    ? t('study_export_drafts_included', { count: counts.draft })
                    : t('study_export_drafts_note', { count: counts.draft })}
                </Alert>
              )}
              {counts.missing > 0 && (
                <Alert severity="info">
                  {t('study_export_missing_note', { count: counts.missing })}
                </Alert>
              )}
              {format === 'pdf' && selected.length >= SLOW_PDF && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('study_export_slow')}
                </Typography>
              )}
            </Stack>
          </Stack>
        </MotionContainer>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={exporting}
          sx={{ minHeight: 44 }}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={exporting}
          disabled={!selected.length}
          onClick={handleExport}
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          sx={{ minHeight: 44 }}
        >
          {t(format === 'pdf' ? 'study_export_submit_pdf' : 'study_export_submit_excel', {
            count: selected.length,
          })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
