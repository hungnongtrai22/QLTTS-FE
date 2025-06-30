import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import CreateOrder from 'src/pages/dashboard/order/new';
import InternListByDongThapPage from 'src/pages/dashboard/intern/listByDongThap';
import OrderListPage from 'src/pages/dashboard/order/list';
import OrderEditPage from 'src/pages/dashboard/order/edit';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
// const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
// const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
// const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
// const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
// const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
// const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
// const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
// const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
// const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
// const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const InternProfilePage = lazy(() => import('src/pages/dashboard/intern/profile'));
const InternCardsPage = lazy(() => import('src/pages/dashboard/intern/cards'));
const InternListPage = lazy(() => import('src/pages/dashboard/intern/list'));
const InternListByTradeUnionPage = lazy(
  () => import('src/pages/dashboard/intern/listByTradeUnion')
);
const InternAccountPage = lazy(() => import('src/pages/dashboard/intern/account'));
const InternCreatePage = lazy(() => import('src/pages/dashboard/intern/new'));
const InternEditPage = lazy(() => import('src/pages/dashboard/intern/edit'));
// Trade Union
const TradeUnionListPage = lazy(() => import('src/pages/dashboard/tradeUnion/list'));
const TradeUnionCreatePage = lazy(() => import('src/pages/dashboard/tradeUnion/new'));
const TradeUnionEditPage = lazy(() => import('src/pages/dashboard/tradeUnion/edit'));
// Company
const CompanyListPage = lazy(() => import('src/pages/dashboard/company/list'));
const CompanyCreatePage = lazy(() => import('src/pages/dashboard/company/new'));
const CompanyEditPage = lazy(() => import('src/pages/dashboard/company/edit'));

// USER
// const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
// const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
// const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
// const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
// const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
// const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
// const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
// const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
// const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
// const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
// const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
// const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
// const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
// const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
// const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
// const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
// const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
// const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
// const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
// const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
// const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      // { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'intern',
        children: [
          {
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <InternProfilePage />
              </RoleBasedGuard>
            ),
            index: true,
          },
          { path: ':id/profile', element: <InternProfilePage /> },
          { path: 'cards', element: <InternCardsPage /> },
          {
            path: 'list',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <InternListPage />
              </RoleBasedGuard>
            ),
          },
          { path: 'listByTradeUnion', element: <InternListByTradeUnionPage /> },
          { path: 'listByDongThap', element: <InternListByDongThapPage /> },

          {
            path: 'new',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <InternCreatePage />
              </RoleBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <InternEditPage />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'account',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <InternAccountPage />{' '}
              </RoleBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'tradeUnion',
        children: [
          // { element: <InternProfilePage />, index: true },
          // { path: 'profile', element: <InternProfilePage /> },
          // { path: 'cards', element: <InternCardsPage /> },
          {
            path: 'list',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <TradeUnionListPage />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <TradeUnionCreatePage />{' '}
              </RoleBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <TradeUnionEditPage />
              </RoleBasedGuard>
            ),
          },
          // { path: 'account', element: <InternAccountPage /> },
        ],
      },

      {
        path: 'company',
        children: [
          {
            path: 'list',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <CompanyListPage />{' '}
              </RoleBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <CompanyCreatePage />{' '}
              </RoleBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <CompanyEditPage />{' '}
              </RoleBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'order',
        children: [
          {
            path: 'list',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <OrderListPage />{' '}
              </RoleBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <CreateOrder />{' '}
              </RoleBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleBasedGuard hasContent roles={['admin']}>
                <OrderEditPage />{' '}
              </RoleBasedGuard>
            ),
          },
        ],
      },
      // {
      //   path: 'user',
      //   children: [
      //     { element: <UserProfilePage />, index: true },
      //     { path: 'profile', element: <UserProfilePage /> },
      //     { path: 'cards', element: <UserCardsPage /> },
      //     { path: 'list', element: <UserListPage /> },
      //     { path: 'new', element: <UserCreatePage /> },
      //     { path: ':id/edit', element: <UserEditPage /> },
      //     { path: 'account', element: <UserAccountPage /> },
      //   ],
      // },
      // {
      //   path: 'product',
      //   children: [
      //     { element: <ProductListPage />, index: true },
      //     { path: 'list', element: <ProductListPage /> },
      //     { path: ':id', element: <ProductDetailsPage /> },
      //     { path: 'new', element: <ProductCreatePage /> },
      //     { path: ':id/edit', element: <ProductEditPage /> },
      //   ],
      // },
      // {
      //   path: 'order',
      //   children: [
      //     { element: <OrderListPage />, index: true },
      //     { path: 'list', element: <OrderListPage /> },
      //     { path: ':id', element: <OrderDetailsPage /> },
      //   ],
      // },
      // {
      //   path: 'invoice',
      //   children: [
      //     { element: <InvoiceListPage />, index: true },
      //     { path: 'list', element: <InvoiceListPage /> },
      //     { path: ':id', element: <InvoiceDetailsPage /> },
      //     { path: ':id/edit', element: <InvoiceEditPage /> },
      //     { path: 'new', element: <InvoiceCreatePage /> },
      //   ],
      // },
      // {
      //   path: 'post',
      //   children: [
      //     { element: <BlogPostsPage />, index: true },
      //     { path: 'list', element: <BlogPostsPage /> },
      //     { path: ':title', element: <BlogPostPage /> },
      //     { path: ':title/edit', element: <BlogEditPostPage /> },
      //     { path: 'new', element: <BlogNewPostPage /> },
      //   ],
      // },
      // {
      //   path: 'job',
      //   children: [
      //     { element: <JobListPage />, index: true },
      //     { path: 'list', element: <JobListPage /> },
      //     { path: ':id', element: <JobDetailsPage /> },
      //     { path: 'new', element: <JobCreatePage /> },
      //     { path: ':id/edit', element: <JobEditPage /> },
      //   ],
      // },
      // {
      //   path: 'tour',
      //   children: [
      //     { element: <TourListPage />, index: true },
      //     { path: 'list', element: <TourListPage /> },
      //     { path: ':id', element: <TourDetailsPage /> },
      //     { path: 'new', element: <TourCreatePage /> },
      //     { path: ':id/edit', element: <TourEditPage /> },
      //   ],
      // },
      // { path: 'file-manager', element: <FileManagerPage /> },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      // { path: 'permission', element: <PermissionDeniedPage /> },
      // { path: 'blank', element: <BlankPage /> },
    ],
  },
];
