import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
//
import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
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
