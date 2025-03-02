import ProtectedRoute from '../components/auth/ProtectedRoute';

/**
 * Higher Order Component to protect routes based on authentication and authorization
 * @param {React.ComponentType} Component - The component to wrap
 * @param {Object} options - Options for protection
 * @param {string[]} [options.roles] - Array of allowed roles
 * @param {string[]} [options.permissions] - Array of required permissions
 * @param {string} [options.redirectTo] - URL to redirect to if unauthorized
 * @returns {React.ComponentType} - Protected component
 */
export default function withAuth(Component, options = {}) {
  const { roles, permissions, redirectTo } = options;
  
  const WithAuth = (props) => (
    <ProtectedRoute roles={roles} permissions={permissions} redirectTo={redirectTo}>
      <Component {...props} />
    </ProtectedRoute>
  );
  
  // Copy getInitialProps from the wrapped component
  if (Component.getInitialProps) {
    WithAuth.getInitialProps = Component.getInitialProps;
  }
  
  return WithAuth;
}