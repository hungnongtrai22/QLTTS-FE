import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
import DiaryListView from 'src/sections/user/view/diary-list-view';
// sections

// ----------------------------------------------------------------------

export default function DiaryListPage() {
      const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('list_intern')}</title>
      </Helmet>

      <DiaryListView />
    </>
  );
}
