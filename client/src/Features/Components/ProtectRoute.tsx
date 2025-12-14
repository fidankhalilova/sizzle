// src/Components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../Store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requires auth, false = redirects if authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Store the attempted URL for redirecting after login
  useEffect(() => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname, requireAuth]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04322f]"></div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route should not be accessible when authenticated (like login page)
  if (!requireAuth && isAuthenticated) {
    // Redirect to the stored URL or home page
    const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
    sessionStorage.removeItem("redirectAfterLogin");
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
