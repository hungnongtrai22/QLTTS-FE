import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { m } from 'framer-motion';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { viVN } from '@mui/x-date-pickers/locales';
// types
import { IInternItem } from 'src/types/user';
// utils
import { statusProfile, statusStudy } from 'src/utils/status';
// locales
import { useLocales } from 'src/locales';
// components
import { varFade } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
//
import InternContractButton from './intern-contract-button';

// ----------------------------------------------------------------------
// Form "Hồ sơ xuất cảnh" trong tab "Thông tin bổ sung" (chỉ admin) của trang hồ sơ TTS.
//
// Lưu qua /api/user/updateLaborInfo. Trước đây form gửi tới updateTradeUnion, endpoint đó
// chỉ lưu nghiệp đoàn/công ty/các ngày nên CCCD, hộ chiếu, số hợp đồng... đều bị bỏ đi.
// Form này cố ý KHÔNG gửi nghiệp đoàn/công ty/trạng thái/ngày xuất cảnh: các trường đó do
// InternCompanyTradeUnionForm và InternStatusForm ngay phía trên quản lý; gửi từ đây sẽ ghi
// đè bằng giá trị cũ.
// ----------------------------------------------------------------------

dayjs.locale('vi');

const JOB_OPTIONS = [
  'Nông nghiệp cấy giống',
  'Nông nghiệp chăn nuôi',
  'Nghề cá đi tàu',
  'Nuôi trồng thủy sản',
  'Khoan giếng',
  'Làm kim loại miếng dùng trong xây dựng',
  'Gắn máy điều hòa không khí và máy đông lạnh',
  'Làm những đồ cố định',
  'Thợ mộc',
  'Lắp cốp pha panen',
  'Xây dựng thanh gia cố',
  'Dựng giàn giáo',
];

const DATE_FIELDS = ['citizenDate', 'passportDate', 'contractDate'] as const;

// Ngày: chuỗi ISO khi đọc từ hồ sơ, Dayjs sau khi người dùng chọn trên DatePicker.
type DateValue = string | Date | Dayjs | null;

type FormValues = {
  field: string;
  citizenId: string;
  citizenDate: DateValue;
  citizenPlace: string;
  passportId: string;
  passportDate: DateValue;
  reff: string;
  street: string;
  state: string;
  postelCode: string;
  country: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  contractId: string;
  contractDate: DateValue;
  contractPeriod: string;
  contractResult: string;
  profileStatus: string;
};

const GRID = {
  display: 'grid',
  rowGap: 3,
  columnGap: 3,
  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
};

// ----------------------------------------------------------------------

function RHFDate({ name, label }: { name: string; label: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="vi"
          localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <DatePicker
            label={label}
            value={field.value ? dayjs(field.value as string) : null}
            onChange={(newValue) => field.onChange(newValue || null)}
            slotProps={{
              textField: { fullWidth: true, error: !!error, helperText: error?.message },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}

function SectionTitle({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3, mt: first ? 0 : 4 }}>
      {children}
    </Typography>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 3, mb: 2 }}>
      {children}
    </Typography>
  );
}

// ----------------------------------------------------------------------

type Props = {
  currentIntern?: IInternItem;
};

