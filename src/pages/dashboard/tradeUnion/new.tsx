import { Helmet } from 'react-helmet-async';
// sections
import TradeUnionCreateView from 'src/sections/user/view/trade-union-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function CreatePage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_trade_union')}</title>
      </Helmet>

      <TradeUnionCreateView />
    </>
  );
}
