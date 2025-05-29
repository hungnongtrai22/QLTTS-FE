import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import InternListByTradeUnionView from 'src/sections/user/view/intern-list-by-trade-union-view';
// sections

// ----------------------------------------------------------------------

export default function InternListByTradeUnionPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <InternListByTradeUnionView />
    </>
  );
}
