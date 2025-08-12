import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
// sections
import InternProfileView from 'src/sections/user/view/intern-profile-view';

// ----------------------------------------------------------------------

export default function InternProfilePage() {
  return (
    <>
      <Helmet>
        <title> {t("dashboard")}: {t("user_profile")}</title>
      </Helmet>

      <InternProfileView />
    </>
  );
}
