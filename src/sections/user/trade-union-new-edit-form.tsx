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
import { IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
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
  currentIntern?: IInternItem;
};

const initSchool = [
  {
    timeFrom: null,
    timeTo: null,
    name: '',
    content: '小学校',
    current: '卒業',
  },
  {
    timeFrom: null,
    timeTo: null,
    name: '',
    content: '中学校',
    current: '卒業',
  },
  {
    timeFrom: null,
    timeTo: null,
    name: '',
    content: '高校',
    current: '卒業',
  },
];

const initCompany = [
  {
    timeFrom: null,
    timeTo: null,
    name: '',
    content: '',
  },
];

const initFamily = [
  {
    relationship: '姉',
    name: '',
    year: null,
    location: '',
    occupation: '',
  },
  {
    relationship: '兄',
    name: '',
    year: null,
    location: '',
    occupation: '',
  },
];

export default function TradeUnionNewEditForm({ currentIntern }: Props) {
  // const router = useRouter();
  console.log('TEST', currentIntern);
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    // userId: Yup.number().required('UserId is required').min(1),
    name: Yup.string().required('Name is required'),
    namejp: Yup.string().required('Name JP is required'),
    gender: Yup.string().required('Gender is required'),
    blood: Yup.string().required('Blood is required'),
    birthday: Yup.date().required('Date of birth is required'),
    // age: Yup.number().required('Age is required').min(16),
    height: Yup.number().required('Height is required').min(140).max(190),
    weight: Yup.number().required('Weight is required').min(1),
    // BMI: Yup.number().required('BMI is required').min(1),
    avatar: Yup.mixed().required('Avatar is required'),
    hand: Yup.string().required('Hand is required'),
    leftEye: Yup.number().required('Left Eye is required'),
    rightEye: Yup.number().required('Right Eye is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    married: Yup.string().required('Married is required'),
    driverLicense: Yup.string().required('Driver License is required'),
    schoolList: Yup.array()
      .of(
        Yup.object().shape({
          timeFrom: Yup.date().nullable().required('Start Date is required'),
          timeTo: Yup.date()
            .nullable()
            .required('End Date is required')
            .min(Yup.ref('timeFrom'), 'End Date must be after Start Date'),
          name: Yup.string()
            .required('School Name is required')
            .max(255, 'School Name is too long'),
          content: Yup.string().required('Content is required'),
          current: Yup.string().required('Current is required'),
        })
      )
      .min(1, 'At least one school record is required'),

    companyList: Yup.array().of(
      Yup.object().shape({
        timeFrom: Yup.date().nullable().required('Start Date is required'),
        timeTo: Yup.date()
          .nullable()
          .required('End Date is required')
          .min(Yup.ref('timeFrom'), 'End Date must be after Start Date'),
        name: Yup.string()
          .required('Company Name is required')
          .max(255, 'Company Name is too long')
          .min(1, 'At least one company record is required'),
        content: Yup.string().required('Content is required'),
      })
    ),
    familyList: Yup.array().of(
      Yup.object().shape({
        relationship: Yup.string().required('Relationship is required'),
        name: Yup.string()
          .required('Name is required')
          .max(255, 'Name is too long')
          .min(1, 'At least one name record is required'),
        year: Yup.date().required('Year is required'),
        location: Yup.string().required('Location is required'),
        occupation: Yup.string().required('Occupation is required'),
      })
    ),
    interest: Yup.string().required('Interest is required'),
    foreignLanguage: Yup.string().required('Foreign Language is required'),
    strong: Yup.string().required('Strong is required'),
    weak: Yup.string().required('Weak is required'),
    aim: Yup.string().required('Aim is required'),
    plan: Yup.string().required('Plan is required'),
    money: Yup.string().required('Money is required'),
    // familyInJapan: Yup.boolean().required('familyInJapan is required'),
    // moveForeign: Yup.boolean().required('Move Foreign is required'),
  });

  const defaultValues = useMemo(
    () => ({
      userId: currentIntern?.userId || '',
      name: currentIntern?.name || '',
      namejp: currentIntern?.namejp || '',
      gender: currentIntern?.gender || '',
      blood: currentIntern?.blood || '',
      birthday: currentIntern?.birthday ? new Date(currentIntern.birthday) : '',
      familyList:
        currentIntern?.family?.map((item: any) => ({ ...item, year: new Date(item.year) })) ||
        initFamily,
      schoolList:
        currentIntern?.school?.map((item: any) => ({
          ...item,
          timeFrom: new Date(item.timeFrom),
          timeTo: new Date(item.timeTo),
        })) || initSchool,
      companyList:
        currentIntern?.company?.map((item: any) => ({
          ...item,
          timeFrom: new Date(item.timeFrom),
          timeTo: new Date(item.timeTo),
        })) || initCompany,
      blindColor: currentIntern?.blindColor || false,
      smoke: currentIntern?.smoke || false,
      alcohol: currentIntern?.alcohol || false,
      tattoo: currentIntern?.tattoo || false,
      familyInJapan: currentIntern?.familyInJapan || false,
      moveForeign: currentIntern?.moveForeign || false,
      age: currentIntern?.age || 0,
      height: currentIntern?.height || 0,
      weight: currentIntern?.weight || 0,
      bmi: currentIntern?.BMI || 0,
      hand: currentIntern?.hand || '',
      leftEye: currentIntern?.leftEye || undefined,
      rightEye: currentIntern?.rightEye || undefined,
      address: currentIntern?.address || '',
      city: currentIntern?.city || '',
      married: currentIntern?.married || '',
      driverLicense: currentIntern?.driverLicense || '',
      avatar: currentIntern?.avatar || '',
      interest: currentIntern?.interest || '',
      strong: currentIntern?.strong || '',
      weak: currentIntern?.weak || '',
      foreignLanguage: currentIntern?.foreignLanguage || '',
      aim: currentIntern?.aim || '',
      money: currentIntern?.money || '',
      plan: currentIntern?.plan || '',
      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIntern]
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

  const uploadImageToCloud = useCallback(async (img: any) => {
    const temp = img;
    const path = 'dashboard';
    const formData = new FormData();
    formData.append('path', path);
    formData.append('file', temp);
    const uploaded_images = await uploadImages(formData);
    return uploaded_images[0].url;
  }, []);

  const uploadImages = async (formData: any) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/cloudinary`,
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );
    return data;
  };

  const createNewIntern = useCallback(async (intern: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/user/create`, {
      ...intern,
      school: [...intern.schoolList],
      company: [...intern.companyList],
      family: [...intern.familyList],
      avatar: intern.avatarURL,
    });
    console.log(data);
    return data;
  }, []);

  const editIntern = useCallback(
    async (intern: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/edit`, {
        ...intern,
        _id: currentIntern?._id,
        school: [...intern.schoolList],
        company: [...intern.companyList],
        family: [...intern.familyList],
        avatar: intern.avatarURL,
      });
      console.log(data);
      return data;
    },
    [currentIntern]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // router.push(paths.dashboard.user.list);
        if (currentIntern) {
          console.log('TESTTTTTT', data);
          if (data.avatar === currentIntern.avatar) {
            data.avatarURL = currentIntern.avatar;
            await editIntern(data);
            enqueueSnackbar(currentIntern ? 'Update success!' : 'Create success!');
          } else {
            const images = await uploadImageToCloud(data.avatar);
            data.avatarURL = images;
            await editIntern(data);
            enqueueSnackbar(currentIntern ? 'Update success!' : 'Create success!');
          }
        } else {
          const images = await uploadImageToCloud(data.avatar);
          data.avatarURL = images;
          console.info('DATA', data);
          await createNewIntern(data);
          enqueueSnackbar(currentIntern ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [uploadImageToCloud, createNewIntern, editIntern, enqueueSnackbar, currentIntern]
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
                {!currentIntern ? t('create_trade_union') : t('edit_trade_union')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
