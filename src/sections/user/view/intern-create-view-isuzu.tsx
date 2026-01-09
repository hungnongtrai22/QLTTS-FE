// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import InternNewEditFormIsuzu from '../intern-new-edit-form-isuzu';

// ----------------------------------------------------------------------

export default function InternCreateViewIsuzu() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create_intern') || "Create New Intern"}
        links={[
          {
            name: t('dashboard')  || "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: t('intern') || "Intern",
            href: paths.dashboard.intern.root,
          },
          { name: t('new_intern') || "New intern" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InternNewEditFormIsuzu />
    </Container>
  );
}
