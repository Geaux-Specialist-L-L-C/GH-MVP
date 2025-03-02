import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * ProtectedRoute component to wrap pages that require authentication or specific roles/permissions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} [props.roles] - Array of allowed roles (if not specified, any authenticated user is allowed)
 * @param {string[]} [props.permissions] - Array of required permissions (if specified, user must have at least one)
 * @param {string} [props.redirectTo] - URL to redirect to if unauthorized (defaults to /login)
 * @returns {JSX.Element} - Protected component or redirect
 */
export default function ProtectedRoute({ 
  children, 
  roles, 
  permissions, 
  redirectTo = '/login' 
}) {
  const { user, loading, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push({
        pathname: redirectTo,
        query: { returnUrl: router.asPath }
      });
      return;
    }
    
    // Check roles if specified
    if (roles && !hasRole(roles)) {
      router.push('/unauthorized');
      return;
    }
    
    // Check permissions if specified
    if (permissions && !permissions.some(permission => hasPermission(permission))) {
      router.push('/unauthorized');
      return;
    }
  }, [
    loading, 
    isAuthenticated, 
    roles, 
    permissions, 
    hasRole, 
    hasPermission, 
    router, 
    redirectTo
  ]);
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="auth-loading-container">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }
  
  // Show empty div while redirecting
  if (!isAuthenticated || 
      (roles && !hasRole(roles)) || 
      (permissions && !permissions.some(permission => hasPermission(permission)))) {
    return <div></div>;
  }
  
  // Render children if authorized
  return <>{children}</>;
}