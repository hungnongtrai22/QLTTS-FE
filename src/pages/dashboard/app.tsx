import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title>{t('dashboard_app')}</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
