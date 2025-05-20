import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "../types";

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Mock functions for the MVP
  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Mock login - would be replaced with actual API call
      const mockUser: User = {
        id: "1",
        name: email.split("@")[0],
        email,
        role: email.includes("admin") ? "admin" : "user",
      };
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Invalid credentials",
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Update user with wallet address
      if (authState.user) {
        const updatedUser = {
          ...authState.user,
          walletAddress: accounts[0],
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to connect wallet",
      }));
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, connectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};