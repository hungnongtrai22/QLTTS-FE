import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
// sections
import TradeUnionListView from 'src/sections/user/view/trade-union-list-view';

// ----------------------------------------------------------------------

export default function CompanyListPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <TradeUnionListView />
    </>
  );
}
