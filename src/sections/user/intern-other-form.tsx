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
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import axios from 'axios';

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
import { strongJPs, strongVNs } from 'src/utils/strong';
import { weakJPs, weakVNs } from 'src/utils/weak';

import InternPDF from '../invoice/intern-pdf';
// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  iq: number | null;
  math: number | null;
  kraepelin1: number | null;
  kraepelin2: number | null;
  pushup: number | null;
}

type Props = {
  // currentUser?: IUserItem;
  currentIntern?: IInternItem;
};

dayjs.locale('vi');

export default function InternOtherForm({ currentIntern }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  // const values = watch();

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('Họ và tên không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      iq: currentIntern?.iq || null,
      math: currentIntern?.math || null,
      kraepelin1: currentIntern?.kraepelin1 || null,
      kraepelin2: currentIntern?.kraepelin2 || null,
      pushup: currentIntern?.pushup || null,
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
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const editIntern = useCallback(
    async (intern: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updatePoint`, {
        ...intern,
        _id: currentIntern?._id,
      });
      return data;
    },
    [currentIntern]
  );

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        // router.push(paths.dashboard.user.list);

        await editIntern(data);
        enqueueSnackbar('Update success!');
      } catch (error) {
        console.error(error);
      }
    },
    [editIntern, enqueueSnackbar, reset]
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Nhập điểm kiểm tra (IQ, toán, cộng dồn):
            </Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="iq" label={t('iq')} type="number" />
              {/* <RHFTextField name="strong" label={t('strong')} /> */}
              <RHFTextField name="math" label={t('math')} type="number" />
              <RHFTextField name="kraepelin1" label={t('kraepelin1')} type="number" />
              <RHFTextField name="kraepelin2" label={t('kraepelin2')} type="number" />
              <RHFTextField name="pushup" label={t('pushup')} type="number" />

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
