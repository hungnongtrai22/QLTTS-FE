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
// utils
// types
import {IStudyItem } from 'src/types/user';
// assets
// components

import FormProvider, {

  RHFSelect,
  RHFAutocomplete,
  RHFEditor,
} from 'src/components/hook-form';
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';

import LoadingButton from '@mui/lab/LoadingButton';
import { characteristicList } from 'src/utils/characteristic';
import { statusIntern } from 'src/utils/status';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IStudyItem, 'avatarUrl'> {
  _id: string;
  status: string;
}

type Props = {
  internId?: string;
  currentStatus?: string;
};

dayjs.locale('vi');

export default function InternStatusForm({ internId, currentStatus }: Props) {
  // const router = useRouter();
  console.log('TEST', currentStatus);
  const { t, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  // const values = watch();

  // const [city, setCity] = useState('');
  // const [currentStudy, setCurrentStudy] = useState<IStudyItem | null>(null);
  // console.log(currentStudy);

  const NewUserSchema = Yup.object().shape({
    status: Yup.string().required('Trạng thái không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      status: currentStatus || '',
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
       
          await handleUpdateStatusIntern(data);
          enqueueSnackbar('Cập nhật thành công!');

      } catch (error) {
        console.error(error);
      }
    },
    []
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  const handleUpdateStatusIntern = useCallback(async (intern : any) => {
    if (!internId) return;

    const { data } = await axios.put(
      `${process.env.REACT_APP_HOST_API}/api/user/updateStatus`,
      {
        _id: internId,
        status: intern.status,
      }
    );

    // if (data === null) {
    //   reset({
    //     status: '',
    //   });
    //   return;
    // }

    // reset({
    //   status: data.study?.status || '',
    // });
  }, [reset]);

  // useEffect(() => {
  //   handleGetStudyByMonth();
  // }, [handleGetStudyByMonth, reset]);

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
              

              <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusIntern.map((option : any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

           
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
