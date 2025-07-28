import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import SourceListView from 'src/sections/user/view/source-list-view';
// sections

// ----------------------------------------------------------------------

export default function SourcePage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <SourceListView />
    </>
  );
}
