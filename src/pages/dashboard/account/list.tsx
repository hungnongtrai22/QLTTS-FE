import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locales';
// sections
import AccountListView from 'src/sections/user/view/account-list-view';

// ----------------------------------------------------------------------

export default function AccountListPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title> {t('account_management')}</title>
      </Helmet>

      <AccountListView />
    </>
  );
}
