// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
// Chọn định dạng gói báo cáo học tập (PDF / Excel) — dùng chung cho hộp thoại xuất của admin
// (study-export-dialog) và của đối tác (partner-study-export-dialog).

export type StudyExportFormat = 'pdf' | 'excel';

type Props = {
  value: StudyExportFormat;
  onChange: (value: StudyExportFormat) => void;
};

export default function StudyExportFormatPicker({ value, onChange }: Props) {
  const { t } = useLocales();

  const option = (format: StudyExportFormat, icon: string, title: string, description: string) => {
    const active = value === format;
    return (
      <ButtonBase
        key={format}
        role="radio"
        aria-checked={active}
        onClick={() => onChange(format)}
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
    <Stack role="radiogroup" direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      {option('pdf', 'solar:file-text-bold', 'PDF', t('study_export_pdf_desc') || '')}
      {option('excel', 'solar:clipboard-list-bold', 'Excel', t('study_export_excel_desc') || '')}
    </Stack>
  );
}
