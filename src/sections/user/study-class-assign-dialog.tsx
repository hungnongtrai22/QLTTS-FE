import axios from 'axios';
import { useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyClassItem } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// "Xếp lớp" trên thanh chọn nhiều dòng ở danh sách TTS (chỉ admin): đưa các TTS đang chọn vào
// một lớp, hoặc gỡ khỏi lớp. Chỉ dựng khi mở — hộp thoại tự tải danh sách lớp.

type Props = {
  open: boolean;
  onClose: VoidFunction;
  ids: string[];
  onDone: VoidFunction;
};

export default function StudyClassAssignDialog({ open, onClose, ids, onDone }: Props) {
  const { t } = useLocales();

  const smUp = useResponsive('up', 'sm');

  const { enqueueSnackbar } = useSnackbar();

  const [classes, setClasses] = useState<IStudyClassItem[] | null>(null);

  const [picked, setPicked] = useState<IStudyClassItem | null>(null);

  // remove = gỡ khỏi lớp, assign = xếp vào lớp đang chọn
  const [saving, setSaving] = useState<'assign' | 'remove' | null>(null);

  useEffect(() => {
    if (!open) return;
    axios
      .get(`${process.env.REACT_APP_HOST_API}/api/studyClass/list`)
      .then(({ data }) => setClasses(data.classes || []))
      .catch((error) => {
        console.error(error);
        setClasses([]);
        enqueueSnackbar(error?.response?.data?.message || t('study_class_load_failed'), {
          variant: 'error',
        });
      });
  }, [open, enqueueSnackbar, t]);

  const save = async (studyClass: IStudyClassItem | null) => {
    setSaving(studyClass ? 'assign' : 'remove');
    try {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updateStudyClass`, {
        ids,
        studyClass: studyClass?._id || null,
      });
      enqueueSnackbar(
        studyClass
          ? t('study_class_added', { count: ids.length, name: studyClass.name })
          : t('study_class_removed', { count: ids.length })
      );
      onDone();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_assign_failed'), {
        variant: 'error',
      });
    } finally {
      setSaving(null);
    }
  };

  const empty = classes !== null && !classes.length;

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={!smUp}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t('study_class_assign_title', { count: ids.length })}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {empty ? (
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('study_class_assign_empty')}
              </Typography>
              <Button
                component={RouterLink}
                href={paths.dashboard.studyClass.new}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{ minHeight: 44 }}
              >
                {t('study_class_new')}
              </Button>
            </Stack>
          ) : (
            <Autocomplete
              options={classes || []}
              loading={classes === null}
              value={picked}
              onChange={(event, value) => setPicked(value)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <Stack sx={{ py: 0.5 }}>
                    <Typography variant="subtitle2">{option.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {[
                        option.teacher,
                        t('study_class_count', {
                          studying: option.studying,
                          total: option.total,
                        }),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </Stack>
                </li>
              )}
              renderInput={(params) => <TextField {...params} label={t('study_class')} />}
            />
          )}

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('study_class_assign_note')}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <LoadingButton
          color="error"
          loading={saving === 'remove'}
          disabled={!!saving}
          onClick={() => save(null)}
          sx={{ mr: 'auto', minHeight: 44 }}
        >
          {t('study_class_unassign')}
        </LoadingButton>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={!!saving}>
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={saving === 'assign'}
          disabled={!picked || !!saving}
          onClick={() => save(picked)}
          sx={{ minHeight: 44 }}
        >
          {t('study_class_assign')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
