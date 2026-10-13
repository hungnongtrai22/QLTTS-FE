import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useLocales } from 'src/locales';
// utils
import { statusIntern } from 'src/utils/status';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

// Đúng các ô của khối "Thông tin nghiệp đoàn và công ty" (intern-company-trade-union-form),
// cùng thứ tự trên form. Phải khớp CLEARED_FIELDS của /api/user/cancelOrder bên BE.
const CLEARED_FIELD_KEYS = [
  'trade_union',
  'company_new',
  'job',
  'interviewDate',
  'studyDate',
  'startDate',
  'source',
];

// Chỉ mờ dần, không trượt: trượt lên làm nội dung tràn khung, hộp thoại chớp thanh cuộn.
const fadeIn = varFade().in;

const statusLabel = (value: string) =>
  statusIntern.find((item) => item.value === value)?.label || value;

type Props = {
  open: boolean;
  name: string;
  onClose: VoidFunction;
  // Trả về true khi hủy thành công; lỗi đã được báo bằng snackbar ở view.
  onConfirm: () => Promise<boolean>;
};

export default function InternCancelOrderDialog({ open, name, onClose, onConfirm }: Props) {
  const { t } = useLocales();

  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    const ok = await onConfirm();
    setSubmitting(false);
    // Lỗi thì giữ hộp thoại để người dùng đọc thông báo và bấm lại hoặc quay lại.
    if (ok) onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={submitting ? undefined : onClose}>
      <DialogTitle sx={{ pb: 2 }}>{t('intern_cancel_order_title')}</DialogTitle>

      <DialogContent>
        <MotionContainer>
          <Stack spacing={2.5}>
            <m.div variants={fadeIn}>
              <Typography variant="body2">{t('intern_cancel_order_content', { name })}</Typography>
            </m.div>

            <m.div variants={fadeIn}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" sx={{ minWidth: 88 }}>
                  {t('status')}
                </Typography>
                <Label color="success">{statusLabel('study')}</Label>
                <Iconify icon="eva:arrow-forward-fill" width={16} sx={{ color: 'text.disabled' }} />
                <Label>{statusLabel('interview')}</Label>
              </Stack>
            </m.div>

            <m.div variants={fadeIn}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('intern_cancel_order_cleared')}
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  columnGap: 2,
                  rowGap: 0.5,
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                {CLEARED_FIELD_KEYS.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </Box>
            </m.div>

            <m.div variants={fadeIn}>
              <Typography variant="caption" component="p" sx={{ color: 'text.secondary' }}>
                {t('intern_cancel_order_note')}
              </Typography>
            </m.div>
          </Stack>
        </MotionContainer>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="error"
          loading={submitting}
          onClick={handleConfirm}
          sx={{ minHeight: { xs: 44, sm: 36 } }}
        >
          {t('intern_cancel_order')}
        </LoadingButton>

        <Button
          variant="outlined"
          color="inherit"
          disabled={submitting}
          onClick={onClose}
          sx={{ minHeight: { xs: 44, sm: 36 } }}
        >
          {t('back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
