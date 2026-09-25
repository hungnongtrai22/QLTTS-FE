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
import { ICompanyItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useLocales } from 'src/locales';
import { MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { varFade } from 'src/components/animate';

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
  // currentTradeUnion?: ITradeUnionItem;
  currentCompany?: ICompanyItem;
};

// Khối lương in trên HĐLĐ (Yên). Ô chữ + inputMode numeric chứ không dùng type="number":
// RHFTextField đổi ô number rỗng thành 0, còn ở đây rỗng phải là "chưa có" để BE $unset.
const MONEY_FIELDS = [
  { name: 'trainingAllowance', label: 'company_training_allowance' },
  { name: 'salary', label: 'company_salary' },
  { name: 'tax', label: 'company_tax' },
  { name: 'socialInsurance', label: 'company_social_insurance' },
  { name: 'housingFee', label: 'company_housing_fee' },
] as const;

export default function CompanyNewEditForm({ currentCompany }: Props) {
  // const router = useRouter();
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [tradeUnion, setTradeUnion] = useState([]);

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    // userId: Yup.number().required('UserId is required').min(1),
    name: Yup.string().required('Name is required'),
    // familyInJapan: Yup.boolean().required('familyInJapan is required'),
    // moveForeign: Yup.boolean().required('Move Foreign is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCompany?.name || '',
      email: currentCompany?.email || '',
      phone: currentCompany?.phone || '',
      city: currentCompany?.city || '',
      state: currentCompany?.state || '',
      country: currentCompany?.country || '',
      address: currentCompany?.address || '',
      tradeUnion: currentCompany?.tradeUnion || '',
      description: currentCompany?.description || '',
      // Khối dùng cho HĐLĐ. Giữ dạng chuỗi để ô trống vẫn là '' (BE $unset), không thành 0.
      contractName: currentCompany?.contractName || '',
      director: currentCompany?.director || '',
      trainingAllowance: currentCompany?.trainingAllowance ?? '',
      salary: currentCompany?.salary ?? '',
      tax: currentCompany?.tax ?? '',
      socialInsurance: currentCompany?.socialInsurance ?? '',
      housingFee: currentCompany?.housingFee ?? '',
      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCompany]
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

  const createNewCompany = useCallback(async (company: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/company/create`, {
      ...company,
    });
    return data;
  }, []);

  const editCompany = useCallback(
    async (intern: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/company/edit`, {
        ...intern,
        _id: currentCompany?._id,
      });
      return data;
    },
    [currentCompany]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // router.push(paths.dashboard.user.list);
        if (currentCompany) {
          await editCompany(data);
          enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
        } else {
          await createNewCompany(data);
          enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error?.message || t('save_failed'), { variant: 'error' });
      }
    },
    [createNewCompany, editCompany, enqueueSnackbar, currentCompany, t]
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  const handleGetTradeUnion = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/tradeUnion/list`);
    setTradeUnion(data.tradeUnions);
    // console.log(data.tradeUnions);
  }, []);

  useEffect(() => {
    handleGetTradeUnion();
  }, [handleGetTradeUnion]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <m.div initial="initial" animate="animate" variants={varFade({ distance: 24 }).inUp}>
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
                <RHFTextField name="web" label="Web" />

                <RHFTextField name="phone" label={t('phone')} />
                <RHFTextField name="city" label={t('city')} />
                <RHFTextField name="state" label={t('state')} />

                <RHFTextField name="country" label={t('country')} />
                <RHFTextField name="address" label={t('address')} />

                <RHFSelect
                  fullWidth
                  name="tradeUnion"
                  label={t('trade_union')}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {tradeUnion.map((option: any) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 4, mb: 2 }}>
                {t('company_contract_section')}
              </Typography>
              <Box
                rowGap={3}
                columnGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                <RHFTextField
                  name="contractName"
                  label={t('contract_name')}
                  helperText={t('contract_name_hint')}
                />
                <RHFTextField name="director" label={t('company_director')} />
                {MONEY_FIELDS.map((field) => (
                  <RHFTextField
                    key={field.name}
                    name={field.name}
                    label={t(field.label)}
                    placeholder={t('company_money_hint') || ''}
                    inputProps={{ inputMode: 'numeric' }}
                  />
                ))}
              </Box>
              <Box sx={{ pt: 3 }}>
                <RHFEditor simple name="description" />
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
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ minHeight: 44 }}
                >
                  {!currentCompany ? t('create_company') : t('edit_company')}
                </LoadingButton>
              </Stack>
            </Card>
          </m.div>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
