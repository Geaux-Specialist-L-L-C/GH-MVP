import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROLE_PERMISSIONS } from '../middleware/permissions';

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load user on first render
  useEffect(() => {
    // Check if we're running on the client side
    if (typeof window === 'undefined') return;
    
    async function loadUserFromToken() {
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user data from API
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to authenticate');
        }
        
        // Set authenticated user
        setUser(data.data);
        
      } catch (err) {
        console.error('Error loading user:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserFromToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      
      return data.user;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setError(null);
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Check if user has role
  const hasRole = (roles) => {
    if (!user) return false;
    
    // Convert to array if string
    const roleArray = typeof roles === 'string' ? [roles] : roles;
    return roleArray.includes(user.role);
  };

  // Get JWT token
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    hasPermission,
    hasRole,
    getToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}