import { Helmet } from 'react-helmet-async';
// sections
// locales
import { useLocales } from 'src/locales';
import InternCreateViewIsuzu from 'src/sections/user/view/intern-create-view-isuzu';
// ----------------------------------------------------------------------

export default function InternCreateIsuzuPage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_intern')}</title>
      </Helmet>

      <InternCreateViewIsuzu />
    </>
  );
}
