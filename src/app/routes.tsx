import { createBrowserRouter } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { VendorDashboard } from './pages/VendorDashboard';
import { VendorOnboarding } from './pages/VendorOnboarding';
import { BuyerHome } from './pages/BuyerHome';
import { BuyerExplore } from './pages/BuyerExplore';
import { ShopDetail } from './pages/ShopDetail';
import { BuyerDemand } from './pages/BuyerDemand';
import { ItemComparison } from './pages/ItemComparison';
import { Search } from './pages/Search';
import { VendorRoute, BuyerRoute } from './components/RouteGuards';

export const router = createBrowserRouter([
  {
    index: true,
    Component: Landing,
  },
  {
    path: 'auth',
    Component: Auth,
  },
  {
    path: 'vendor',
    Component: AppLayout,
    children: [
      {
        path: 'onboarding',
        Component: VendorOnboarding,
      },
      {
        path: 'dashboard',
        element: (
          <VendorRoute>
            <VendorDashboard />
          </VendorRoute>
        ),
      },
    ],
  },
  {
    path: 'buyer',
    Component: AppLayout,
    children: [
      {
        path: 'home',
        element: (
          <BuyerRoute>
            <BuyerHome />
          </BuyerRoute>
        ),
      },
      {
        path: 'explore',
        element: (
          <BuyerRoute>
            <BuyerExplore />
          </BuyerRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <BuyerRoute>
            <Search />
          </BuyerRoute>
        ),
      },
      {
        path: 'shop/:id',
        element: (
          <BuyerRoute>
            <ShopDetail />
          </BuyerRoute>
        ),
      },
      {
        path: 'compare/:itemName',
        element: (
          <BuyerRoute>
            <ItemComparison />
          </BuyerRoute>
        ),
      },
      {
        path: 'demand',
        element: (
          <BuyerRoute>
            <BuyerDemand />
          </BuyerRoute>
        ),
      },
    ],
  },
]);