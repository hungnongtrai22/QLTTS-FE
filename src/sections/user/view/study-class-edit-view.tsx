import axios from 'axios';
import { m } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// locales
import { useLocales } from 'src/locales';
// types
import { IStudyClassItem, IStudyClassMember } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
//
import StudyClassForm from '../study-class-form';
import StudyClassMembers from '../study-class-members';

// ----------------------------------------------------------------------

type ClassInfo = Pick<IStudyClassItem, '_id' | 'name' | 'teacher'>;

const fadeInUp = varFade({ distance: 24 }).inUp;

export default function StudyClassEditView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { id = '' } = useParams();

  // undefined = đang tải, null = không tìm thấy
  const [info, setInfo] = useState<ClassInfo | null>();

  const [members, setMembers] = useState<IStudyClassMember[] | null>(null);

  const fetchClass = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_HOST_API}/api/studyClass/${id}`);
      setInfo(data.studyClass);
      setMembers(data.interns || []);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        setInfo(null);
        return;
      }
      setInfo((prev) => prev ?? null);
      enqueueSnackbar(error?.response?.data?.message || t('study_class_load_failed'), {
        variant: 'error',
      });
    }
  }, [id, enqueueSnackbar, t]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  const breadcrumbs = (
    <CustomBreadcrumbs
      heading={info?.name || t('study_class') || ''}
      links={[
        { name: t('dashboard') || '', href: paths.dashboard.root },
        { name: t('study_class') || '', href: paths.dashboard.studyClass.root },
        { name: info?.name || '' },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  if (info === undefined) return <LoadingScreen />;

  if (info === null) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {breadcrumbs}
        <EmptyContent
          filled
          title={t('study_class_not_exist') || ''}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.studyClass.list}
              variant="contained"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3, minHeight: 44 }}
            >
              {t('study_class_back')}
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {breadcrumbs}

      {/* Xếp dọc: bảng TTS cần cả chiều ngang (tên, công ty, nguồn, trạng thái, ngày nhập học). */}
      <MotionContainer>
        <Stack spacing={3}>
          <m.div variants={fadeInUp}>
            <StudyClassForm current={info} onSaved={(saved) => setInfo({ ...info, ...saved })} />
          </m.div>
          <m.div variants={fadeInUp}>
            <StudyClassMembers
              classId={info._id}
              className={info.name}
              members={members}
              onChanged={fetchClass}
            />
          </m.div>
        </Stack>
      </MotionContainer>
    </Container>
  );
}
