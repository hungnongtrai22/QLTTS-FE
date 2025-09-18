import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import CompareView from 'src/sections/user/view/compare-view';
// sections

// ----------------------------------------------------------------------

export default function ComparePage() {
  return (
    <>
      <Helmet>
        <title> {t("dashboard")}: {t("user_profile")}</title>
      </Helmet>

      <CompareView />
    </>
  );
}
