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
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: (
        <Navigate
          to={
            user?.role === 'admin' ? paths.dashboard.root : paths.dashboard.intern.listByTradeUnion
          }
          replace
        />
      ),
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
