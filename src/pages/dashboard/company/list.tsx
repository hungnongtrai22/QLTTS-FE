import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import CompanyListView from 'src/sections/user/view/company-list-view';
// sections

// ----------------------------------------------------------------------

export default function CompanyListPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <CompanyListView />
    </>
  );
}
