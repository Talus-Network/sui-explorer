// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import { Layout } from '~/components/Layout';
import { IdPage } from '~/pages/id-page';
import AddressResult from './address-result/AddressResult';
import CheckpointDetail from './checkpoints/CheckpointDetail';
import Home from './home/Home';
import { ObjectResult } from './object-result/ObjectResult';
import { Recent } from './recent';
import TransactionResult from './transaction-result/TransactionResult';
import { ValidatorDetails } from './validator/ValidatorDetails';
import { ValidatorPageResult } from './validators/Validators';
import { useAuth } from '~/contexts/AuthContext';
import { Login } from './login';
import { USE_AUTH } from '~/context';

// Protected route wrapper component
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

function RedirectWithId({ base }: { base: string }) {
  const params = useParams();
  const { search } = useLocation();
  return <Navigate to={`/${base}/${params.id}${search}`} replace />;
}

// Define the main application routes
const appRoutes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'recent', element: <Recent /> },
      { path: 'object/:id', element: <ObjectResult /> },
      { path: 'checkpoint/:id', element: <CheckpointDetail /> },
      { path: 'txblock/:id', element: <TransactionResult /> },
      { path: 'address/:id', element: <AddressResult /> },
      { path: 'validators', element: <ValidatorPageResult /> },
      { path: 'validator/:id', element: <ValidatorDetails /> },
      { path: 'experimental--id/:id', element: <IdPage /> },
    ],
  },
  {
    path: '/transactions',
    element: <Navigate to="/recent" replace />,
  },
  // Support legacy routes:
  {
    path: '/objects/:id',
    element: <RedirectWithId base="object" />,
  },
  {
    path: '/transaction/:id',
    element: <RedirectWithId base="txblock" />,
  },
  {
    path: '/transactions/:id',
    element: <RedirectWithId base="txblock" />,
  },
  {
    path: '/addresses/:id',
    element: <RedirectWithId base="address" />,
  },
];

// Conditionally create the router based on USE_AUTH
export const router = createBrowserRouter(
  USE_AUTH
    ? [
        // Include login route when authentication is required
        {
          path: '/login',
          element: <Login />,
        },
        // Wrap app routes with ProtectedRoute when authentication is required
        {
          path: '/',
          element: <ProtectedRoute />,
          children: appRoutes,
        },
        // 404 route
        { path: '*', element: <Navigate to="/" replace /> },
      ]
    : [
        // When authentication is not required, routes are accessible directly
        {
          path: '/',
          children: appRoutes,
        },
        // 404 route
        { path: '*', element: <Navigate to="/" replace /> },
      ]
);
