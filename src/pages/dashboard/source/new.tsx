import { Helmet } from 'react-helmet-async';
// sections
import SourceCreateView from 'src/sections/user/view/source-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function SourceCreatePage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_trade_union')}</title>
      </Helmet>

      <SourceCreateView />
    </>
  );
}
