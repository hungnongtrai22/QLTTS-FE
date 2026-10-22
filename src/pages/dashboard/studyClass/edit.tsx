import { Helmet } from 'react-helmet-async';
// locales
import { useLocales } from 'src/locales';
// sections
import StudyClassEditView from 'src/sections/user/view/study-class-edit-view';

// ----------------------------------------------------------------------

export default function StudyClassEditPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('study_class')}</title>
      </Helmet>

      <StudyClassEditView />
    </>
  );
}
