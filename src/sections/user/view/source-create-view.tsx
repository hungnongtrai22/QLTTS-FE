// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import SourceNewEditForm from '../source-new-edit-form';

// ----------------------------------------------------------------------

export default function SourceCreateView() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('new_source') || "Create New Intern"}
        links={[
          {
            name: t('dashboard')  || "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: t('trade_union') || "Trade Union",
            href: paths.dashboard.intern.root,
          },
          { name: t('new_trade_union') || "New Trade Union" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SourceNewEditForm />
    </Container>
  );
}
