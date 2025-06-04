// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';

//
import OrderNewEditForm from '../order-new-edit-form';

// ----------------------------------------------------------------------

export default function OrderCreateView() {
  const settings = useSettingsContext();
    const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create_order') || "Create New Intern"}
        links={[
          {
            name: t('dashboard')  || "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: t('order') || "Order",
            href: paths.dashboard.order.root,
          },
          { name: t('order_new') || "New Order" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OrderNewEditForm />
    </Container>
  );
}
