import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import InternListBySource from 'src/sections/user/view/intern-list-by-source';
// sections

// ----------------------------------------------------------------------

export default function InternListBySourcePage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <InternListBySource />
    </>
  );
}
