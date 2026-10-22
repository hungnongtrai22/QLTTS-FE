import { Helmet } from 'react-helmet-async';
// locales
import { useLocales } from 'src/locales';
// sections
import StudyClassListView from 'src/sections/user/view/study-class-list-view';

// ----------------------------------------------------------------------

export default function StudyClassListPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('study_class_list')}</title>
      </Helmet>

      <StudyClassListView />
    </>
  );
}
