import { Helmet } from 'react-helmet-async';
// sections
import InternCreateView from 'src/sections/user/view/intern-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function InternCreatePage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_intern')}</title>
      </Helmet>

      <InternCreateView />
    </>
  );
}
