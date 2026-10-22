import { m } from 'framer-motion';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// locales
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MotionContainer, varFade } from 'src/components/animate';
//
import StudyClassForm from '../study-class-form';

// ----------------------------------------------------------------------

const fadeInUp = varFade({ distance: 24 }).inUp;

export default function StudyClassCreateView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const router = useRouter();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
      <CustomBreadcrumbs
        heading={t('study_class_new') || ''}
        links={[
          { name: t('dashboard') || '', href: paths.dashboard.root },
          { name: t('study_class') || '', href: paths.dashboard.studyClass.root },
          { name: t('create') || '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MotionContainer>
        <m.div variants={fadeInUp}>
          {/* Tạo xong mở ngay trang của lớp để thêm TTS. */}
          <StudyClassForm
            onSaved={(created) => router.push(paths.dashboard.studyClass.edit(created._id))}
          />
        </m.div>
      </MotionContainer>
    </Container>
  );
}
