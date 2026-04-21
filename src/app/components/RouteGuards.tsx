import { Navigate } from 'react-router';
import { useAppSelector } from '../../store/hooks';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function VendorRoute({ children }: RouteGuardProps) {
  const user = useAppSelector(s => s.user);
  
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userRole !== 'Vendor') {
    return <Navigate to="/buyer/home" replace />;
  }
  
  return <>{children}</>;
}

export function BuyerRoute({ children }: RouteGuardProps) {
  const user = useAppSelector(s => s.user);
  
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userRole !== 'Buyer') {
    return <Navigate to="/vendor/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export function AuthenticatedRoute({ children }: RouteGuardProps) {
  const user = useAppSelector(s => s.user);
  
  if (!user.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}