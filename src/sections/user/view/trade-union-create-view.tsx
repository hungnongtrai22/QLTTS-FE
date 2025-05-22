// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import TradeUnionNewEditForm from '../trade-union-new-edit-form';

// ----------------------------------------------------------------------

export default function TradeUnionCreateView() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create_trade_union') || "Create New Intern"}
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

      <TradeUnionNewEditForm />
    </Container>
  );
}
