import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
// sections
import InternListView from 'src/sections/user/view/intern-list-view';

// ----------------------------------------------------------------------

export default function InternListPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <InternListView />
    </>
  );
}
