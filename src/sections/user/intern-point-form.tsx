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

import LoadingButton from '@mui/lab/LoadingButton';

import InternPDF from '../invoice/intern-pdf';
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

  // const values = watch();

  // const [city, setCity] = useState('');
  const [currentStudy, setCurrentStudy] = useState<IStudyItem>();
  const [monthSelect, setMonthSelect] = useState<Date | null>(null);

  const NewUserSchema = Yup.object().shape({
    health: Yup.number().required('Sức khoẻ không được để trống'),
    cooperation: Yup.number().required('Sức khoẻ không được để trống'),
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

  const handleGetStudyByMonth = useCallback(async () => {
    if (!monthSelect || !internId) return;

    const { data } = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/study/getInternByMonth`,
      {
        internId,
        month: monthSelect.getMonth() + 1,
        year: monthSelect.getFullYear(),
      }
    );

    if (data === null) {
      console.log('NULL');
      reset(defaultValues);
      return;
    }

    // reset({
    //   _id
    // })

    // setCurrentStudy(data.study);
    reset({
      _id: data.study?._id || '',
      internId: internId || '',
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
      characteristic: data.study?.characteristic || '',
      comment: data.study?.comment || '',
      createdAt: data.study?.createdAt || '',
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
                      value={monthSelect && monthSelect !== null ? dayjs(monthSelect) : null}
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
              <RHFTextField name="health" label={t('health')} type="number" />
              {/* <RHFTextField name="strong" label={t('strong')} /> */}
              <RHFTextField name="cooperation" label={t('cooperation')} type="number" />
              <RHFTextField name="attend" label={t('attend')} type="number" />
              <RHFTextField name="discipline" label={t('discipline')} type="number" />

              {/* <RHFTextField name="weak" label={t('weak')} /> */}
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
