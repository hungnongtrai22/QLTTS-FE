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
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';

import LoadingButton from '@mui/lab/LoadingButton';
import { characteristicList } from 'src/utils/characteristic';
import { statusIntern } from 'src/utils/status';
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

export default function InternCompanyTradeUnionForm({ currentIntern }: Props) {
  // const router = useRouter();

  const [tradeUnion, setTradeUnion] = useState([]);
  const [tradeUnionSelect, setTradeUnionSelect] = useState(currentIntern?.tradeUnion);
  const [company, setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState(currentIntern?.companySelect || '');

  const [source, setSource] = useState([]);
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
      tradeUnion: currentIntern?.tradeUnion || null,
      company: currentIntern?.companySelect || null,
      job: currentIntern?.job || '',
      interviewDate: currentIntern?.interviewDate || null,
      studyDate: currentIntern?.studyDate || null,
      startDate: currentIntern?.startDate || null,
      source: currentIntern?.source || null,
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
      // console.log(currentIntern?._id, tradeUnionSelect, companySelect);
      const { data } = await axios.put(
        `${process.env.REACT_APP_HOST_API}/api/user/updateTradeUnion`,
        {
          _id: currentIntern?._id,
          tradeUnion: tradeUnionSelect,
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

  const handleGetTradeUnion = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/list`);
    setTradeUnion(data.tradeUnions);
  }, []);

  const handleGetSource = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/source/list`);
    setSource(data.sources);
  }, []);

  const handleSelectTradeUnion = useCallback(async (id: any) => {
    setTradeUnionSelect(id);
    setCompanySelect('');

    setValue('company', null);
  }, []);

  const handleSelectSource = useCallback(async (id: any) => {
    setSourceSelect(id);
  }, []);

  const handleSelectCompany = useCallback(async (id: any) => {
    setCompanySelect(id);
  }, []);

  const handleGetCompanyByTradeUnionId = useCallback(async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/company/listByTradeUnion`,
      {
        tradeUnion: tradeUnionSelect,
      }
    );
    setCompany(data.companies);
  }, [tradeUnionSelect]);

  useEffect(() => {
    handleGetTradeUnion();
    handleGetSource();
    // setValue('tradeUnion', currentIntern?.tradeUnion);
    // setValue(
    //   'tradeUnion',
    //   {
    //     _id: '682a9056b1e4651739e9e88d',
    //     name: 'GLOBAL JINZAI SUPPORT KYODO KUMIAI',
    //     email: '',
    //     address: '429 Butai',
    //     city: 'Tsukubamirai-shi',
    //     state: 'Ibaraki-ken',
    //     country: 'Nhật Bản',
    //     phone: '0297385937',
    //   },
    //   { shouldValidate: true }
    // );
  }, [handleGetTradeUnion]);

  useEffect(() => {
    if (tradeUnionSelect) {
      handleGetCompanyByTradeUnionId();
    }
  }, [tradeUnionSelect, handleGetCompanyByTradeUnionId]);

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
            {/* <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Family:
            </Typography> */}
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

              {tradeUnion.length > 0 && (
                <RHFAutocompleteNew
                  name="tradeUnion"
                  label={t('trade_union') || ''}
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={tradeUnion}
                  getOptionLabel={(option: any) => option?.name || ''}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id} value={option._id}>
                      {option.name}
                    </li>
                  )}
                  changeState={handleSelectTradeUnion}
                  isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                />
              )}

              <RHFAutocompleteNew
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
                name="interviewDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('interviewDate')}
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
              )}
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
