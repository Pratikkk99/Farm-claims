
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppUser {
  id: string;
  username: string;
  email: string;
  role: 'farmer' | 'admin';
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'farmer' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth setup for frontend testing - just set loading to false
    setIsLoading(false);
  }, []);


  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - bypasses authentication for frontend testing
    setUser({
      id: 'mock-user-id',
      username: 'testuser',
      email: email || 'test@example.com',
      role: 'farmer',
      first_name: 'Test',
      last_name: 'User',
    });
  };

  const register = async (userData: RegisterData): Promise<void> => {
    // Mock registration - just set user for frontend testing
    setUser({
      id: 'mock-user-id',
      username: userData.username,
      email: userData.email,
      role: userData.role,
      first_name: userData.first_name,
      last_name: userData.last_name,
    });
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
