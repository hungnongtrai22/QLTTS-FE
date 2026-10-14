import { Helmet } from 'react-helmet-async';
// locales
import { useLocales } from 'src/locales';
// sections
import StudyBulkView from 'src/sections/user/view/study-bulk-view';

// ----------------------------------------------------------------------

export default function StudyBulkPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('study_bulk')}</title>
      </Helmet>

      <StudyBulkView />
    </>
  );
}
