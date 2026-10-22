import * as Yup from 'yup';
import axios from 'axios';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useLocales } from 'src/locales';
// utils
import { teacherList } from 'src/utils/teacher';
// types
import { IStudyClassItem } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValues = {
  name: string;
  teacher: string;
};

type Props = {
  // Không truyền = tạo lớp mới
  current?: Pick<IStudyClassItem, '_id' | 'name' | 'teacher'>;
  onSaved: (studyClass: { _id: string; name: string; teacher?: string }) => void;
};

export default function StudyClassForm({ current, onSaved }: Props) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t('study_class_name_required') || '')
      .max(100, t('study_class_name_max') || ''),
    teacher: Yup.string()
      .trim()
      .max(100, t('study_class_teacher_max') || ''),
  });

  const defaultValues = useMemo(
    () => ({ name: current?.name || '', teacher: current?.teacher || '' }),
    [current]
  );

  const methods = useForm<FormValues>({ resolver: yupResolver(schema), defaultValues });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    const body = { name: values.name.trim(), teacher: (values.teacher || '').trim() };
    try {
      const { data } = current
        ? await axios.put(`${process.env.REACT_APP_HOST_API}/api/studyClass/edit`, {
            ...body,
            _id: current._id,
          })
        : await axios.post(`${process.env.REACT_APP_HOST_API}/api/studyClass/create`, body);
      enqueueSnackbar(t(current ? 'study_class_saved' : 'study_class_created'));
      methods.reset(body);
      onSaved(data.studyClass);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.code === 'NAME_TAKEN') {
        setError('name', { message: t('study_class_name_taken') || '' });
        return;
      }
      enqueueSnackbar(error?.response?.data?.message || t('study_class_save_failed'), {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={t('study_class_info')}
          subheader={t('study_class_info_hint')}
          sx={{ pb: 1 }}
        />
        {/* Máy tính: tên, giáo viên và nút lưu trên một hàng; điện thoại xếp dọc. */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          sx={{ p: { xs: 2, md: 3 } }}
        >
          <RHFTextField
            name="name"
            label={t('study_class_name')}
            autoFocus={!current}
            sx={{ flex: { md: 1 } }}
          />

          <RHFAutocomplete
            name="teacher"
            label={t('study_class_teacher') || ''}
            options={teacherList}
            freeSolo
            autoSelect
            sx={{ flex: { md: 1 } }}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!!current && !isDirty}
            sx={{
              minHeight: { xs: 44, md: 54 },
              flexShrink: 0,
              alignSelf: { xs: 'flex-end', md: 'flex-start' },
            }}
          >
            {t(current ? 'study_class_save' : 'study_class_create')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
