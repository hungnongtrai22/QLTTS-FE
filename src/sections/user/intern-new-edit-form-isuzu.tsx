import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import axios from 'axios';
import { useLocales } from 'src/locales';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { convertToKatakana } from 'src/utils/vietnameseToKatakana';
import { generateStrongJP, strongJPs, strongVNs } from 'src/utils/strong';
import { generateWeakJP, weakJPs, weakVNs } from 'src/utils/weak';

import InternPDF from '../invoice/intern-pdf';
import InternPDFIsuzuNew from '../order/InternPDFIsuzu';
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

export default function InternNewEditFormIsuzu({ currentIntern }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t, currentLang } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [age, setAge] = useState(currentIntern?.age || 0);
  const [height, setHeight] = useState(currentIntern?.height || 0);
  const [weight, setWeight] = useState(currentIntern?.weight || 0);
  const [BMI, setBMI] = useState(currentIntern?.BMI || 0);
  const [nameJapan, setNameJapan] = useState(currentIntern?.namejp || 0);

  // const values = watch();

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

  function calculateAge(date: any): number {
    const birthDate = new Date(date);
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
    name: Yup.string().required('Họ và tên không được để trống'),
    namejp: Yup.string().required('Phiên âm tên không được để trống'),
    gender: Yup.string().required('Giới tính không được để trống'),
    blood: Yup.string().required('Nhóm máu không được để trống'),
    birthday: Yup.date()
      .required('Ngày sinh không được để trống')
      .typeError('Ngày sinh không hợp lệ'),
    // age: Yup.number().required('Age is required').min(16),
    height: Yup.number()
      .required('Chiều cao không được để trống')
      .min(140, 'Chiều cao phải lớn hơn 140cm')
      .max(190, 'Chiều cao phải thấp hơn 190cm'),
    weight: Yup.number().required('Cân nặng không được để trống').min(1),
    // BMI: Yup.number().required('BMI is required').min(1),
    avatar: Yup.mixed().required('Ảnh không được để trống'),
    hand: Yup.string().required('Tay thuận không được để trống'),
    leftEye: Yup.string().required('Mắt trái không được để trống'),
    rightEye: Yup.string().required('Mắt phải không được để trống'),
    address: Yup.string().required('Địa chỉ không được để trống'),
    city: Yup.string().required('Thành phố không được để trống'),
    married: Yup.string().required('Tình trạng hôn nhân không được để trống'),
    driverLicense: Yup.string().required('Bằng lái xe không được để trống'),
    schoolList: Yup.array()
      .of(
        Yup.object().shape({
          timeFrom: Yup.date().nullable().required('Ngày bắt đầu không được để trống'),
          timeTo: Yup.date()
            .nullable()
            .required('Ngày kết thúc không được để trống')
            .min(Yup.ref('timeFrom'), 'Ngày kết thúc phải sau ngày bắt đầu'),
          name: Yup.string()
            .required('Tên trường học không được để trống')
            .max(255, 'Tên trường học quá dài'),
          content: Yup.string().required('Nội dung không được để trống'),
          current: Yup.string().required('Tình trạng không được để trống'),
        })
      )
      .min(1, 'Phải có ít nhất 1 học vấn'),

    // companyList: Yup.array().of(
    //   Yup.object().shape({
    //     timeFrom: Yup.date().nullable().required('Ngày bắt đầu không được để trống'),
    //     timeTo: Yup.date()
    //       .nullable()
    //       .required('Ngày kết thúc không được để trống')
    //       .min(Yup.ref('timeFrom'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    //     name: Yup.string()
    //       .required('Tên công ty không được để trống')
    //       .max(255, 'Tên công ty quá dài')
    //       .min(1, 'Phải có ít nhất một lịch sử công việc'),
    //     content: Yup.string().required('Nội dung công việc không được để trống'),
    //   })
    // ),
    familyList: Yup.array().of(
      Yup.object().shape({
        relationship: Yup.string().required('Mối quan hệ không được để trống'),
        name: Yup.string()
          .required('Tên không được để trống')
          .max(255, 'Tên quá dài')
          .min(1, 'Phải có ít nhất 1 thành viên trong gia đình'),
        // year: Yup.date().required('Năm sinh không được để trống'),
        // location: Yup.string().required('Địa chỉ không được để trống'),
        // occupation: Yup.string().required('Nghề nghiệp không được để trống'),
      })
    ),
    interest: Yup.string().required('Sở thích không được để trống'),
    foreignLanguage: Yup.string().required('Ngoại ngữ không được để trống'),
    strong: Yup.array().min(1, 'Điểm mạnh không được để trống'),
    weak: Yup.array().min(1, 'Điểm yếu không được để trống'),
    aim: Yup.string().required('Mục tiêu không được để trống'),
    plan: Yup.string().required('Kế hoạch không được để trống'),
    money: Yup.string().required('Số tiền mong muốn không được để trống'),
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
        currentIntern?.family?.map((item: any) => ({
          ...item,
          year: item.year ? new Date(item.year) : null,
        })) || initFamily,
      schoolList:
        currentIntern?.school?.map((item: any) => ({
          ...item,
          timeFrom: new Date(item.timeFrom),
          timeTo: new Date(item.timeTo),
        })) || initSchool,
      companyList:
        currentIntern?.company?.map((item: any) => ({
          ...item,
          timeFrom: item.timeFrom ? new Date(item.timeFrom) : null,
          timeTo: item.timeTo ? new Date(item.timeTo) : null,
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
      birthPlace: currentIntern?.birthPlace,
phoneNumber: currentIntern?.phoneNumber,
email: currentIntern?.email,
children: currentIntern?.children,

respiratoryDisease: currentIntern?.respiratoryDisease,
obstetrics: currentIntern?.obstetrics,
highBloodPressure: currentIntern?.highBloodPressure,
ophthalmological: currentIntern?.ophthalmological,
urinaryDiseases: currentIntern?.urinaryDiseases,
anemia: currentIntern?.anemia,
otorhinolaryngological: currentIntern?.otorhinolaryngological,
cranialNerves: currentIntern?.cranialNerves,
headache: currentIntern?.headache,
pharyngealSystemDisease: currentIntern?.pharyngealSystemDisease,
hernia: currentIntern?.hernia,
anyAllergies: currentIntern?.anyAllergies,
cardiovascularDisease: currentIntern?.cardiovascularDisease,
rheumatism: currentIntern?.rheumatism,
irregalerMenstruation: currentIntern?.irregalerMenstruation,
heartDisease: currentIntern?.heartDisease,
fainting: currentIntern?.fainting,
tbTest: currentIntern?.tbTest,
dental: currentIntern?.dental,
diabetes: currentIntern?.diabetes,
history: currentIntern?.history,
digestive: currentIntern?.digestive,
asthma: currentIntern?.asthma,
otherMajor: currentIntern?.otherMajor,
psychosomatic: currentIntern?.psychosomatic,
vnsomnia: currentIntern?.vnsomnia,
surgery: currentIntern?.surgery,
hematology: currentIntern?.hematology,
lowerBack: currentIntern?.lowerBack,
hospitalization: currentIntern?.hospitalization,

others: currentIntern?.others,
moneyMonthFrom: currentIntern?.moneyMonthFrom,
moneyMonthTo: currentIntern?.moneyMonthTo,
money3YearsFrom: currentIntern?.money3YearsFrom,
money3YearsTo: currentIntern?.money3YearsTo,
religion: currentIntern?.religion,
planMarried: currentIntern?.planMarried,
crime: currentIntern?.crime,
crimeDetail: currentIntern?.crimeDetail,

fillInfo: currentIntern?.fillInfo,
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

  const generateNameJP = useCallback(
    (name: string) => {
      const katakana = convertToKatakana(name);
      if (katakana !== nameJapan) {
        setNameJapan(katakana);
        setValue('namejp', katakana);
      }
    },
    [nameJapan, setValue]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (values?.name === currentIntern?.name) {
        return;
      }
      if (values.name) {
        generateNameJP(values.name);
      }
    }, 500); // đợi 500ms sau khi người dùng dừng gõ

    return () => {
      clearTimeout(handler); // huỷ timeout nếu người dùng tiếp tục gõ
    };
  }, [values.name, generateNameJP, currentIntern?.name]);

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
      company: intern.companyList.map((item: any) =>
        item.name === undefined &&
        item.content === undefined &&
        item.timeFrom === undefined &&
        item.timeTo === undefined
          ? {
              timeFrom: null,
              timeTo: null,
              name: '',
              content: '',
            }
          : item
      ),
      family: [...intern.familyList],
      avatar: intern.avatarURL,
    });
    return data;
  }, []);

  const editIntern = useCallback(
    async (intern: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/edit`, {
        ...intern,
        _id: currentIntern?._id,
        school: [...intern.schoolList],
        company: intern.companyList.map((item: any) =>
          item.name === undefined &&
          item.content === undefined &&
          item.timeFrom === undefined &&
          item.timeTo === undefined
            ? {
                timeFrom: null,
                timeTo: null,
                name: '',
                content: '',
              }
            : item
        ),
        family: [...intern.familyList],
        avatar: intern.avatarURL,
      });
      return data;
    },
    [currentIntern]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        data.strong = generateStrongJP(data.strong);
        data.weak = generateWeakJP(data.weak);
        console.info('DATA', data);

        // reset();
        // router.push(paths.dashboard.user.list);
        if (currentIntern) {
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
          await createNewIntern(data);
          enqueueSnackbar(currentIntern ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [uploadImageToCloud, enqueueSnackbar, currentIntern, createNewIntern, editIntern]
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

  const handleRemoveLastSchool = () => {
    const currentList = methods.getValues('schoolList');
    const updatedList = currentList.slice(0, -1);
    setSchools(updatedList);
    setValue('schoolList', updatedList);
  };

  const handleRemoveLastCompany = () => {
    const currentList = methods.getValues('companyList');
    const updatedList = currentList.slice(0, -1);
    setCompany(updatedList); // cập nhật lại state để render
    setValue('companyList', updatedList); // cập nhật vào form
  };

  const handleRemoveLastFamily = () => {
    const currentList = methods.getValues('familyList');
    const updatedList = currentList.slice(0, -1);
    setFamily(updatedList);
    setValue('familyList', updatedList);
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
            {currentIntern && !currentIntern?.birthPlace &&(
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

              {currentIntern && currentIntern?.birthPlace && (
              <PDFDownloadLink
                document={<InternPDFIsuzuNew intern={currentIntern} />}
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
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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
              <RHFTextField name="namejp" label={t('name_jp')} />
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
                {['A型', 'B型', 'AB型', 'O型', 'O+型', 'A+型', 'B+型', '未検査'].map((option) => (
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
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        setAge(calculateAge(dayjs(newValue)));
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
                  '乱視',
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
                  '乱視',
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

              <RHFTextField name="birthPlace" label={t('birthPlace')} />
              <RHFTextField name="phoneNumber" label={t('phoneNumber')} />
              <RHFTextField name="email" label={t('email')} />
              <RHFTextField name="children" label={t('children')} />
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
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                      >
                        <DatePicker
                          label={t('start_date')}
                          value={field.value && field.value !== null ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            const dateValue = newValue ? newValue.toDate() : null;

                            field.onChange(dateValue);

                            if (index === 0 && dateValue) {
                              const autoSchools = autoGenerateTime(dateValue);
                              setValue('schoolList', autoSchools);
                              setSchools(autoSchools);
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
                    {['卒業', '中退', '在学中', '卒業見込み', '高校一年時、留年'].map((option) => (
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
            {schools.length >= 4 && (
              <Stack alignItems="flex-end" spacing={1.5}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="mdi:trash" />}
                  onClick={handleRemoveLastSchool}
                  sx={{ flexShrink: 0 }}
                >
                  {t('remove_school')}
                </Button>
              </Stack>
            )}
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
                sm: 'repeat(5, 1fr)',
              }}
            >
              {company.map((comp: any, index: any) => (
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
                          views={['month', 'year']}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            field.onChange(newValue || null);
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
                  <RHFTextField name={`companyList.${index}.name`} label={t('company_name')} />
                  <RHFTextField
                    name={`companyList.${index}.content`}
                    label={t('company_content')}
                  />
                  <RHFTextField
                    name={`companyList.${index}.address`}
                    label={t('company_address')}
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
            {company.length >= 2 && (
              <Stack alignItems="flex-end" spacing={1.5}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="mdi:trash" />}
                  onClick={handleRemoveLastCompany}
                  sx={{ flexShrink: 0 }}
                >
                  {t('remove_company')}
                </Button>
              </Stack>
            )}
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
                    {[
                      '父',
                      '母',
                      '兄',
                      '姉',
                      '弟',
                      '妹',
                      '妻',
                      '夫',
                      '息子',
                      '娘',
                      '甥',
                      '姪',
                      '祖母',
                      '祖父',
                    ].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFTextField name={`familyList.${index}.name`} label={t('full_name')} />

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
            {family.length >= 2 && (
              <Stack alignItems="flex-end" spacing={1.5}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="mdi:trash" />}
                  onClick={handleRemoveLastFamily}
                  sx={{ flexShrink: 0 }}
                >
                  {t('remove_family')}
                </Button>
              </Stack>
            )}
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
              {/* <RHFTextField name="strong" label={t('strong')} /> */}
              <RHFAutocomplete
                multiple
                limitTags={2}
                name="strong"
                label={t('strong') || ''}
                disablePortal
                options={
                  currentLang.value === 'vi'
                    ? strongVNs.map((item) => item.value)
                    : strongJPs.map((item) => item.value)
                }
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              {/* <RHFTextField name="weak" label={t('weak')} /> */}
              <RHFAutocomplete
                multiple
                limitTags={2}
                name="weak"
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
              <RHFAutocomplete
                name="foreignLanguage"
                label={t('foreign_language') || ''}
                disablePortal
                freeSolo
                options={['日本語：簡単な自己紹介ができます', 'なし']}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name="aim" label={t('pr')} />
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
            {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentIntern ? t('create_intern') : t('edit_intern')}
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          <Card sx={{ pt: 5, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              {t('medical')}
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <RHFSwitch
                  name="respiratoryDisease"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('respiratoryDisease')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid xs={4}>
                <RHFSwitch
                  name="obstetrics"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('obstetrics')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid xs={4}>
                <RHFSwitch
                  name="highBloodPressure"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('highBloodPressure')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid xs={4}>
                <RHFSwitch
                  name="ophthalmological"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('ophthalmological')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid xs={4}>
                <RHFSwitch
                  name="urinaryDiseases"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('urinaryDiseases')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>

              <Grid xs={4}>
                <RHFSwitch
                  name="anemia"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('anemia')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="otorhinolaryngological"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('otorhinolaryngological')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="cranialNerves"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('cranialNerves')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="headache"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('headache')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="pharyngealSystemDisease"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('pharyngealSystemDisease')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="hernia"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('hernia')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="anyAllergies"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('anyAllergies')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="cardiovascularDisease"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('cardiovascularDisease')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="rheumatism"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('rheumatism')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="irregalerMenstruation"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('irregalerMenstruation')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="heartDisease"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('heartDisease')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="fainting"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('fainting')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="tbTest"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('tbTest')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="dental"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('dental')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="diabetes"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('diabetes')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="history"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('history')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="digestive"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('digestive')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="asthma"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('asthma')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="otherMajor"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('otherMajor')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="psychosomatic"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('psychosomatic')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="vnsomnia"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('vnsomnia')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="surgery"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('surgery')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="hematology"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('hematology')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="lowerBack"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('lowerBack')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={4}>
                <RHFSwitch
                  name="hospitalization"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('hospitalization')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="others" label={t('others')} />
              </Grid>
            </Grid>

            {currentIntern && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="moneyMonthFrom" label={t('moneyMonthFrom')} />
           
              <RHFTextField name="moneyMonthTo" label={t('moneyMonthTo')} />
             <RHFTextField name="money3YearsFrom" label={t('money3YearsFrom')} />
             <RHFTextField name="money3YearsTo" label={t('money3YearsTo')} />
             <RHFTextField name="religion" label={t('religion')} />
             <RHFTextField name="planMarried" label={t('planMarried')} />
 <RHFSwitch
                  name="crime"
                  labelPlacement="start"
                  label={
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('crime')}
                    </Typography>
                  }
                  sx={{ width: 1, justifyContent: 'space-between' }}
                />
                         <RHFTextField name="crimeDetail" label={t('crimeDetail')} />
<RHFTextField name="fillInfo" label={t('fillInfo')} />
   <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentIntern ? t('create_intern') : t('edit_intern')}
              </LoadingButton>
            </Stack>
            
        
            </Box>

            {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentIntern ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
