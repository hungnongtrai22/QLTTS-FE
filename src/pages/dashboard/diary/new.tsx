import { Helmet } from 'react-helmet-async';
// sections
import DiaryCreateView from 'src/sections/user/view/diary-create-view';
// locales
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------

export default function DiaryCreatePage() {
    const { t } = useLocales();
  
  return (
    <>
      <Helmet>
        <title> {t('title_dashboard_create_diary')}</title>
      </Helmet>

      <DiaryCreateView />
    </>
  );
}
