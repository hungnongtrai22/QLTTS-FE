import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IAccountItem } from 'src/types/user';
// utils
import axios, { API_ENDPOINTS } from 'src/utils/axios';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const MIN_PASSWORD_LENGTH = 8;

type FormValuesProps = {
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  account: IAccountItem | null;
};

export default function AccountResetPasswordForm({ open, onClose, account }: Props) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const ResetSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required(t('account_password_required') || 'Password is required')
      .min(MIN_PASSWORD_LENGTH, t('account_password_min') || 'Password too short'),
    confirmPassword: Yup.string()
      .required(t('account_confirm_required') || 'Please confirm the password')
      .oneOf([Yup.ref('newPassword')], t('account_password_mismatch') || 'Passwords do not match'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({ newPassword: '', confirmPassword: '' });
    }
  }, [open, reset]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await axios.put(API_ENDPOINTS.account.resetPassword, {
          _id: account?._id,
          newPassword: data.newPassword,
        });

        enqueueSnackbar(t('account_password_updated') || 'Password updated');
        reset();
        onClose();
      } catch (error) {
        enqueueSnackbar((error as any)?.message || t('account_save_error') || 'Save failed', {
          variant: 'error',
        });
      }
    },
    [account, enqueueSnackbar, onClose, reset, t]
  );

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      fullScreen={!mdUp}
      PaperProps={{ sx: { borderRadius: { xs: 0, md: 2 } } }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{t('account_reset_password_title')}</DialogTitle>

        <DialogContent dividers sx={{ pt: 2.5, pb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2.5, typography: 'body2' }}>
            {t('account_reset_password_note', { name: account?.name || '' })}
          </Alert>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <RHFTextField
              name="newPassword"
              type="password"
              label={t('account_field_new_password')}
              helperText={t('account_password_hint')}
            />
            <RHFTextField
              name="confirmPassword"
              type="password"
              label={t('account_field_confirm_password')}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" color="warning" loading={isSubmitting}>
            {t('account_reset_password_action')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
