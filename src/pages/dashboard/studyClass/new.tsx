import { Helmet } from 'react-helmet-async';
// locales
import { useLocales } from 'src/locales';
// sections
import StudyClassCreateView from 'src/sections/user/view/study-class-create-view';

// ----------------------------------------------------------------------

export default function StudyClassCreatePage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('study_class_new')}</title>
      </Helmet>

      <StudyClassCreateView />
    </>
  );
}
