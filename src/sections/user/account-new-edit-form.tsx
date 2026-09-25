import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
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
import { roleAccount } from 'src/utils/role';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const MIN_PASSWORD_LENGTH = 8;

type Option = { label: string; value: string };

type FormValuesProps = {
  name: string;
  username: string;
  password: string;
  email: string;
  role: string;
  tradeUnion: Option | null;
  source: Option | null;
  companySelect: Option[];
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSaved: VoidFunction;
  /** Bỏ trống là tạo mới, có giá trị là chỉnh sửa. */
  currentAccount?: IAccountItem | null;
};

export default function AccountNewEditForm({ open, onClose, onSaved, currentAccount }: Props) {
  const { t, currentLang } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const isEdit = !!currentAccount;

  const [tradeUnionOptions, setTradeUnionOptions] = useState<Option[]>([]);
  const [sourceOptions, setSourceOptions] = useState<Option[]>([]);
  const [companyOptions, setCompanyOptions] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const AccountSchema = Yup.object().shape({
    name: Yup.string().required(t('account_name_required') || 'Name is required'),
    username: isEdit
      ? Yup.string()
      : Yup.string().required(t('account_username_required') || 'Username is required'),
    password: isEdit
      ? Yup.string()
      : Yup.string()
          .required(t('account_password_required') || 'Password is required')
          .min(MIN_PASSWORD_LENGTH, t('account_password_min') || 'Password too short'),
    email: Yup.string().email(t('account_email_invalid') || 'Invalid email'),
    role: Yup.string().required(t('account_role_required') || 'Role is required'),
  });

  const defaultValues = useMemo<FormValuesProps>(
    () => ({
      name: currentAccount?.name || '',
      username: currentAccount?.username || '',
      password: '',
      email: currentAccount?.email || '',
      role: currentAccount?.role || 'tradeunion',
      tradeUnion: currentAccount?.tradeUnion
        ? { label: currentAccount.tradeUnion.name, value: currentAccount.tradeUnion._id }
        : null,
      source: currentAccount?.source
        ? { label: currentAccount.source.name, value: currentAccount.source._id }
        : null,
      companySelect: (currentAccount?.companySelect || []).map((item) => ({
        label: item.name,
        value: item._id,
      })),
    }),
    [currentAccount]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AccountSchema) as any,
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const role = watch('role');
  const tradeUnionValue = watch('tradeUnion');

  // Nạp lại giá trị mỗi lần mở dialog, tránh giữ dữ liệu của tài khoản mở trước đó.
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  // Đổi nghiệp đoàn thì bỏ các công ty đã chọn — chúng thuộc nghiệp đoàn cũ.
  // Dùng ref để phân biệt "người dùng vừa đổi" với "vừa nạp giá trị có sẵn lúc mở dialog".
  const previousTradeUnionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      previousTradeUnionRef.current = null;
      return;
    }

    const current = tradeUnionValue?.value ?? null;
    const previous = previousTradeUnionRef.current;

    if (previous !== null && previous !== current) {
      setValue('companySelect', []);
    }

    previousTradeUnionRef.current = current;
  }, [open, tradeUnionValue, setValue]);

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [tradeUnionRes, sourceRes] = await Promise.all([
        axios.get(API_ENDPOINTS.tradeUnion.list),
        axios.get(API_ENDPOINTS.source.list),
      ]);

      setTradeUnionOptions(
        (tradeUnionRes.data?.tradeUnions || []).map((item: any) => ({
          label: item.name,
          value: item._id,
        }))
      );
      setSourceOptions(
        (sourceRes.data?.sources || []).map((item: any) => ({
          label: item.name,
          value: item._id,
        }))
      );
    } catch (error) {
      enqueueSnackbar(t('account_load_options_error') || 'Could not load options', {
        variant: 'error',
      });
    } finally {
      setLoadingOptions(false);
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    if (open) {
      loadOptions();
    }
  }, [open, loadOptions]);

  // Danh sách công ty phải thuộc đúng nghiệp đoàn đang chọn — không phải toàn bộ công ty.
  const loadCompanies = useCallback(
    async (tradeUnionId: string) => {
      setLoadingCompanies(true);
      try {
        const { data } = await axios.post(API_ENDPOINTS.company.listByTradeUnion, {
          tradeUnion: tradeUnionId,
        });

        setCompanyOptions(
          (data?.companies || []).map((item: any) => ({ label: item.name, value: item._id }))
        );
      } catch (error) {
        enqueueSnackbar(t('account_load_options_error') || 'Could not load options', {
          variant: 'error',
        });
        setCompanyOptions([]);
      } finally {
        setLoadingCompanies(false);
      }
    },
    [enqueueSnackbar, t]
  );

  useEffect(() => {
    if (!open || role !== 'tradeunion' || !tradeUnionValue?.value) {
      setCompanyOptions([]);
      return;
    }

    loadCompanies(tradeUnionValue.value);
  }, [open, role, tradeUnionValue, loadCompanies]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const payload: Record<string, any> = {
          name: data.name,
          email: data.email,
          role: data.role,
          tradeUnion: data.role === 'tradeunion' ? data.tradeUnion?.value : undefined,
          source: data.role === 'source' ? data.source?.value : undefined,
          // Mảng rỗng = không giới hạn. BE sẽ xoá hẳn thuộc tính chứ không lưu [].
          companySelect:
            data.role === 'tradeunion' ? data.companySelect.map((item) => item.value) : [],
        };

        if (isEdit) {
          await axios.put(API_ENDPOINTS.account.edit, { ...payload, _id: currentAccount?._id });
          enqueueSnackbar(t('account_updated') || 'Account updated');
        } else {
          await axios.post(API_ENDPOINTS.account.create, {
            ...payload,
            username: data.username,
            password: data.password,
          });
          enqueueSnackbar(t('account_created') || 'Account created');
        }

        reset();
        onClose();
        onSaved();
      } catch (error) {
        // Interceptor của src/utils/axios trả thẳng body lỗi, nên message nằm ở đây.
        enqueueSnackbar((error as any)?.message || t('account_save_error') || 'Save failed', {
          variant: 'error',
        });
      }
    },
    [isEdit, currentAccount, enqueueSnackbar, onClose, onSaved, reset, t]
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      fullScreen={!mdUp}
      PaperProps={{ sx: { borderRadius: { xs: 0, md: 2 } } }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>
          {isEdit ? t('account_edit_title') : t('account_new_title')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2.5, pb: 3 }}>
          <Box
            rowGap={2.5}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <RHFTextField name="name" label={t('account_field_name')} />

            <RHFSelect name="role" label={t('account_field_role')}>
              {roleAccount.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {currentLang.value === 'jp' ? option.labelJP : option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {!isEdit && (
              <>
                <RHFTextField name="username" label={t('account_field_username')} />
                <RHFTextField
                  name="password"
                  type="password"
                  label={t('account_field_password')}
                  helperText={t('account_password_hint')}
                />
              </>
            )}

            <RHFTextField name="email" label={t('account_field_email')} />
          </Box>

          <Box sx={{ mt: 2.5, display: 'grid', gap: 2.5 }}>
            {role === 'tradeunion' && (
              <RHFAutocomplete
                name="tradeUnion"
                label={t('account_field_trade_union') || ''}
                options={tradeUnionOptions}
                loading={loadingOptions}
                isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                getOptionLabel={(option: any) => option?.label || ''}
              />
            )}

            {role === 'source' && (
              <RHFAutocomplete
                name="source"
                label={t('account_field_source') || ''}
                options={sourceOptions}
                loading={loadingOptions}
                isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                getOptionLabel={(option: any) => option?.label || ''}
              />
            )}

            {/* Giới hạn xem công ty chỉ có nghĩa với tài khoản nghiệp đoàn. */}
            {role === 'tradeunion' && (
              <RHFAutocomplete
                multiple
                name="companySelect"
                label={t('account_field_company') || ''}
                placeholder={t('account_company_placeholder') || ''}
                options={companyOptions}
                loading={loadingCompanies}
                disabled={!tradeUnionValue?.value}
                helperText={
                  tradeUnionValue?.value
                    ? t('account_company_hint')
                    : t('account_company_needs_trade_union')
                }
                isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                getOptionLabel={(option: any) => option?.label || ''}
              />
            )}

            {role === 'demo' && (
              <Alert severity="info" sx={{ typography: 'body2' }}>
                {t('account_demo_note')}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? t('save') : t('create')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
