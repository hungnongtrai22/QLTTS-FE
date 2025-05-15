import * as Yup from 'yup';
import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { useRouter } from 'src/routes/hook';
// types
import { IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
} from 'src/components/hook-form';
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { useLocales } from 'src/locales';
import { PDFDownloadLink } from '@react-pdf/renderer';

import InternPDF from '../invoice/intern-pdf';
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
  currentUser?: IUserItem;
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

export default function InternNewEditForm({ currentIntern }: Props) {
  // const router = useRouter();
  console.log('TEST', currentIntern);
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [age, setAge] = useState(currentIntern?.age || 0);
  const [height, setHeight] = useState(currentIntern?.height || 0);
  const [weight, setWeight] = useState(currentIntern?.weight || 0);
  const [BMI, setBMI] = useState(currentIntern?.BMI || 0);
  // const [city, setCity] = useState('');
  const [schools, setSchools] = useState<
    {
      timeFrom: Date | null;
      timeTo: Date | null;
      name: string;
      content: string;
      current: string;
    }[]
  >(
    currentIntern?.school?.map((item: any) => ({
      ...item,
      timeFrom: new Date(item.timeFrom),
      timeTo: new Date(item.timeTo),
    })) || initSchool
  );
  const [company, setCompany] = useState(
    currentIntern?.company?.map((item: any) => ({
      ...item,
      timeFrom: new Date(item.timeFrom),
      timeTo: new Date(item.timeTo),
    })) || initCompany
  );
  console.log('Company', company);
  console.log('Company', currentIntern?.company);

  const [family, setFamily] = useState(
    currentIntern?.family?.map((item: any) => ({ ...item, year: new Date(item.year) })) ||
      initFamily
  );

  function calculateBMI(we: any, he: any) {
    if (he > 0) {
      const bmi = we / (he / 100) ** 2;
      const roundedBMI = Number(bmi.toFixed(2));
      setBMI(roundedBMI);
      setValue('BMI', roundedBMI); // <-- cập nhật giá trị vào form
    } else {
      setBMI(0);
      setValue('BMI', 0); // <-- cập nhật giá trị vào form
    }
  }

  function calculateAge(birthDate: any): number {
    // const birthDate = new Date(birthday);
    const today = new Date();
    let result = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      result -= 1;
    }
    setValue('age', result); // <-- cập nhật giá trị vào form
    return result;
  }

  function autoGenerateTime(startDate: Date) {
    const levels = [
      { content: '小学校', duration: 5 },
      { content: '中学校', duration: 4 },
      { content: '高校', duration: 3 },
    ];

    const schoolList = levels.map((level) => {
      const timeFrom = new Date(startDate);
      timeFrom.setMonth(8); // 8 = September
      timeFrom.setDate(1);

      const timeTo = new Date(timeFrom);
      timeTo.setFullYear(timeTo.getFullYear() + level.duration);
      timeTo.setMonth(5); // 5 = June
      timeTo.setDate(30);

      // Cập nhật startDate cho cấp tiếp theo
      startDate = new Date(timeTo);
      startDate.setMonth(8); // luôn bắt đầu từ tháng 9
      startDate.setDate(1);

      return {
        timeFrom,
        timeTo,
        name: '',
        content: level.content,
        current: '卒業',
      };
    });

    return schoolList;
  }

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
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

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
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/cloudinary`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
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

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleAddSchool = () => {
    const newSchool = {
      timeFrom: null,
      timeTo: null,
      name: '',
      content: '',
      current: '',
    };
    setSchools((pre) => [...pre, newSchool]);
  };

  const handleAddCompany = () => {
    const newCompany = {
      timeFrom: null,
      timeTo: null,
      name: '',
      content: '',
    };
    setCompany((pre: any) => [...pre, newCompany]);
  };

  const handleAddFamily = () => {
    const locationInit = family[0].location || '';
    const newFamily = {
      relationship: '',
      name: '',
      year: null,
      location: locationInit,
      occupation: '',
    };
    setFamily((pre: any) => [...pre, newFamily]);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentIntern && (
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('allow_image_1')}
                    <br /> {t('allow_image_2')}
                  </Typography>
                }
              />
            </Box>

            {currentIntern && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
            {currentIntern && (
              <PDFDownloadLink
                document={<InternPDF invoice={currentIntern} />}
                fileName={currentIntern.name}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <Tooltip title="Download">
                    <IconButton>
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <Iconify icon="eva:cloud-download-fill" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </PDFDownloadLink>
            )}

            <RHFSwitch
              name="blindColor"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('blind_color')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="smoke"
              labelPlacement="start"
              defaultChecked={false}
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('smoke')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="alcohol"
              labelPlacement="start"
              defaultChecked={false}
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('alcohol')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="tattoo"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('tattoo')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="familyInJapan"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('family_in_japan')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="moveForeign"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('move_foreign')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentIntern && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label={t('full_name')} />
              <RHFTextField name="namejp" label={t('name_jp')} />
              <RHFSelect
                fullWidth
                name="gender"
                label={t('gender')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['男', '女'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="blood"
                label={t('blood')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['A型', 'B型', 'AB型', 'O型', '未検査'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Controller
                name="birthday"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={t('birthday')}
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      console.log(newValue);
                      setAge(calculateAge(newValue));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <RHFTextField
                name="age"
                label={t('age')}
                placeholder="0"
                value={Number(age)}
                type="number"
                InputLabelProps={{ shrink: true }}
                disabled
              />

              {/* <RHFTextField
                name="height"
                label="Height"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
                onChange={(event: any) => {
                  setHeight(event.target.value);
                  calculateBMI(weight, event.target.value);
                }}
                // value={height}
              /> */}

              <Controller
                name="height"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value || 0}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                      setHeight(Number(event.target.value));
                      calculateBMI(weight, event.target.value);
                    }}
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    InputLabelProps={{ shrink: true }}
                    label={t('height')}
                    // {...other}
                  />
                )}
              />

              {/* <RHFTextField
                name="weight"
                label="Weight"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
                onChange={(event: any) => {
                  setWeight(event.target.value);
                  calculateBMI(event.target.value, height);
                }}
                value={weight}
              /> */}

              <Controller
                name="weight"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value || 0}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                      setWeight(Number(event.target.value));
                      calculateBMI(event.target.value, height);
                    }}
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    InputLabelProps={{ shrink: true }}
                    label={t('weight')}
                    // {...other}
                  />
                )}
              />

              {/* <RHFTextField
                name="BMI"
                label="BMI"
                placeholder="0"
                value={Number(BMI)}
                type="number"
                InputLabelProps={{ shrink: true }}
                disabled
              /> */}

              <Controller
                name="BMI"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={BMI}
                    disabled
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    InputLabelProps={{ shrink: true }}
                    label="BMI"
                    // {...other}
                  />
                )}
              />

              <RHFSelect
                fullWidth
                name="hand"
                label={t('hand')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['左', '右', '両手'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="leftEye"
                label={t('left_eye')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  '0',
                  '0.1',
                  '0.2',
                  '0.3',
                  '0.4',
                  '0.5',
                  '0.6',
                  '0.7',
                  '0.8',
                  '0.9',
                  '1.0',
                  '1.1',
                  '1.2',
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="rightEye"
                label={t('right_eye')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  '0',
                  '0.1',
                  '0.2',
                  '0.3',
                  '0.4',
                  '0.5',
                  '0.6',
                  '0.7',
                  '0.8',
                  '0.9',
                  '1.0',
                  '1.1',
                  '1.2',
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="address" label={t('address')} />
              {/* <RHFTextField name="city" label="City" /> */}
              <Controller
                name="city"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    value={field.value || ''}
                    onChange={(event) => {
                      const cityValue = event.target.value;
                      field.onChange(cityValue);

                      // Update toàn bộ familyList.location trong form react-hook-form
                      const updatedFamily = methods.getValues('familyList').map((fam) => ({
                        ...fam,
                        location: cityValue,
                      }));

                      methods.setValue('familyList', updatedFamily, { shouldValidate: false });
                    }}
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    label={t('city')}
                  />
                )}
              />

              <RHFSelect
                fullWidth
                name="married"
                label={t('married')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['未婚', '既婚', '離婚', '死別'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="driverLicense"
                label={t('driver_license')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['自動車', '二輪車', 'なし'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentIntern ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              {t('school')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(5, 1fr)',
              }}
            >
              {schools.map((school, index) => (
                <>
                  <Controller
                    name={`schoolList.${index}.timeFrom`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('start_date')}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          console.log(newValue);
                          if (index === 0) {
                            if (newValue) {
                              const autoSchools = autoGenerateTime(newValue);
                              console.log(autoSchools);
                              setValue('schoolList', autoSchools);
                              setSchools(autoSchools);
                            }
                          }
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
                    )}
                  />

                  <Controller
                    name={`schoolList.${index}.timeTo`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('end_date')}
                        views={['month', 'year']}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          console.log(newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                  <RHFTextField name={`schoolList.${index}.name`} label={t('school_name')} />
                  <RHFSelect
                    fullWidth
                    name={`schoolList.${index}.content`}
                    label={t('school_content')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={schools[index].content}
                  >
                    {['小学校', '中学校', '高校', '専門学校', '短期大学', '大学'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFSelect
                    fullWidth
                    name={`schoolList.${index}.current`}
                    label={t('school_current')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={schools[index].current}
                  >
                    {['卒業', '中退', '在学中'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </>
              ))}
            </Box>
            <Stack alignItems="flex-end" spacing={1.5}>
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddSchool}
                sx={{ flexShrink: 0 }}
              >
                {t('add_school')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              {t('company')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              {company.map((comp: any, index: any) => (
                <>
                  <Controller
                    name={`companyList.${index}.timeFrom`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('start_date')}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
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
                    )}
                  />

                  <Controller
                    name={`companyList.${index}.timeTo`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('end_date')}
                        views={['month', 'year']}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          console.log(newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                  <RHFTextField name={`companyList.${index}.name`} label={t('company_name')} />
                  <RHFTextField
                    name={`companyList.${index}.content`}
                    label={t('company_content')}
                  />
                </>
              ))}
            </Box>
            <Stack alignItems="flex-end" spacing={1.5}>
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddCompany}
                sx={{ flexShrink: 0 }}
              >
                {t('company_add')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              {t('family')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(5, 1fr)',
              }}
            >
              {family.map((fam: any, index: any) => (
                <>
                  <RHFSelect
                    fullWidth
                    name={`familyList.${index}.relationship`}
                    label={t('relationship')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={family[index].relationship}
                  >
                    {['父', '母', '兄', '姉', '弟', '妹', '妻', '夫', '息子', '娘'].map(
                      (option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </RHFSelect>

                  <RHFTextField name={`familyList.${index}.name`} label={t('full_name')} />

                  <Controller
                    name={`familyList.${index}.year`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('year')}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        views={['year']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />

                  {/* <RHFTextField
                    name={`familyList.${index}.location`}
                    label="Family Location"
                    value={fam.location}
                  /> */}

                  <Controller
                    name={`familyList.${index}.location`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="text"
                        value={field.value || ''} // CHỈ dùng field.value
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setFamily((pre: any) => {
                            const newFamily = [...pre];
                            newFamily[index].location = event.target.value;
                            return newFamily;
                          });
                        }}
                        error={!!error}
                        helperText={error ? error?.message : ''}
                        label={t('location')}
                      />
                    )}
                  />

                  <RHFTextField name={`familyList.${index}.occupation`} label={t('occupation')} />
                </>
              ))}
            </Box>
            <Stack alignItems="flex-end" spacing={1.5}>
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddFamily}
                sx={{ flexShrink: 0 }}
              >
                {t('family_add')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
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
              <RHFTextField name="interest" label={t('interest')} />
              <RHFTextField name="strong" label={t('strong')} />
              <RHFTextField name="weak" label={t('weak')} />
              <RHFSelect
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
              </RHFSelect>
              <RHFTextField name="aim" label={t('aim')} />
              <RHFTextField name="money" label={t('money')} />
              <RHFTextField name="plan" label={t('plan')} />
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
                {!currentIntern ? t('create_intern') : t('edit_intern')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