export default function InternPassForm({ currentIntern }: Props) {
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo<FormValues>(
    () => ({
      field: currentIntern?.field || '',
      citizenId: currentIntern?.citizenId || '',
      citizenDate: currentIntern?.citizenDate || null,
      citizenPlace: currentIntern?.citizenPlace || '',
      passportId: currentIntern?.passportId || '',
      passportDate: currentIntern?.passportDate || null,
      reff: currentIntern?.reff || '',
      street: currentIntern?.street || '',
      state: currentIntern?.state || '',
      postelCode: currentIntern?.postelCode || '',
      country: currentIntern?.country || '',
      phone: currentIntern?.phone || '',
      emergencyContactName: currentIntern?.emergencyContactName || '',
      emergencyContactRelationship: currentIntern?.emergencyContactRelationship || '',
      emergencyContactPhone: currentIntern?.emergencyContactPhone || '',
      contractId: currentIntern?.contractId || '',
      contractDate: currentIntern?.contractDate || null,
      contractPeriod: currentIntern?.contractPeriod || '',
      contractResult: currentIntern?.contractResult || '',
      profileStatus: currentIntern?.profileStatus || '',
    }),
    [currentIntern]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // Hồ sơ có thể tải xong sau khi form đã dựng — nạp lại giá trị ban đầu khi có dữ liệu.
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const body: Record<string, unknown> = { _id: currentIntern?._id, ...values };
      DATE_FIELDS.forEach((key) => {
        body[key] = values[key] ? dayjs(values[key]).toISOString() : null;
      });
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updateLaborInfo`, body);
      // Giá trị vừa lưu thành mốc mới: form hết "thay đổi chưa lưu", in hợp đồng được ngay.
      reset(values);
      enqueueSnackbar(t('save_success'));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || error?.message || t('save_failed'), {
        variant: 'error',
      });
    }
  });

  // In từ dữ liệu ĐÃ LƯU (lấy lại từ server) để bản in khớp đúng hồ sơ.
  const loadIntern = useCallback(async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_HOST_API}/api/user/${currentIntern?._id}`
    );
    return data?.intern ? [data.intern] : [];
  }, [currentIntern?._id]);

  const canPrint = useCallback(() => {
    if (isDirty) {
      enqueueSnackbar(t('contract_save_first'), { variant: 'warning' });
      return false;
    }
    return true;
  }, [enqueueSnackbar, isDirty, t]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <m.div initial="initial" animate="animate" variants={varFade({ distance: 24 }).inUp}>
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <SectionTitle first>{t('labor_info')}</SectionTitle>

          <Box sx={GRID}>
            <RHFAutocomplete
              name="field"
              label={t('field_accepted') || ''}
              helperText={t('field_accepted_hint') || ''}
              freeSolo
              options={JOB_OPTIONS}
              getOptionLabel={(option: any) => option}
              isOptionEqualToValue={(option: any, value: any) => option === value}
            />
            <RHFTextField name="citizenId" label={t('citizen_id')} />
            <RHFDate name="citizenDate" label={t('citizen_date')} />
            <RHFTextField name="citizenPlace" label={t('citizen_place')} />
            <RHFTextField name="passportId" label={t('passport_id')} />
            <RHFDate name="passportDate" label={t('passport_date')} />
          </Box>

          <GroupTitle>{t('labor_contact')}</GroupTitle>
          <Box sx={GRID}>
            <RHFTextField
              name="street"
              label={t('permanent_address')}
              placeholder={t('permanent_address_hint') || ''}
            />
            <RHFTextField name="state" label={t('province')} />
            <RHFTextField name="postelCode" label={t('postal_code')} />
            <RHFTextField name="country" label={t('country')} />
            <RHFTextField name="phone" label={t('phone')} inputProps={{ inputMode: 'tel' }} />
            <RHFTextField name="reff" label={t('referrer')} />
          </Box>

          <GroupTitle>{t('labor_emergency')}</GroupTitle>
          <Box sx={GRID}>
            <RHFTextField name="emergencyContactName" label={t('emergency_contact_name')} />
            <RHFTextField
              name="emergencyContactRelationship"
              label={t('emergency_contact_relationship')}
              placeholder={t('emergency_contact_relationship_hint') || ''}
            />
            <RHFTextField
              name="emergencyContactPhone"
              label={t('emergency_contact_phone')}
              inputProps={{ inputMode: 'tel' }}
            />
          </Box>

          <SectionTitle>{t('labor_contract')}</SectionTitle>
          <Box sx={GRID}>
            <RHFTextField
              name="contractId"
              label={t('contract_id')}
              placeholder={t('contract_id_hint') || ''}
            />
            <RHFDate name="contractDate" label={t('contract_date')} />
            <RHFTextField name="contractPeriod" label={t('contract_period')} />
            <RHFSelect name="contractResult" label={t('profile_progress')}>
              {statusProfile.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="profileStatus" label={t('training_status')}>
              {statusStudy.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="flex-end"
            spacing={1.5}
            sx={{ mt: 3 }}
          >
            <InternContractButton loadInterns={loadIntern} canPrint={canPrint} />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ minHeight: 44 }}
            >
              {t('edit_intern')}
            </LoadingButton>
          </Stack>
        </Card>
      </m.div>
    </FormProvider>
  );
}
