import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// config
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';

//
import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuthContext();
  let redirectPath = paths.dashboard.intern.listBySource;

  if (user?.role === 'admin') {
    redirectPath = paths.dashboard.root;
  } else if (user?.role === 'tradeunion') {
    redirectPath = paths.dashboard.intern.listByTradeUnion;
  }
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={redirectPath} replace />,
    },

    // ----------------------------------------------------------------------

    // SET INDEX PAGE WITH HOME PAGE
    // {
    //   path: '/',
    //   element: (
    //     <MainLayout>
    //       <Outlet />
    //     </MainLayout>
    //   ),
    //   children: [{ element: <HomePage />, index: true }],
    // },

    // Auth routes
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
