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
import { useAuth } from '~/contexts/AuthContext'; // Import the auth hook
import { Login } from './login'; // Import the login component you'll create

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

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
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
    ],
  },

  // 404 route:
  { path: '*', element: <Navigate to="/" replace /> },
]);
