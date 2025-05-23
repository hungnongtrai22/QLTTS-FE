import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
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
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useLocales } from 'src/locales';

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


export default function TradeUnionNewEditForm({ currentTradeUnion }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t } = useLocales();

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

  const createNewTradeUnion = useCallback(async (tradeUnion: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/create`, {
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
          console.log('TESTTTTTT', data);
          await editTradeUnion(data);
        } else {
          await createNewTradeUnion(data);
          enqueueSnackbar(currentTradeUnion ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [createNewTradeUnion, editTradeUnion, enqueueSnackbar, currentTradeUnion]
    // [currentIntern, enqueueSnackbar, reset, router]
  );

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
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phone" label={t('phone')} />
              <RHFTextField name="city" label={t('city')} />
              <RHFTextField name="state" label={t('state')} />

              {/* <RHFSelect
                fullWidth
                name="foreignLanguage"
                label={t('foreign_language')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['日本語：簡単な自己紹介ができます', 'なし'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <RHFTextField name="country" label={t('country')} />
              <RHFTextField name="address" label={t('address')} />
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
                {!currentTradeUnion ? t('create_trade_union') : t('edit_trade_union')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
