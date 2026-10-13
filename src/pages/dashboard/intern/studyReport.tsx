import { Helmet } from 'react-helmet-async';
// locales
import { useLocales } from 'src/locales';
// sections
import StudyReportView from 'src/sections/user/view/study-report-view';

// ----------------------------------------------------------------------

export default function StudyReportPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('study_report')}</title>
      </Helmet>

      <StudyReportView />
    </>
  );
}
