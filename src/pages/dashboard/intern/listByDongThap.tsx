import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import InternListByDongThapView from 'src/sections/user/view/intern-list-by-dong-thap-view';
// sections

// ----------------------------------------------------------------------

export default function InternListByDongThapPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <InternListByDongThapView />
    </>
  );
}
