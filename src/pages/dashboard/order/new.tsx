import { Helmet } from 'react-helmet-async';
// sections
import OrderCreateView from 'src/sections/user/view/order-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function CreateOrder() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_order')}</title>
      </Helmet>

      <OrderCreateView />
    </>
  );
}
