import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useLocales } from 'src/locales';
import { MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { viVN } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatar: CustomFile | string;
  avatarURL: string | null;
  namejp: string;
  gender: string;
  blood: string;
  birthday: Date | string | null;
  age: number;
  height: number;
  weight: number;
  BMI: number;
  blindColor: boolean;
  hand: string;
  leftEye: number;
  rightEye: number;
  address: string;
  city: string;
  married: string;
  driverLicense: string;
  smoke: boolean;
  alcohol: boolean;
  tattoo: boolean;
  schoolList: {
    timeFrom: Date | null;
    timeTo: Date | null;
    name: string;
    content: string;
    current: string;
  }[];
  companyList: {
    timeFrom: Date | null;
    timeTo: Date | null;
    name: string;
    content: string;
  }[];
  familyList: {
    relationship: string;
    name: string;
    year: Date;
    location: String;
    occupation: String;
  }[];
  interest: string;
  foreignLanguage: string;
  strong: string;
  weak: string;
  aim: string;
  plan: string;
  money: string;
  familyInJapan: boolean;
  moveForeign: boolean;
}

type Props = {
  // currentUser?: IUserItem;
  currentTradeUnion?: ITradeUnionItem;
};

export default function OrderNewEditForm({ currentTradeUnion }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t } = useLocales();

  const [interns, setInterns] = useState([]);
  console.log(interns);

  const { enqueueSnackbar } = useSnackbar();

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    // userId: Yup.number().required('UserId is required').min(1),
    name: Yup.string().required('Name is required'),
    // familyInJapan: Yup.boolean().required('familyInJapan is required'),
    // moveForeign: Yup.boolean().required('Move Foreign is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTradeUnion?.name || '',
      email: currentTradeUnion?.email || '',
      phone: currentTradeUnion?.phone || '',
      city: currentTradeUnion?.city || '',
      state: currentTradeUnion?.state || '',
      country: currentTradeUnion?.country || '',
      address: currentTradeUnion?.address || '',
      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTradeUnion]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    // reset,
    // watch,
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

  const createOrder = useCallback(async (tradeUnion: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/order/create`, {
      ...tradeUnion,
    });
    return data;
  }, []);

  const editTradeUnion = useCallback(
    async (intern: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/edit`, {
        ...intern,
        _id: currentTradeUnion?._id,
      });
      return data;
    },
    [currentTradeUnion]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // router.push(paths.dashboard.user.list);
        if (currentTradeUnion) {
          await editTradeUnion(data);
          enqueueSnackbar(currentTradeUnion ? 'Update success!' : 'Create success!');
        } else {
          await createOrder(data);
          enqueueSnackbar(currentTradeUnion ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [createOrder, editTradeUnion, enqueueSnackbar, currentTradeUnion]
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
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="vi"
                localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DatePicker
                  label={t('recruitmentDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
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

            <Box sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                {t('otherLivingConditions')}
              </Typography>
              <RHFEditor simple name="otherLivingConditions" />
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
              <RHFAutocomplete
                multiple
                // limitTags={2}
                name="listWorker"
                label={t('listWorker') || ''}
                disablePortal
                options={interns.map((item: any) => ({ _id: item._id, name: item.name }))}
                getOptionLabel={(item: any) => item.name}
                isOptionEqualToValue={(option : any, value: any) => option._id === value._id}
                renderOption={(props, option: any) => (
                  <li {...props} key={option._id} value={option._id}>
                    {option.name}
                  </li>
                )}
              />
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
                {!currentTradeUnion ? t('create_order') : t('edit_order')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
