import { Helmet } from 'react-helmet-async';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from 'src/locales';
import InternListBySource from 'src/sections/user/view/intern-list-by-source';

// ----------------------------------------------------------------------

export default function InternListBySourcePage() {
  const { t } = useLocales();
  // const { user } = useAuthContext();
  // console.log('Testtt', user);

  // // ✅ Nếu user là tradeunion thì chuyển hướng
  // if (user?.role === 'tradeunion') {
  //   console.log('Testtt');
  //   return <Navigate to="/dashboard/intern/listByTradeUnion" replace />;
  // }

  return (
    <>
      <Helmet>
        <title>{t('list_intern')}</title>
      </Helmet>

      <InternListBySource />
    </>
  );
}
