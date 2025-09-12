/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax, no-await-in-loop */

import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Unstable_Grid2';
// utils
// types
import { IInternItem, IStudyItem, IUserItem } from 'src/types/user';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from '@mui/x-date-pickers/locales';
// assets
// components

import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFEditor,
  RHFTextField,
  RHFUpload,
  RHFUploadVideo,
} from 'src/components/hook-form';
import { CircularProgress, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import { CustomFile } from 'src/components/upload';

import LoadingButton from '@mui/lab/LoadingButton';
import { characteristicList } from 'src/utils/characteristic';
import { statusIntern } from 'src/utils/status';
import RHFAutocompleteNew from 'src/components/hook-form/rhf-autocomplete-new';

// import { current } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<any, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  currentIntern?: IInternItem;
};

dayjs.locale('vi');

export default function InternGalleryForm({ currentIntern }: Props) {
  // const router = useRouter();

  const [tradeUnion, setTradeUnion] = useState([]);
  const [tradeUnionSelect, setTradeUnionSelect] = useState(currentIntern?.tradeUnion);
  const [company, setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState(currentIntern?.companySelect || '');

  const [source, setSource] = useState([]);
  const [sourceSelect, setSourceSelect] = useState(currentIntern?.source);

  const { t, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  // const values = watch();

  // const [city, setCity] = useState('');
  // const [currentStudy, setCurrentStudy] = useState<IStudyItem | null>(null);
  // console.log(currentStudy);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      title: '',
      postedAt: new Date(),
      status: 'Cá nhân',
      description: '',
      images: null,
    }),
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

  const addInternGallery = useCallback(
    async (value: any) => {
      // console.log(currentIntern?._id, tradeUnionSelect, companySelect);
      const { data } = await axios.post(
        `${process.env.REACT_APP_HOST_API}/api/gallery/create`,
        {
          internId: currentIntern?._id,
          postedAt: value.postedAt,
          title: value.title,
          imageUrl: value.images,
          description: value.description,
          status: value?.status,
        }
      );
      return data;
    },
    [currentIntern, tradeUnionSelect, companySelect, sourceSelect]
  );

  const CLOUD_NAME = 'dj4gvts4q'; // thay bằng cloud_name của bạn
  const UPLOAD_PRESET = 'rijfgtqn'; // tạo trong Cloudinary dashboard

  // Hàm gọi trực tiếp Cloudinary
  const uploadImages = async (formData: FormData) => {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return [res.data]; // để giữ nguyên format cũ (mảng)
  };

  // Hàm upload 1 ảnh/video
  const uploadImageToCloud = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET); // preset của Cloudinary
    // Nếu muốn lưu vào folder "dashboard"
    formData.append('folder', 'dashboard');

    const uploaded = await uploadImages(formData);
    return uploaded[0].secure_url; // dùng secure_url thay vì url
  }, []);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // const images = await uploadImageToCloud(data.avatar);
        console.log(data);
        const images = [];
        for (const item of data.images) {
          const image = await uploadImageToCloud(item);
          images.push(image);
        }
        console.log('images', images);
        data.images = images;
        await addInternGallery(data);
        reset();
        enqueueSnackbar('Tạo thành công!');
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file: any) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  // useEffect(() => {
  //   setValue('tradeUnion', currentIntern?.tradeUnion);
  //   setValue('company', currentIntern?.companySelect);
  // }, []);

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
              {/* <RHFSelect
                fullWidth
                name="status"
                label={t('status')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {statusIntern.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              <RHFTextField name="title" label="Tiêu đề" />

              <Controller
                name="postedAt"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label="Ngày"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue || null);
                      }}
                      // views={['month', 'year']}
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

              <RHFSelect
                fullWidth
                name="status"
                label="Trạng thái"
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {['Cá nhân', 'Tất cả'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                  >
                    <DatePicker
                      label={t('startDate')}
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
              /> */}

              {/* {source.length > 0 && (
                <RHFAutocompleteNew
                  name="source"
                  label={t('source') || ''}
                  // disablePortal
                  // value={tradeUnionSelect}
                  // defaultValue={tradeUnionSelect._id}
                  options={source}
                  getOptionLabel={(option: any) => option?.name || ''}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id} value={option._id}>
                      {option.name}
                    </li>
                  )}
                  changeState={handleSelectSource}
                  isOptionEqualToValue={(option: any, value: any) => option._id === value._id}
                />
              )} */}
            </Box>

             <Box sx={{ pt: 3 }}>
              <RHFEditor simple name="description" />
            </Box>

            <Stack spacing={1.5} sx={{ mt: 3, mb: 3 }}>
              {/* <Typography variant="subtitle2">Images</Typography> */}
              <RHFUploadVideo
                multiple
                thumbnail
                name="images"
                maxSize={104857600}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>

           

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
