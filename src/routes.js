import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUserPage from './pages/AddUserPage';
import Protected from './pages/Protected';
import AddProductPage from './pages/AddProductPage';

// ----------------------------------------------------------------------

export default function Router() {
  const userData = window.sessionStorage.getItem('userData');
  const isLoggedIn = userData?.length > 0;
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <Protected isLoggedIn={isLoggedIn}><DashboardAppPage /></Protected> },
        { path: 'user', element: <Protected isLoggedIn={isLoggedIn}><UserPage /></Protected> },
        { path: 'user/add', element: <Protected isLoggedIn={isLoggedIn}><AddUserPage /></Protected> },
        { path: 'products', element: <Protected isLoggedIn={isLoggedIn}><ProductsPage /></Protected> },
        { path: 'products/add', element: <Protected isLoggedIn={isLoggedIn}><AddProductPage /></Protected> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
      index : true
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
