import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// types
import { ITradeUnionItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axios from 'axios';
import dayjs from 'dayjs';
import { useLocales } from 'src/locales';
import { MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { viVN } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IOrderItem } from 'src/types/order';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatar: CustomFile | string;
  recruitmentDate: any;
}

type Props = {
  // currentUser?: IUserItem;
  currentOrder?: IOrderItem;
};

export default function OrderNewEditForm({ currentOrder }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t } = useLocales();

  dayjs.locale('vi');

  const [interns, setInterns] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentOrder?.name || '',
      priority: currentOrder?.priority || '',
      interviewFormat: currentOrder?.interviewFormat || '',
      status: currentOrder?.status || '',
      recruitmentDate: currentOrder?.recruitmentDate || '',
      work: currentOrder?.work || '',
      description: currentOrder?.description || '',
      contractPeriod: currentOrder?.contractPeriod || '',
      ageFrom: currentOrder?.ageFrom || '',
      ageTo: currentOrder?.ageTo || '',
      quantity: currentOrder?.quantity || '',
      quantityMen: currentOrder?.quantityMen || '',
      quantityWomen: currentOrder?.quantityWomen || '',
      married: currentOrder?.married || '',
      study: currentOrder?.study || '',
      applicationConditions: currentOrder?.applicationConditions || '',
      insurance: currentOrder?.insurance || '',
                  housingConditions: currentOrder?.housingConditions || '',
                  livingConditions: currentOrder?.livingConditions || '',
                  otherLivingConditions: currentOrder?.otherLivingConditions || '',

      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  // const createNewTradeUnion = useCallback(async (tradeUnion: any) => {
  //   const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/create`, {
  //     ...tradeUnion,
  //   });
  //   return data;
  // }, []);

  const getAllInterns = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`);
    setInterns(data.interns);
  }, []);

  const createOrder = useCallback(async (order: any) => {
    console.log('TESTT', order);
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/order/create`, {
      ...order,
      listWorker: [],
      listIntern: [],
    });
    return data;
  }, []);

  const editOrder = useCallback(
    async (order: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/order/edit`, {
        ...order,
        _id: currentOrder?._id,
      });
      return data;
    },
    [currentOrder]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // router.push(paths.dashboard.user.list);
        if (currentOrder) {
          await editOrder(data);
          enqueueSnackbar(currentOrder ? 'Update success!' : 'Create success!');
        } else {
          await createOrder(data);
          enqueueSnackbar(currentOrder ? 'Update success!' : 'Create success!');
        }
        reset();
      } catch (error) {
        console.error(error);
      }
    },
    [createOrder, enqueueSnackbar, currentOrder, reset, editOrder]
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  useEffect(() => {
    getAllInterns();
  }, [getAllInterns]);

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
              <RHFTextField name="name" label={t('name')} />
              <RHFSelect
                fullWidth
                name="priority"
                label={t('priority')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Bình thường', 'Ưu tiên cao', 'Tuyển gấp'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="interviewFormat" label={t('interviewFormat')} />
              <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Đang tuyển', 'Đã tuyển đủ', 'Tạm ngưng tuyển', 'Không tuyển nữa'].map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </RHFSelect>
              {/* <RHFTextField name="recruitmentDate" label={t('recruitmentDate')} /> */}

              <Controller
                name="recruitmentDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('recruitmentDate')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              <RHFTextField name="work" label={t('work')} />

              {/* <RHFTextField name="description" label={t('description')} /> */}

              {/* <RHFTextField name="address" label={t('address')} /> */}
            </Box>

            <Box sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                {t('description')}
              </Typography>
              <RHFEditor simple name="description" />
            </Box>
            <Box sx={{ pt: 3, pb: 3 }}>
              <Typography variant="h6" sx={{}}>
                Thông tin đơn hàng
              </Typography>
            </Box>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="contractPeriod" label={t('contractPeriod')} type="number" />
              <RHFTextField name="ageFrom" label={t('ageFrom')} type="number" />
              <RHFTextField name="ageTo" label={t('ageTo')} type="number" />
              <RHFTextField name="quantity" label={t('quantity')} type="number" />
              <RHFTextField name="quantityMen" label={t('quantityMen')} type="number" />
              <RHFTextField name="quantityWomen" label={t('quantityWomen')} type="number" />
              {/* <RHFTextField name="description" label={t('description')} /> */}

              {/* <RHFTextField name="address" label={t('address')} /> */}
            </Box>
            <Box sx={{ pt: 3, pb: 3 }}>
              <Typography variant="h6" sx={{}}>
                Thông tin yêu cầu
              </Typography>
            </Box>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                fullWidth
                name="married"
                label={t('married')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Chưa kết hôn', 'Không yêu cầu'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="study"
                label={t('study')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Tốt nghiệp THPT', 'Tốt nghiệp cao đẳng', 'Tốt nghiệp đại học'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Box sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                {t('applicationConditions')}
              </Typography>
              <RHFEditor simple name="applicationConditions" />
            </Box>

            <Box sx={{ pt: 3, pb: 3 }}>
              <Typography variant="h6" sx={{}}>
                Thông tin phúc lợi
              </Typography>
            </Box>

            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                fullWidth
                name="insurance"
                label={t('insurance')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Có', 'Không'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="housingConditions" label={t('housingConditions')} />
              <RHFTextField name="livingConditions" label={t('livingConditions')} />
            </Box>

            <Box sx={{ pt: 3, pb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                {t('otherLivingConditions')}
              </Typography>
              <RHFEditor simple name="otherLivingConditions" />
            </Box>

            {/* <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                multiple
                // limitTags={2}
                name="listIntern"
                label={t('listIntern') || ''}
                disablePortal
                options={interns.map((item: any) => ({ _id: item._id, name: item.name }))}
                getOptionLabel={(item: any) => item.name}
                isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                renderOption={(props, option: any) => (
                  <li {...props} key={option._id} value={option._id}>
                    {option.name}
                  </li>
                )}
              />
            </Box> */}

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
                {!currentOrder ? t('create_order') : t('edit_order')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
