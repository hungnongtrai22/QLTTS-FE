import axios from 'axios';
import { m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useLocales } from 'src/locales';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IStudyClassItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
import EmptyContent from 'src/components/empty-content';
import { TableHeadCustom, TableSkeleton } from 'src/components/table';
//
import { normalizeSearch } from '../study-report-utils';

// ----------------------------------------------------------------------

const fadeInUp = varFade({ distance: 24 }).inUp;

export default function StudyClassListView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');

  const [classes, setClasses] = useState<IStudyClassItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [deleting, setDeleting] = useState<IStudyClassItem | null>(null);

  const [deletePending, setDeletePending] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/studyClass/list`);
      setClasses(data.classes || []);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_load_failed'), {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Vài chục lớp là cùng: lọc ngay trên trình duyệt theo tên lớp / giáo viên.
  const filtered = useMemo(() => {
    const keyword = normalizeSearch(search.trim());
    if (!keyword) return classes;
    return classes.filter(
      (item) =>
        normalizeSearch(item.name).includes(keyword) ||
        normalizeSearch(item.teacher).includes(keyword)
    );
  }, [classes, search]);

  const tableHead = mdUp
    ? [
        { id: 'name', label: t('study_class_name') },
        { id: 'teacher', label: t('study_class_teacher'), width: 240 },
        { id: 'studying', label: t('study_class_studying'), width: 120, align: 'center' },
        { id: 'total', label: t('study_class_total'), width: 120, align: 'center' },
        { id: 'updatedAt', label: t('study_class_updated'), width: 140 },
        { id: '', width: 112 },
      ]
    : [
        { id: 'name', label: t('study_class_name') },
        { id: '', width: 104 },
      ];

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletePending(true);
    try {
      await axios.post(`${process.env.REACT_APP_HOST_API}/api/studyClass/delete`, {
        _id: deleting._id,
      });
      enqueueSnackbar(t('study_class_deleted', { name: deleting.name }));
      setDeleting(null);
      fetchClasses();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_delete_failed'), {
        variant: 'error',
      });
    } finally {
      setDeletePending(false);
    }
  };

  const renderActions = (item: IStudyClassItem) => (
    <Stack direction="row" justifyContent="flex-end">
      <Tooltip title={t('study_class_open')}>
        <IconButton
          component={RouterLink}
          href={paths.dashboard.studyClass.edit(item._id)}
          onClick={(event: React.MouseEvent) => event.stopPropagation()}
          sx={{ width: 44, height: 44 }}
        >
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('study_class_delete')}>
        <IconButton
          color="error"
          onClick={(event) => {
            event.stopPropagation();
            setDeleting(item);
          }}
          sx={{ width: 44, height: 44 }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const renderTeacher = (item: IStudyClassItem) =>
    item.teacher || (
      <Typography component="span" variant="body2" sx={{ color: 'text.disabled' }}>
        {t('study_class_no_teacher')}
      </Typography>
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('study_class_list') || ''}
        links={[
          { name: t('dashboard') || '', href: paths.dashboard.root },
          { name: t('study_class') || '', href: paths.dashboard.studyClass.root },
          { name: t('list') || '' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.studyClass.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ minHeight: 44 }}
          >
            {t('study_class_new')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MotionContainer>
        <Card component={m.div} variants={fadeInUp}>
          <Stack sx={{ p: 2.5 }}>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('study_class_search') || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: mdUp ? 800 : 0 }}>
                <TableHeadCustom headLabel={tableHead} />

                <TableBody>
                  {loading && [...Array(3)].map((_, index) => <TableSkeleton key={index} />)}

                  {!loading &&
                    filtered.map((item) => (
                      <TableRow
                        key={item._id}
                        hover
                        onClick={() => router.push(paths.dashboard.studyClass.edit(item._id))}
                        sx={{ cursor: 'pointer' }}
                      >
                        {mdUp ? (
                          <>
                            <TableCell>
                              <Typography variant="subtitle2">{item.name}</Typography>
                            </TableCell>
                            <TableCell>{renderTeacher(item)}</TableCell>
                            <TableCell align="center">
                              <Label variant="soft" color={item.studying ? 'success' : 'default'}>
                                {item.studying}
                              </Label>
                            </TableCell>
                            <TableCell align="center">{item.total}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                              {fDate(item.updatedAt, 'dd/MM/yyyy')}
                            </TableCell>
                          </>
                        ) : (
                          // Điện thoại: tên lớp, giáo viên và sĩ số gộp một ô.
                          <TableCell>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {renderTeacher(item)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {t('study_class_count', {
                                studying: item.studying,
                                total: item.total,
                              })}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell align="right" sx={{ px: 1 }}>
                          {renderActions(item)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {!loading && !filtered.length && (
                    <TableRow>
                      <TableCell colSpan={12} sx={{ p: 0 }}>
                        <EmptyContent
                          filled
                          title={
                            t(classes.length ? 'study_class_not_found' : 'study_class_empty') || ''
                          }
                          description={classes.length ? '' : t('study_class_empty_hint') || ''}
                          sx={{ py: 8 }}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </MotionContainer>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('study_class_delete_title', { name: deleting?.name || '' })}
        content={t(
          deleting?.total ? 'study_class_delete_content' : 'study_class_delete_content_empty',
          { count: deleting?.total || 0 }
        )}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={deletePending}
            onClick={handleDelete}
          >
            {t('study_class_delete')}
          </LoadingButton>
        }
      />
    </Container>
  );
}
