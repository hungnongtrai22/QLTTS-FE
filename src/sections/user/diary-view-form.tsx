import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// types
import { IDiaryItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axios from 'axios';
import { useLocales } from 'src/locales';
import { MenuItem } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

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
  startDate: any;
  endDate: any;
}

type Props = {
  // currentUser?: IUserItem;
  // currentSource?: ISourceItem;
  currentDiary?: IDiaryItem;
};

export default function DiaryViewForm({ currentDiary }: Props) {
  // const router = useRouter();
  // console.log('TEST', currentIntern);
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();
  const [interns, setInterns] = useState([]);

  // const [city, setCity] = useState('');

  const NewUserSchema = Yup.object().shape({
    // userId: Yup.number().required('UserId is required').min(1),
    name: Yup.string().required('Name is required'),
    // familyInJapan: Yup.boolean().required('familyInJapan is required'),
    // moveForeign: Yup.boolean().required('Move Foreign is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDiary?.name || '',
      intern: currentDiary?.intern || '',
      status: currentDiary?.status || '',
      direction: currentDiary?.direction || '',
      startDate: currentDiary?.startDate || new Date().toISOString(),
      endDate:
        currentDiary?.endDate || new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
      // time: currentDiary?.time || '',
      description: currentDiary?.description || '',
      person: currentDiary?.person,

      // school: currentIntern?.school || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDiary]
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
    control,
  } = methods;

  // const values = watch();

  const createNewDiary = useCallback(async (diary: any) => {
    const { data } = await axios.post(`${process.env.REACT_APP_HOST_API}/api/diary/create`, {
      ...diary,
      intern: diary.intern._id,
      status: "Đã thực hiện",
    });
    return data;
    // console.log("DIARY", diary);
  }, []);

  const editDiary = useCallback(
    async (diary: any) => {
      const { data } = await axios.put(`${process.env.REACT_APP_HOST_API}/api/diary/edit`, {
        ...diary,
        _id: currentDiary?._id,
      });
      return data;
    },
    [currentDiary]
  );

  const handleGetInterns = useCallback(async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/user/list`);
    setInterns(data.interns);
  }, []);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // router.push(paths.dashboard.user.list);
        if (currentDiary) {
          await editDiary(data);
          enqueueSnackbar(currentDiary ? 'Update success!' : 'Create success!');
        } else {
          await createNewDiary(data);
          enqueueSnackbar(currentDiary ? 'Update success!' : 'Create success!');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [createNewDiary, editDiary, enqueueSnackbar, currentDiary]
    // [currentIntern, enqueueSnackbar, reset, router]
  );

  // const handleSelectIntern = useCallback(async (id: any) => {
  //   setTradeUnionSelect(id);
  //   setCompanySelect('');

  //   setValue('company', null);
  // }, []);

  useEffect(() => {
    handleGetInterns();
  }, [handleGetInterns]);

  // console.log('NEW', currentDiary);

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
              <RHFTextField name="name" label={t('name')} sx={{ pointerEvents: 'none', opacity: 1 }}/>
              {/* <RHFTextField name="email" label="Email" /> */}
              {interns.length > 0 && (
                // <RHFAutocompleteNew
                //   name="intern"
                //   label={t('intern') || ''}
                //   // disablePortal
                //   // value={tradeUnionSelect}
                //   // defaultValue={tradeUnionSelect._id}
                //   options={interns}
                //   getOptionLabel={(option: any) => option?.name || ''}
                //   renderOption={(props, option: any) => (
                //     <li {...props} key={option._id} value={option._id}>
                //       {option.name}
                //     </li>
                //   )}
                //   changeState={handleSelectTradeUnion}
                //   isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                // />

                <RHFAutocomplete
                  name="intern"
                  label={t('intern') || ''}
                  disablePortal
                  // freeSolo
                  getOptionLabel={(option: any) => option?.name || ''}
                  isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                  options={interns}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id} value={option._id}>
                      {option.name}
                    </li>
                  )}
                  sx={{ pointerEvents: 'none', opacity: 1 }}
                />
              )}
              <RHFSelect
                fullWidth
                name="direction"
                label={t('direction')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ pointerEvents: 'none', opacity: 1 }}
              >
                {['Gọi đi', 'Gọi đến'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Controller
                name="startDate"
                
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                    value={new Date(field.value as Date)}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(new Date(newValue).toISOString());
                      }
                    }}
                    label={t('start_date')}
                    format="dd/MM/yyyy hh:mm a"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    sx={{ pointerEvents: 'none', opacity: 1 }}
                    value={new Date(field.value as Date)}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(new Date(newValue).toISOString());
                      }
                    }}
                    label={t('end_date')}
                    format="dd/MM/yyyy hh:mm a"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />

              <RHFSelect
                fullWidth
                name="person"
                label={t('person')}
                sx={{ pointerEvents: 'none', opacity: 1 }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  'Nguyễn Thị Hồng Nhung',
                  'Kha Nguyễn',
                  'Nguyễn Thị Mười',
                  'Hồng Quốc Đăng',
                  'Minh Đức',
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <RHFTextField name="phone" label={t('phone')} />
              <RHFTextField name="state" label={t('state')} />

              <RHFTextField name="address" label={t('address')} /> */}
            </Box>
            <Box sx={{ pt: 3 }}>
              <RHFEditor simple name="description" sx={{ pointerEvents: 'none', opacity: 1 }}/>
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
                {!currentDiary ? t('create_diary') : t('edit_diary')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
