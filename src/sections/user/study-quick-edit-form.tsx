import * as Yup from 'yup';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// routes
// _mock
// types
import { IInternItem, IUserItem } from 'src/types/user';
// assets
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserItem, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentIntern?: IInternItem;
};

export default function StudyQuickEditForm({ currentIntern, open, onClose }: Props) {
  console.log(currentIntern);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      name: currentIntern?.name || '',
      company: currentIntern?.companySelect?._id || '',
      tradeUnion: currentIntern?.tradeUnion?._id || '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  /* eslint-disable object-shorthand */
  const createStudy = useCallback(async (study : any) => {
    const { data } = await axios.put(
      `${process.env.REACT_APP_HOST_API}/api/study/create`,
      {
        ...study,
        total: study.health + study.cooperation + study.attend + study.discipline + study.attitude + study.acquiringKnowledge + study.write + study.read + study.listen + study.speak,
        average: (study.write + study.read + study.listen + study.speak) / 4,
        learningProcess: `皆の日本語第${study.learningProcess}課`,
        internId: currentIntern?._id,
      }
    );
    return data;
  }, [currentIntern]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await createStudy(data);
        reset();
        onClose();
        enqueueSnackbar('Nhập điểm thành công!');
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset, createStudy]
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Nhập điểm tháng {new Date().getMonth() + 1}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Thực Tập Sinh: {currentIntern?.name}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {/* <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}
            {/* 
            <RHFSelect
              fullWidth
              name="tradeUnion"
              label={t('trade_union')}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              onChange={(event) => {
                setTradeUnionSelect(event.target.value);
              }}
              value={tradeUnionSelect}
            >
              {tradeUnion.map((option: any) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>
            {tradeUnionSelect && company.length > 0 ? (
              <RHFSelect
                fullWidth
                name="company"
                label={t('company_title')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={(event) => {
                  setCompanySelect(event.target.value);
                }}
                value={companySelect}
              >
                {company.map((option: any) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            ) : (
              <p>Không có công ty</p>
            )} */}

            <RHFTextField name="health" label={t('health')} type="number" />
            <RHFTextField name="cooperation" label={t('cooperation')} type="number" />
            <RHFTextField name="attend" label={t('attend')} type="number" />
            <RHFTextField name="discipline" label={t('discipline')} type="number" />
            <RHFTextField name="attitude" label={t('attitude')} type="number" />
            <RHFTextField name="acquiringKnowledge" label={t('acquiringKnowledge')} type="number" />
            <RHFTextField name="write" label={t('write')} type="number" />
            <RHFTextField name="read" label={t('read')} type="number" />
            <RHFTextField name="listen" label={t('listen')} type="number" />
            <RHFTextField name="speak" label={t('speak')} type="number" />
            <RHFSelect
              fullWidth
              name="level"
              label={t('level')}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {['N5', 'N4', 'N3', 'N2', 'N1'].map((option: any) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="time" label={t('time')} type="number" />
            <RHFTextField name="kanji" label={t('kanji')} type="number" />
            <RHFTextField name="grammarAndReading" label={t('grammarAndReading')} type="number" />
            <RHFTextField
              name="listeningComprehension"
              label={t('listeningComprehension')}
              type="number"
            />
            <RHFTextField name="learningProcess" label={t('learningProcess')} type="number" />
            <RHFTextField name="characteristic" label={t('characteristic')} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <RHFEditor simple name="comment" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Nhập
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
