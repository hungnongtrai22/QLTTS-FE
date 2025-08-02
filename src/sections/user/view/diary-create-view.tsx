// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import DiaryNewEditForm from '../diary-new-edit-form';

// ----------------------------------------------------------------------

export default function DiaryCreateView() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('new_diary') || "Create New Intern"}
        links={[
          {
            name: t('dashboard')  || "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: t('diary') || "Trade Union",
            href: paths.dashboard.diary.root,
          },
          { name: t('new_diary') || "New Trade Union" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DiaryNewEditForm />
    </Container>
  );
}
