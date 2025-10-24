/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */

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
import Typography from '@mui/material/Typography';
// utils
// types
import { IInternItem, IStudyItem, IUserItem } from 'src/types/user';
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
  RHFEditor,
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
import { useSnackbar } from 'src/components/snackbar';

import LoadingButton from '@mui/lab/LoadingButton';
import { characteristicList } from 'src/utils/characteristic';
import { teacherList } from 'src/utils/teacher';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IStudyItem, 'avatarUrl'> {
  _id: string;
  internId: any;
  health: number;
  cooperation: number;
  attend: number;
  discipline: number;
  attitude: number;
  acquiringKnowledge: number;
  write: number;
  read: number;
  listen: number;
  speak: number;
  total: number;
  average: number;
  level: string;
  time: number;
  kanji: number;
  grammarAndReading: number;
  listeningComprehension: number;
  totalReadingAndListening: number;
  learningProcess: string;
  characteristic: string;
  teacher: string;

  comment: string;
  createdAt: any;
  monthSelect: any;
}

type Props = {
  internId?: string;
};

dayjs.locale('vi');

export default function InternPointForm({ internId }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  // const values = watch();

  // const [city, setCity] = useState('');
  // const [currentStudy, setCurrentStudy] = useState<IStudyItem | null>(null);
  // console.log(currentStudy);
  const [monthSelect, setMonthSelect] = useState<Date | null>(null);

  const NewUserSchema = Yup.object().shape({
    monthSelect: Yup.date().required('Tháng không được để trống'),
    health: Yup.number()
      .min(0, 'Tình trạng sức khỏe phải lớn hơn hoặc bằng 0')
      .max(100, 'Tình trạng sức khỏe phải bé hơn hoặc bằng 100')
      .required('Sức khoẻ không được để trống'),
    cooperation: Yup.number()
      .min(0, 'Tính hợp tác phải lớn hơn hoặc bằng 0')
      .max(100, 'Tính hợp tác phải bé hơn hoặc bằng 100')
      .required('Tính hợp tác không được để trống'),
    attend: Yup.number()
      .min(0, 'Tình hình chuyên cần phải lớn hơn hoặc bằng 0')
      .max(100, 'Tình hình chuyên cần phải bé hơn hoặc bằng 100')
      .required('Tình hình chuyên cần không được để trống'),
    discipline: Yup.number()
      .min(0, 'Tuân thủ kỷ luật phải lớn hơn hoặc bằng 0')
      .max(100, 'Tuân thủ kỷ luật phải bé hơn hoặc bằng 100')
      .required('Tuân thủ kỷ luật không được để trống'),
    attitude: Yup.number()
      .min(0, 'Thái độ học tập phải lớn hơn hoặc bằng 0')
      .max(100, 'Thái độ học tập phải bé hơn hoặc bằng 100')
      .required('Thái độ học tập không được để trống'),
    acquiringKnowledge: Yup.number()
      .min(0, 'Mức độ tiếp thu kiến thức phải lớn hơn hoặc bằng 0')
      .max(100, 'Mức độ tiếp thu kiến thức phải bé hơn hoặc bằng 100')
      .required('Mức độ tiếp thu kiến thức không được để trống'),
    write: Yup.number()
      .min(0, 'Kỹ năng viết phải lớn hơn hoặc bằng 0')
      .max(100, 'Kỹ năng viết phải bé hơn hoặc bằng 100')
      .required('Kỹ năng viết không được để trống'),
    read: Yup.number()
      .min(0, 'Kỹ năng đọc hiểu phải lớn hơn hoặc bằng 0')
      .max(100, 'Kỹ năng đọc hiểu phải bé hơn hoặc bằng 100')
      .required('Kỹ năng đọc hiểu không được để trống')
      .test(
        'is-divisible-by-10',
        'Kỹ năng đọc hiểu phải chia hết cho 10',
        (value) => value === undefined || value % 10 === 0
      ),
    listen: Yup.number()
      .min(0, 'Kỹ năng nghe hiểu phải lớn hơn hoặc bằng 0')
      .max(100, 'Kỹ năng nghe hiểu phải bé hơn hoặc bằng 100')
      .required('Kỹ năng nghe hiểu không được để trống'),
    speak: Yup.number()
      .min(0, 'Kỹ năng giao tiếp phải lớn hơn hoặc bằng 0')
      .max(100, 'Kỹ năng giao tiếp phải bé hơn hoặc bằng 100')
      .required('Kỹ năng giao tiếp không được để trống'),
    kanji: Yup.number()
      .min(0, 'Từ vựng / ngữ pháp phải lớn hơn hoặc bằng 0')
      .max(60, 'Từ vựng / ngữ pháp phải bé hơn hoặc bằng 60'),
    grammarAndReading: Yup.number()
      .min(0, 'Ngữ pháp / đọc hiểu phải lớn hơn hoặc bằng 0')
      .max(60, 'Ngữ pháp / đọc hiểu phải bé hơn hoặc bằng 60'),
    listeningComprehension: Yup.number()
      .min(0, 'Nghe hiểu phải lớn hơn hoặc bằng 0')
      .max(60, 'Nghe hiểu phải bé hơn hoặc bằng 60'),
    level: Yup.string().required('Trình độ không được để trống'),
    time: Yup.string().required('Thời gian học không được để trống'),
    learningProcess: Yup.string().required('Tiến trình học tập không được để trống'),
    characteristic: Yup.string().required('Tính cách không được để trống'),
    comment: Yup.string().required('Nhận xét không được để trống').max(300, 'Nhận xét không được vượt quá 300 ký tự'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: '',
      internId: '',
      health: undefined,
      cooperation: undefined,
      attend: undefined,
      discipline: undefined,
      attitude: undefined,
      acquiringKnowledge: undefined,
      write: undefined,
      read: undefined,
      listen: undefined,
      speak: undefined,
      total: undefined,
      average: undefined,
      level: '',
      time: undefined,
      kanji: undefined,
      grammarAndReading: undefined,
      listeningComprehension: undefined,
      totalReadingAndListening: undefined,
      learningProcess: '',
      characteristic: '',
      teacher: '',

      comment: '',
      createdAt: '',
      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  const normalizeDate = (date: any) => {
    const jsDate = new Date(date);

    // Lấy năm, tháng, ngày
    const year = jsDate.getUTCFullYear();
    const month = jsDate.getUTCMonth(); // 0-11
    const day = jsDate.getUTCDate();

    // Tạo lại date mới nhưng fix giờ 17:00:00 UTC
    return new Date(Date.UTC(year, month, day, 17, 0, 0, 0));
  };

  const createNewStudy = useCallback(async (study: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/study/create`, {
      ...study,
      total:
        study.health +
        study.cooperation +
        study.attend +
        study.discipline +
        study.attitude +
        study.acquiringKnowledge +
        study.write +
        study.read +
        study.listen +
        study.speak,
      average: (study.write + study.read + study.listen + study.speak) / 4,
      internId,
      monthAndYear: normalizeDate(study.monthSelect),
    });
    return data;
  }, []);

  const editStudy = useCallback(async (study: any) => {
    const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/study/edit`, {
      ...study,
      total:
        study.health +
        study.cooperation +
        study.attend +
        study.discipline +
        study.attitude +
        study.acquiringKnowledge +
        study.write +
        study.read +
        study.listen +
        study.speak,
      average: (study.write + study.read + study.listen + study.speak) / 4,
      internId,
      monthAndYear: normalizeDate(study.monthSelect),
    });
    return data;
  }, []);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        // console.log('data', data);
        // console.log(currentStudy);
        if (data?._id !== '') {
          await editStudy(data);
          enqueueSnackbar('Cập Nhập điểm thành công!');

          // console.log('edit', data);
        } else {
          await createNewStudy(data);
          enqueueSnackbar('Nhập điểm thành công!');

          // console.log('create', data);
        }

        // Reset toàn bộ form về trạng thái ban đầu (trống)
        reset(defaultValues);

        // Nếu muốn reset cả monthSelect state
        setMonthSelect(null);
      } catch (error) {
        console.error(error);
      }
    },
    []
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  const handleGetStudyByMonth = useCallback(async () => {
    if (!monthSelect || !internId) return;

    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/study/getInternByMonth`,
      {
        internId,
        month: monthSelect.getMonth(),
        year: monthSelect.getFullYear(),
      }
    );

    const { data: newData } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/study/getByInternId`,
      {
        internId,
      }
    );

    console.log("NEW", newData)

    if (data === null) {
      // console.log("SET NULL");
      // setCurrentStudy(null);
      reset({
        _id: '',
        health: undefined,
        cooperation: undefined,
        attend: undefined,
        discipline: undefined,
        attitude: undefined,
        acquiringKnowledge: undefined,
        write: undefined,
        read: undefined,
        listen: undefined,
        speak: undefined,
        total: undefined,
        average: undefined,
        level: '',
        time:  (newData?.study?.time + 1) || 1,
        kanji: undefined,
        grammarAndReading: undefined,
        listeningComprehension: undefined,
        totalReadingAndListening: undefined,
        learningProcess: '',
        characteristic: newData?.study?.characteristic || '',
        teacher: newData?.study?.teacher || '',

        comment: '',
        createdAt: '',
        monthSelect,
      });
      return;
    }

    // reset({
    //   _id
    // })

    // setCurrentStudy(data.study);
    reset({
      _id: data.study?._id || '',
      internId,
      health: data.study?.health ? Number(data.study?.health) : undefined,
      cooperation: data.study?.cooperation ? Number(data.study.cooperation) : undefined,
      attend: data.study?.attend ? Number(data.study.attend) : undefined,
      discipline: data.study?.discipline ? Number(data.study.discipline) : undefined,
      attitude: data.study?.attitude ? Number(data.study.attitude) : undefined,
      acquiringKnowledge: data.study?.acquiringKnowledge
        ? Number(data.study.acquiringKnowledge)
        : undefined,
      write: data.study?.write ? Number(data.study.write) : undefined,
      read: data.study?.read ? Number(data.study.read) : undefined,
      listen: data.study?.listen ? Number(data.study.listen) : undefined,
      speak: data.study?.speak ? Number(data.study.speak) : undefined,
      total: data.study?.total ? Number(data.study.total) : undefined,
      average: data.study?.average ? Number(data.study.average) : undefined,
      level: data.study?.level || '',
      time: data.study?.time ? Number(data.study.time) : undefined,
      kanji: data.study?.kanji ? Number(data.study.kanji) : undefined,
      grammarAndReading: data.study?.grammarAndReading
        ? Number(data.study.grammarAndReading)
        : undefined,
      listeningComprehension: data.study?.listeningComprehension
        ? Number(data.study.listeningComprehension)
        : undefined,
      totalReadingAndListening: data.study?.totalReadingAndListening
        ? Number(data.study.totalReadingAndListening)
        : undefined,
      learningProcess: data.study?.learningProcess || '',
      characteristic: data?.study?.characteristic || newData?.study?.characteristic || '',
      teacher: data?.study?.teacher || newData?.study?.teacher || '',

      comment: data.study?.comment || '',
      createdAt: data.study?.createdAt || '',
      monthSelect: data.study?.monthAndYear || '',
    });
  }, [monthSelect, internId, reset, defaultValues]);

  useEffect(() => {
    handleGetStudyByMonth();
  }, [handleGetStudyByMonth, monthSelect, reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={4} md={4}>
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
                sm: 'repeat(1, 1fr)',
              }}
            >
              <Controller
                name="monthSelect"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('month')}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        const dateValue = newValue ? newValue.toDate() : null;

                        field.onChange(dateValue);
                        setMonthSelect(dateValue);
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
              {/* <RHFTextField name="strong" label={t('strong')} /> */}

              {/* <RHFTextField name="weak" label={t('weak')} /> */}
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
              <Controller
                name="health"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('health')}
                  />
                )}
              />
              {/* <RHFTextField name="strong" label={t('strong')} /> */}
              <Controller
                name="cooperation"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('cooperation')}
                  />
                )}
              />
              <Controller
                name="attend"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('attend')}
                  />
                )}
              />
              <Controller
                name="discipline"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('discipline')}
                  />
                )}
              />
              <Controller
                name="attitude"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('attitude')}
                  />
                )}
              />
              <Controller
                name="acquiringKnowledge"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('acquiringKnowledge')}
                  />
                )}
              />
              <Controller
                name="write"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('write')}
                  />
                )}
              />
              <Controller
                name="read"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('read')}
                    inputProps={{ step: 10 }}
                  />
                )}
              />
              <Controller
                name="listen"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('listen')}
                  />
                )}
              />
              <Controller
                name="speak"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('speak')}
                  />
                )}
              />

              <RHFSelect
                fullWidth
                name="level"
                label={t('level')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['N5', 'N4', 'N3', 'N2', 'N1'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Controller
                name="time"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    label={t('time')}
                    onFocus={(event) =>
                      event.target.addEventListener(
                        'wheel',
                        function (e) {
                          e.preventDefault();
                        },
                        { passive: false }
                      )
                    }
                  />
                )}
              />

              <Controller
                name="kanji"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('kanji')}
                  />
                )}
              />

              <Controller
                name="grammarAndReading"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('grammarAndReading')}
                  />
                )}
              />

              <Controller
                name="listeningComprehension"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    value={field.value ?? ''} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('listeningComprehension')}
                  />
                )}
              />

              <Controller
                name="learningProcess"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    // type="number"
                    value={field.value} // Thay vì value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value);
                    }}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label={t('learningProcess')}
                  />
                )}
              />
              {/* 
              <RHFSelect
                fullWidth
                name="characteristic"
                label={t('characteristic')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {characteristicList.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <RHFAutocomplete
                name="characteristic"
                label={t('characteristic') || ''}
                disablePortal
                freeSolo
                options={characteristicList}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name="teacher"
                label={t('teacher') || ''}
                disablePortal
                freeSolo
                options={teacherList}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option}>
                    {option}
                  </li>
                )}
              />
              {/* <RHFTextField name="weak" label={t('weak')} /> */}
            </Box>
            <Box sx={{ pt: 3 }}>
              <RHFEditor simple name="comment" />
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
