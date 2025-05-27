import { Helmet } from 'react-helmet-async';
// sections
import CompanyCreateView from 'src/sections/user/view/company-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function CompanyCreatePage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_company')}</title>
      </Helmet>

      <CompanyCreateView />
    </>
  );
}
