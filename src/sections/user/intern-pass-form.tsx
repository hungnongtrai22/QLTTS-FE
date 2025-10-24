/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import Grid from '@mui/material/Unstable_Grid2';
// utils
// types
import { IInternItem, IStudyItem, IUserItem } from 'src/types/user';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from '@mui/x-date-pickers/locales';
// assets
// components

import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFEditor,
  RHFTextField,
} from 'src/components/hook-form';
import {
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';

import LoadingButton from '@mui/lab/LoadingButton';
import { characteristicList } from 'src/utils/characteristic';
import { statusIntern, statusProfile, statusStudy } from 'src/utils/status';
import RHFAutocompleteNew from 'src/components/hook-form/rhf-autocomplete-new';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<any, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  currentIntern?: IInternItem;
};

dayjs.locale('vi');

const fields = [
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

export default function InternPassForm({ currentIntern }: Props) {
  // const router = useRouter();

  const [tradeUnionSelect, setTradeUnionSelect] = useState(currentIntern?.tradeUnion);
  const [companySelect, setCompanySelect] = useState(currentIntern?.companySelect || '');

  const [sourceSelect, setSourceSelect] = useState(currentIntern?.source);

  const { t, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  // const values = watch();

  // const [city, setCity] = useState('');
  // const [currentStudy, setCurrentStudy] = useState<IStudyItem | null>(null);
  // console.log(currentStudy);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      name: currentIntern?.name || '',
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
      contractId: currentIntern?.contractId || '',
      contractDate: currentIntern?.contractDate || null,
      contractPeriod: currentIntern?.contractPeriod || '',
      contractResult: currentIntern?.contractResult || '',
      profileStatus: currentIntern?.profileStatus || '',
      orderId: currentIntern?.orderId || null,
      description: currentIntern?.description || '',
    }),
    [currentIntern]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const editIntern = useCallback(
    async (value: any) => {
      console.log('Source', sourceSelect);
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/user/updateTradeUnion`,
        {
          _id: currentIntern?._id,
          field: currentIntern?.field,
          companySelect,
          job: value?.job,
          interviewDate: value?.interviewDate,
          studyDate: value?.studyDate,
          startDate: value?.startDate,
          source: sourceSelect,
        }
      );
      return data;
    },
    [currentIntern, tradeUnionSelect, companySelect, sourceSelect]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await editIntern(data);
        // reset();
        enqueueSnackbar('Update success!');
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset, editIntern]
  );

  // useEffect(() => {
  //   setValue('tradeUnion', currentIntern?.tradeUnion);
  //   setValue('company', currentIntern?.companySelect);
  // }, []);

  // useEffect(() => {
  //   handleGetStudyByMonth();
  // }, [handleGetStudyByMonth, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Thông tin lao động:
            </Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              {/* <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusIntern.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              {fields.length > 0 && (
                <RHFAutocomplete
                  name="fields"
                  label="Ngành trúng tuyển"
                  freeSolo
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={fields}
                  getOptionLabel={(option: any) => option}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option} value={option}>
                      {option}
                    </li>
                  )}
                  // changeState={handleSelectTradeUnion}
                  isOptionEqualToValue={(option: any, value: any) => option === value}
                />
              )}

              <RHFTextField name="citizenId" label="Số CCCD" />
              <Controller
                name="citizenDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label="Ngày cấp"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <RHFTextField name="citizenPlace" label="Nơi cấp" />
              <RHFTextField name="passportId" label="Số hộ chiếu" />
              <RHFTextField name="passportDate" label="Ngày cấp hộ chiếu" />
              <RHFTextField name="reff" label="Người giới thiệu" />
              <RHFTextField name="street" label="Địa chỉ thường trú" />
              <RHFTextField name="state" label="Tỉnh/Thành Phố" />
              <RHFTextField name="postelCode" label="Mã bưu điện" />
              <RHFTextField name="country" label="Quốc gia" />
              <RHFTextField name="phone" label="Điện thoại" />

              {/* <RHFAutocompleteNew
                name="company"
                label={t('company_new') || ''}
                // disablePortal
                options={company}
                getOptionLabel={(option: any) => option?.name || ''}
                renderOption={(props, option: any) => (
                  <li {...props} key={option._id} value={option._id}>
                    {option.name}
                  </li>
                )}
                changeState={handleSelectCompany}
                isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
              />

              <RHFTextField name="job" label={t('job')} />

              <Controller
                name="studyDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('studyDate')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('startDate')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              {source.length > 0 && (
                <RHFAutocompleteNew
                  name="source"
                  label={t('source') || ''}
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={source}
                  getOptionLabel={(option: any) => option?.name || ''}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id} value={option._id}>
                      {option.name}
                    </li>
                  )}
                  changeState={handleSelectSource}
                  isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                />
              )} */}
            </Box>

            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3, mt: 3 }}>
              Thông tin hợp đồng:
            </Typography>

            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="contractId" label="Số hợp đồng" />
              <Controller
                name="contractDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label="Ngày hợp đồng"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              <RHFTextField name="contractPeriod" label="Thời hạn hợp đồng" />
              <Controller
                name="departureDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label="Ngày xuất cảnh"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusIntern.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="contractResult"
                label="Tiến độ hồ sơ"
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusProfile.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="profileStatus"
                label="Đào tạo"
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusStudy.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusIntern.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              {/* {fields.length > 0 && (
                <RHFAutocomplete
                  name="fields"
                  label="Ngành trúng tuyển"
                  freeSolo
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={fields}
                  getOptionLabel={(option: any) => option}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option} value={option}>
                      {option}
                    </li>
                  )}
                  // changeState={handleSelectTradeUnion}
                  isOptionEqualToValue={(option: any, value: any) => option === value}
                />
              )}

              <RHFTextField name="citizenId" label="Số CCCD" />

              <RHFTextField name="citizenPlace" label="Nơi cấp" />
              <RHFTextField name="passportId" label="Số hộ chiếu" />
              <RHFTextField name="passportDate" label="Ngày cấp hộ chiếu" />
              <RHFTextField name="reff" label="Người giới thiệu" />
              <RHFTextField name="street" label="Địa chỉ thường trú" />
              <RHFTextField name="state" label="Tỉnh/Thành Phố" />
              <RHFTextField name="postelCode" label="Mã bưu điện" />
              <RHFTextField name="country" label="Quốc gia" />
              <RHFTextField name="phone" label="Điện thoại" /> */}

              {/* <RHFAutocompleteNew
                name="company"
                label={t('company_new') || ''}
                // disablePortal
                options={company}
                getOptionLabel={(option: any) => option?.name || ''}
                renderOption={(props, option: any) => (
                  <li {...props} key={option._id} value={option._id}>
                    {option.name}
                  </li>
                )}
                changeState={handleSelectCompany}
                isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
              />

              <RHFTextField name="job" label={t('job')} />

              <Controller
                name="studyDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('studyDate')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('startDate')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      views={['month', 'year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              {source.length > 0 && (
                <RHFAutocompleteNew
                  name="source"
                  label={t('source') || ''}
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={source}
                  getOptionLabel={(option: any) => option?.name || ''}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id} value={option._id}>
                      {option.name}
                    </li>
                  )}
                  changeState={handleSelectSource}
                  isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                />
              )} */}
            </Box>

            <Stack alignItems="flex-end" spacing={1.5}>
              {/* <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddFamily}
                sx={{ flexShrink: 0 }}
              >
                Add Item
              </Button> */}
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('edit_intern')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
