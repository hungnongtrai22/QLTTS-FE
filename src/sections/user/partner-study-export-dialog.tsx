import axios from 'axios';
import { m } from 'framer-motion';
import { saveAs } from 'file-saver';
import { useState } from 'react';
// @mui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { exportStudyPackageExcel, studyPackageFileName } from 'src/utils/ExportStudyPackage';
// types
import { IStudyPackageItem, IStudyPackageMeta } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { splitMonth } from './partner-study-utils';
import StudyExportFormatPicker, { StudyExportFormat } from './study-export-format-picker';

// ----------------------------------------------------------------------
// Đối tác (nghiệp đoàn) tự tải gói báo cáo học tập một tháng — cùng mẫu PDF / Excel với nút
// "Xuất báo cáo" của admin (StudyPackagePDF, ExportStudyPackage).
//
// Dữ liệu: POST /api/study/listPartnerPackage { month } — CHỈ báo cáo đã công khai, CHỈ TTS
// trong phạm vi tài khoản; "so với tháng trước" cũng chỉ so với báo cáo đã công khai.
// Đang lọc công ty ở danh sách thì file chỉ gồm công ty đó.
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  // Các tháng có báo cáo công khai, mới nhất trước
  months: { month: string; count: number }[];
  // Bộ lọc "Công ty" đang chọn ở danh sách (tên); rỗng = mọi công ty
  companies: string[];
};

// Ước lượng thời gian tạo PDF để báo trước (108 báo cáo ≈ 22 giây).
const PDF_SECONDS_PER_REPORT = 0.2;

const fadeInUp = varFade({ distance: 12, durationIn: 0.24 }).inUp;

// Một giá trị duy nhất thì trả về giá trị đó, nhiều giá trị thì rỗng (gói gồm nhiều nơi).
const single = (values: string[]) => {
  const unique = Array.from(new Set(values.filter(Boolean)));
  return unique.length === 1 ? unique[0] : '';
};

export default function PartnerStudyExportDialog({ onClose, months, companies }: Props) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const smUp = useResponsive('up', 'sm');

  const [month, setMonth] = useState(months[0]?.month || '');

  const [format, setFormat] = useState<StudyExportFormat>('pdf');

  // null = chưa xuất; số = đang tạo file cho chừng ấy báo cáo
  const [exporting, setExporting] = useState<number | null>(null);

  const busy = exporting !== null;

  const monthText = (key: string, count: number) => {
    const parts = splitMonth(key);
    return parts ? t('partner_export_month_option', { ...parts, count }) : key;
  };

  const handleExport = async () => {
    setExporting(0);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/study/listPartnerPackage`,
        { month }
      );

      const items: IStudyPackageItem[] = (data.reports || [])
        .filter(
          (report: any) =>
            report.intern &&
            (!companies.length || companies.includes(report.intern.companySelect?.name))
        )
        .map((report: any) => ({ report, intern: report.intern, prevTotal: report.prevTotal }))
        // Thứ tự trong file: công ty → tên, như gói của admin.
        .sort(
          (a: IStudyPackageItem, b: IStudyPackageItem) =>
            String(a.intern.companySelect?.name || '').localeCompare(
              String(b.intern.companySelect?.name || ''),
              'ja'
            ) || String(a.intern.name || '').localeCompare(String(b.intern.name || ''), 'vi')
        );

      if (!items.length) {
        enqueueSnackbar(t('study_export_empty'), { variant: 'warning' });
        return;
      }

      setExporting(items.length);

      const meta: IStudyPackageMeta = {
        month,
        tradeUnion: single(items.map((item) => item.intern.tradeUnion?.name)),
        company: single(items.map((item) => item.intern.companySelect?.name)),
      };

      if (format === 'excel') {
        await exportStudyPackageExcel(items, meta);
      } else {
        // Thư viện PDF + mẫu báo cáo (~1,3MB) chỉ nạp lúc bấm tải.
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
      setExporting(null);
    }
  };

  const progressText = () => {
    if (!exporting) return t('partner_export_generating');
    return format === 'pdf'
      ? t('partner_export_generating_pdf', {
          count: exporting,
          seconds: Math.max(5, Math.ceil(exporting * PDF_SECONDS_PER_REPORT)),
        })
      : t('partner_export_generating');
  };

  return (
    <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="sm" fullScreen={!smUp}>
      <DialogTitle>{t('partner_export_title')}</DialogTitle>

      <DialogContent>
        <MotionContainer>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack component={m.div} variants={fadeInUp} spacing={1.5}>
              <TextField
                select
                fullWidth
                label={t('partner_export_month')}
                value={month}
                disabled={busy}
                onChange={(event) => setMonth(event.target.value)}
              >
                {months.map((item) => (
                  <MenuItem key={item.month} value={item.month} sx={{ minHeight: 44 }}>
                    {monthText(item.month, item.count)}
                  </MenuItem>
                ))}
              </TextField>

              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  {t('partner_export_scope')}
                </Typography>
                <Typography variant="subtitle1">
                  {companies.length
                    ? t('partner_export_companies', { names: companies.join('、') })
                    : t('partner_export_all_companies')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('partner_export_scope_note')}
                </Typography>
              </Stack>
            </Stack>

            <Stack component={m.div} variants={fadeInUp} spacing={1}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {t('study_export_format')}
              </Typography>
              <StudyExportFormatPicker value={format} onChange={setFormat} />
            </Stack>

            <Stack component={m.div} variants={fadeInUp} spacing={1.5}>
              <Alert severity="info">{t('partner_export_public_note')}</Alert>
              {busy && (
                <Stack spacing={1} role="status" aria-live="polite">
                  <LinearProgress />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {progressText()}
                  </Typography>
                </Stack>
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
          disabled={busy}
          sx={{ minHeight: 44 }}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={busy}
          disabled={!month}
          onClick={handleExport}
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          sx={{ minHeight: 44 }}
        >
          {format === 'pdf' ? t('partner_export_submit_pdf') : t('partner_export_submit_excel')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
