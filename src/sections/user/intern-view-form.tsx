import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// utils
// types
import { IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomFile } from 'src/components/upload';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from '@mui/x-date-pickers/locales';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLocales } from 'src/locales';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {  strongJPs, strongVNs } from 'src/utils/strong';
import {  weakJPs, weakVNs } from 'src/utils/weak';

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
  strong: string[];
  weak: string[];
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

dayjs.locale('vi');

export default function InternViewForm({ currentIntern }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t, currentLang } = useLocales();


  // const values = watch();

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Họ và tên không được để trống'),
  
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
      strong: currentIntern?.strong || [],
      weak: currentIntern?.weak || [],
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

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        console.log('das');
      } catch (error) {
        console.error(error);
      }
    },
    []
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
                sx={{
                  pointerEvents: 'none',
                  opacity: 1,
                }}
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

            {/* {currentIntern && (
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
            )} */}
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
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('blind_color')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />

            <RHFSwitch
              name="smoke"
              labelPlacement="start"
              defaultChecked={false}
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('smoke')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />

            <RHFSwitch
              name="alcohol"
              labelPlacement="start"
              defaultChecked={false}
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('alcohol')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />

            <RHFSwitch
              name="tattoo"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('tattoo')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />

            <RHFSwitch
              name="familyInJapan"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('family_in_japan')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />

            <RHFSwitch
              name="moveForeign"
              defaultChecked={false}
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t('move_foreign')}
                </Typography>
              }
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                pointerEvents: 'none',
                opacity: 1,
              }}
            />
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
              <RHFTextField
                name="name"
                label={t('full_name')}
                sx={{ pointerEvents: 'none', opacity: 1 }}
              />
              {/* <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      // generateNameJP(event.target.value);
                    }}
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    InputLabelProps={{ shrink: true }}
                    label={t('full_name')}
                    // {...other}
                  />
                )}
              /> */}
              <RHFTextField name="namejp" label={t('name_jp')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              {/* <Controller
                name="namejp"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={!!error}
                    helperText={error ? error?.message : ''}
                    InputLabelProps={{ shrink: true }}
                    label={t('name_jp')}
                    // {...other}
                  />
                )}
              /> */}
              <RHFSelect
                fullWidth
                name="gender"
                label={t('gender')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('birthday')}
                      sx={{ pointerEvents: 'none', opacity: 1 }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
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

              <RHFTextField
                name="age"
                label={t('age')}
                placeholder="0"
                value={currentIntern?.age}
                type="number"
                InputLabelProps={{ shrink: true }}
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
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
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                    type="number"
                    value={field.value || 0}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
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
                    value={currentIntern?.BMI}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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

              <RHFTextField name="address" label={t('address')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              {/* <RHFTextField name="city" label="City" /> */}
              <Controller
                name="city"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
                sx={{ pointerEvents: 'none', opacity: 1 }}
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
              {currentIntern?.school.map((item: any, index: any) => (
                <>
                  <Controller
                    name={`schoolList.${index}.timeFrom`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('start_date')}
                          sx={{ pointerEvents: 'none', opacity: 1 }}
                          value={field.value ? dayjs(field.value) : null}
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
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    name={`schoolList.${index}.timeTo`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('end_date')}
                          views={['month', 'year']}
                          sx={{ pointerEvents: 'none', opacity: 1 }}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
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
                  <RHFTextField name={`schoolList.${index}.name`} label={t('school_name')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
                  <RHFSelect
                    fullWidth
                    name={`schoolList.${index}.content`}
                    label={t('school_content')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={currentIntern.school[index].content}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                  >
                    {['小学校', '中学校', '高校', '専門学校', '短期大学', '大学'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFSelect
                    fullWidth
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                    name={`schoolList.${index}.current`}
                    label={t('school_current')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={currentIntern.school[index].current}
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
              {currentIntern?.company.map((comp: any, index: any) => (
                <>
                  <Controller
                    name={`companyList.${index}.timeFrom`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('start_date')}
                          value={field.value ? dayjs(field.value) : null}
                          sx={{ pointerEvents: 'none', opacity: 1 }}
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
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    name={`companyList.${index}.timeTo`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('end_date')}
                          sx={{ pointerEvents: 'none', opacity: 1 }}
                          views={['month', 'year']}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
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
                  <RHFTextField name={`companyList.${index}.name`} label={t('company_name')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
                  <RHFTextField
                    name={`companyList.${index}.content`}
                    label={t('company_content')}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                  />
                </>
              ))}
            </Box>
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
              {currentIntern?.family.map((fam: any, index: any) => (
                <>
                  <RHFSelect
                    fullWidth
                    name={`familyList.${index}.relationship`}
                    label={t('relationship')}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    defaultValue={currentIntern?.family[index].relationship}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                  >
                    {['父', '母', '兄', '姉', '弟', '妹', '妻', '夫', '息子', '娘'].map(
                      (option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </RHFSelect>

                  <RHFTextField name={`familyList.${index}.name`} label={t('full_name')} sx={{ pointerEvents: 'none', opacity: 1 }}/>

                  <Controller
                    name={`familyList.${index}.year`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('year')}
                          sx={{ pointerEvents: 'none', opacity: 1 }}
                          value={field.value ? dayjs(field.value) : null}
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
                      </LocalizationProvider>
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
                        sx={{ pointerEvents: 'none', opacity: 1 }}
                        value={field.value || ''} // CHỈ dùng field.value
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                        error={!!error}
                        helperText={error ? error?.message : ''}
                        label={t('location')}
                      />
                    )}
                  />

                  <RHFTextField name={`familyList.${index}.occupation`} label={t('occupation')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
                </>
              ))}
            </Box>
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
              <RHFTextField name="interest" label={t('interest')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              {/* <RHFTextField name="strong" label={t('strong')} /> */}
              <RHFAutocomplete
                multiple
                // limitTags={2}
                sx={{ pointerEvents: 'none', opacity: 1 }}
                name="strong"
                label={t('strong') || ''}
                disablePortal
                options={
                  currentLang.value === 'vi'
                    ? strongVNs.map((item) => item.value)
                    : strongJPs.map((item) => item.value)
                }
                // sx={{ width: 300 }}
                // renderOption={(props, option) => {
                //   const { index, value } = strongVNs.filter(
                //     (item) => item.value === option.value
                //   )[0];

                //   if (!value) {
                //     return null;
                //   }

                //   return (
                //     <li {...props} key={index}>
                //       {value}
                //     </li>
                //   );
                // }}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              {/* <RHFTextField name="weak" label={t('weak')} /> */}
              <RHFAutocomplete
                multiple
                // limitTags={2}
                name="weak"
                sx={{ pointerEvents: 'none', opacity: 1 }}
                label={t('weak') || ''}
                disablePortal
                options={
                  currentLang.value === 'vi'
                    ? weakVNs.map((item) => item.value)
                    : weakJPs.map((item) => item.value)
                }
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFSelect
                fullWidth
                name="foreignLanguage"
                label={t('foreign_language')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ pointerEvents: 'none', opacity: 1 }}
              >
                {['日本語：簡単な自己紹介ができます', 'なし'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="aim" label={t('aim')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              <RHFTextField name="money" label={t('money')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              <RHFTextField name="plan" label={t('plan')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
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
            {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentIntern ? t('create_intern') : t('edit_intern')}
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
