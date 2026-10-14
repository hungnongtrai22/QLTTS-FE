// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/ja';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
//
import { addMonths, monthKey } from './study-report-utils';

// ----------------------------------------------------------------------

type Props = {
  month: Date;
  // Tháng hiện tại (giờ VN) — không cho chọn tháng sau nó.
  maxMonth: Date;
  onChange: (month: Date) => void;
};

// Chọn tháng báo cáo: ‹ [MM/YYYY] › + "Tháng này". Dùng chung cho "Báo cáo học tập" và
// "Nhập điểm hàng loạt".
export default function StudyMonthPicker({ month, maxMonth, onChange }: Props) {
  const { t, currentLang } = useLocales();

  const isMaxMonth = monthKey(month) === monthKey(maxMonth);

  return (
    // Điện thoại: nút "Tháng này" xuống dòng riêng để ô chọn tháng không bị bóp.
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
      <IconButton
        aria-label={t('study_month_prev') || ''}
        onClick={() => onChange(addMonths(month, -1))}
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
          maxDate={dayjs(maxMonth)}
          onChange={(value) => {
            if (value && value.isValid()) {
              onChange(new Date(value.year(), value.month(), 1));
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
        aria-label={t('study_month_next') || ''}
        disabled={isMaxMonth}
        onClick={() => onChange(addMonths(month, 1))}
        sx={{ p: { xs: 1.5, md: 1 } }}
      >
        <Iconify icon="eva:arrow-ios-forward-fill" />
      </IconButton>

      {!isMaxMonth && (
        <Button
          onClick={() => onChange(maxMonth)}
          sx={{ flexShrink: 0, minHeight: 44, width: { xs: 1, sm: 'auto' } }}
        >
          {t('study_report_this_month')}
        </Button>
      )}
    </Stack>
  );
}
