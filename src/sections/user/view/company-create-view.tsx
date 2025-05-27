// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import CompanyNewEditForm from '../company-new-edit-form';

// ----------------------------------------------------------------------

export default function CompanyCreateView() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create_company') || "Create New Intern"}
        links={[
          {
            name: t('dashboard')  || "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: t('company_title') || "Company",
            href: paths.dashboard.intern.root,
          },
          { name: t('new_company') || "New Company" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CompanyNewEditForm />
    </Container>
  );
}
