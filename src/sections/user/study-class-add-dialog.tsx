import axios from 'axios';
import { m } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
// @mui
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyClassMember } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { varFade } from 'src/components/animate';
//
import { normalizeSearch } from './study-report-utils';

// ----------------------------------------------------------------------
// "Thêm TTS vào lớp" ở trang Lớp: chọn nhiều TTS đang học. TTS đang ở lớp khác vẫn chọn được
// (sẽ chuyển sang lớp này) — có công tắc để ẩn bớt nhóm đó.

type Props = {
  open: boolean;
  onClose: VoidFunction;
  classId: string;
  className: string;
  onAdded: VoidFunction;
};

const fadeIn = varFade().in;

export default function StudyClassAddDialog({ open, onClose, classId, className, onAdded }: Props) {
  const { t } = useLocales();

  const smUp = useResponsive('up', 'sm');

  const { enqueueSnackbar } = useSnackbar();

  const [candidates, setCandidates] = useState<IStudyClassMember[] | null>(null);

  const [search, setSearch] = useState('');

  const [hideOthers, setHideOthers] = useState(false);

  const [picked, setPicked] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPicked([]);
    setSearch('');
    setCandidates(null);
    axios
      .get(`${process.env.REACT_APP_HOST_API}/api/studyClass/candidates`)
      .then(({ data }) => setCandidates(data.interns || []))
      .catch((error) => {
        console.error(error);
        setCandidates([]);
        enqueueSnackbar(error?.response?.data?.message || t('study_class_load_failed'), {
          variant: 'error',
        });
      });
  }, [open, enqueueSnackbar, t]);

  // Chưa xếp lớp lên đầu, rồi tới người đang ở lớp khác; người đã ở lớp này xuống cuối.
  const visible = useMemo(() => {
    const keyword = normalizeSearch(search.trim());
    const rank = (item: IStudyClassMember) => {
      if (!item.studyClassId) return 0;
      return item.studyClassId === classId ? 2 : 1;
    };
    return (candidates || [])
      .filter((item) => !hideOthers || !item.studyClassId || item.studyClassId === classId)
      .filter(
        (item) =>
          !keyword ||
          normalizeSearch(item.name).includes(keyword) ||
          normalizeSearch(item.namejp).includes(keyword) ||
          normalizeSearch(item.company).includes(keyword)
      )
      .sort((a, b) => rank(a) - rank(b));
  }, [candidates, search, hideOthers, classId]);

  const moving = (candidates || []).filter(
    (item) => picked.includes(item._id) && item.studyClassId && item.studyClassId !== classId
  ).length;

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));

  const handleAdd = async () => {
    setSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_HOST_API}/api/user/updateStudyClass`, {
        ids: picked,
        studyClass: classId,
      });
      enqueueSnackbar(t('study_class_added', { count: picked.length, name: className }));
      onAdded();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_assign_failed'), {
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderList = () => {
    if (!candidates) {
      return [...Array(5)].map((_, index) => (
        <Stack key={index} direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton sx={{ flexGrow: 1 }} />
        </Stack>
      ));
    }
    if (!visible.length) {
      return <EmptyContent title={t('study_class_add_none') || ''} sx={{ py: 6 }} />;
    }
    return (
      <List disablePadding>
        {visible.map((item) => {
          const here = item.studyClassId === classId;
          return (
            <ListItemButton
              key={item._id}
              component={m.div}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              disabled={here}
              onClick={() => toggle(item._id)}
              sx={{ borderRadius: 1, px: 1, minHeight: 56 }}
            >
              <Checkbox
                edge="start"
                checked={here || picked.includes(item._id)}
                tabIndex={-1}
                disableRipple
              />
              <Avatar src={item.avatar} alt={item.name} sx={{ mr: 1.5 }} />
              <ListItemText
                primary={item.name}
                secondary={[item.namejp, item.company].filter(Boolean).join(' · ')}
                primaryTypographyProps={{ typography: 'subtitle2' }}
                secondaryTypographyProps={{ component: 'span', noWrap: true }}
                sx={{ minWidth: 0 }}
              />
              {item.studyClassId && (
                <Label variant="soft" color={here ? 'success' : 'warning'} sx={{ ml: 1 }}>
                  {here ? t('study_class_already_here') : item.studyClass}
                </Label>
              )}
            </ListItemButton>
          );
        })}
      </List>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={!smUp}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t('study_class_add_title')}
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {t('study_class_add_subtitle', { name: className })}
        </Typography>
      </DialogTitle>

      <Stack spacing={1} sx={{ px: 3, pb: 1 }}>
        <TextField
          fullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('study_class_add_search') || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={hideOthers}
              onChange={(event) => setHideOthers(event.target.checked)}
            />
          }
          label={t('study_class_hide_others')}
          sx={{ minHeight: 44 }}
        />
      </Stack>

      <DialogContent dividers sx={{ px: 2, minHeight: 240 }}>
        {renderList()}
      </DialogContent>

      {moving > 0 && (
        <Alert severity="warning" sx={{ mx: 3, mt: 2 }}>
          {t('study_class_move_warning', { count: moving })}
        </Alert>
      )}

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={saving}
          disabled={!picked.length}
          onClick={handleAdd}
          sx={{ minHeight: 44 }}
        >
          {t('study_class_add_n', { count: picked.length })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
