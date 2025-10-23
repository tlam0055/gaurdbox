import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      console.log('AuthContext: Checking authentication...');
      try {
        const storedUser = localStorage.getItem('user');
        console.log('AuthContext: Stored user:', storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user data:', userData);
          setUser(userData);
        } else {
          console.log('AuthContext: No stored user found');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        console.log('AuthContext: Setting isLoading to false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    console.log('AuthContext: login called with:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('AuthContext: user set to:', userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;
  console.log('AuthContext: isAuthenticated:', isAuthenticated, 'user:', user);

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
