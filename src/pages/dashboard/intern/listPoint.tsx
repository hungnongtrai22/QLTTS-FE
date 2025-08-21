import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import InternListPointView from 'src/sections/user/view/intern-list-point-view';
// sections

// ----------------------------------------------------------------------

export default function InternListPointPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <InternListPointView />
    </>
  );
}
