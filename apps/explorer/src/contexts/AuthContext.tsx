import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { DEFAULT_NETWORK } from '../context';
interface AuthContextType {
  credentials: { username: string; password: string } | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AUTH_STORAGE_KEY = 'sui_explorer_auth';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function testCredentials(username: string, password: string): Promise<void> {
  // Change URL to your actual endpoint if different
  const testURL = DEFAULT_NETWORK + '/health';
  const base64Credentials = btoa(`${username}:${password}`);
  return fetch(testURL, {
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    return;
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        setCredentials(JSON.parse(storedAuth));
      } catch (e) {
        console.error('Failed to parse stored credentials');
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Updated login function: tests the credentials first
  const login = async (username: string, password: string) => {
    // Test if the provided credentials work by hitting the /health endpoint
    await testCredentials(username, password);
    const newCredentials = { username, password };
    setCredentials(newCredentials);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newCredentials));
  };

  const logout = () => {
    setCredentials(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = {
    credentials,
    login,
    logout,
    isAuthenticated: !!credentials,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
