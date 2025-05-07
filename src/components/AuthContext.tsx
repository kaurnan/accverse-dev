
"use client"

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { refreshToken } from "../services/api"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"

// Define the User interface
interface User {
  id: number
  name: string
  email: string
  phone?: string
  role?: string
}

// Define the Auth context interface
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Define the Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// JWT payload type
interface JwtPayload {
  exp: number
  user_id: number
  [key: string]: unknown
}

// Create the Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const initCompletedRef = useRef(false)

  // Function to validate JWT token
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      
      // Add a 30-second buffer to account for any clock differences
      if (decoded.exp < currentTime - 30) {
        console.log("JWT expired or about to expire, attempting refresh...")
        return false
      }
      return true
    } catch (error) {
      console.error("Invalid JWT token:", error)
      return false
    }
  }
  
  // Function to refresh JWT token
  const refreshJWT = useCallback(async (): Promise<string | null> => {
    try {
      console.log("Attempting to refresh JWT...")
      const newToken = await refreshToken()
      if (newToken) {
        console.log("JWT refresh successful")
        return newToken
      } else {
        console.log("JWT refresh returned null token")
        return null
      }
    } catch (error) {
      console.error("JWT refresh failed:", error)
      return null
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    console.log("Logging out user")
    // Clear state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    
    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
    
    // Redirect to login page with return URL
    const returnTo = location.pathname !== "/login" && location.pathname !== "/register" 
      ? location.pathname 
      : "/"
      
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }, [navigate, location])

  // Setup timer for token refresh
  const setupTokenRefresh = useCallback((jwtToken: string) => {
    try {
      // Clear any existing refresh timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }

      const decoded = jwtDecode<JwtPayload>(jwtToken)
      const expiryTime = decoded.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      
      // Calculate time until refresh (5 minutes before expiry)
      const timeUntilRefresh = Math.max(0, expiryTime - currentTime - 5 * 60 * 1000)
      
      // console.log(`Setting token refresh timer for ${timeUntilRefresh / 1000} seconds from now`)
      
      // Set up timer to refresh token before expiry
      const timer = setTimeout(async () => {
        console.log("Token refresh timer triggered")
        const newToken = await refreshJWT()
        if (newToken) {
          console.log("Setting new token after refresh")
          setToken(newToken)
          localStorage.setItem("token", newToken)
          
          // Reset the refresh timer with the new token
          setupTokenRefresh(newToken)
        } else {
          // If refresh fails, log out
          console.log("Token refresh failed, logging out")
          toast.error("Your session has expired. Please log in again.")
          logout()
        }
      }, timeUntilRefresh)
      
      refreshTimerRef.current = timer
    } catch (error) {
      console.error("Error setting up token refresh:", error)
    }
  }, [refreshJWT, logout])

  // Function to initialize authentication state
  const initializeAuth = useCallback(async () => {
    if (initCompletedRef.current) return;
    // console.log("Initializing authentication...")
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken) {
      // console.log("Found saved token, validating...")
      const isValid = validateToken(savedToken)
      
      if (!isValid) {
        console.log("Token invalid, attempting refresh...")
        try {
          const newToken = await refreshJWT()
          if (newToken) {
            console.log("Successfully refreshed token during initialization")
            setToken(newToken)
            localStorage.setItem("token", newToken)
            
            // Set up refresh for the new token
            setupTokenRefresh(newToken)
            
            // Parse and set saved user data
            if (savedUser) {
              try {
                const userData = JSON.parse(savedUser)
                setUser(userData)
                setIsAuthenticated(true)
                console.log("User authenticated after token refresh")
              } catch (e) {
                console.error("Error parsing user data:", e)
                logout()
              }
            }
          } else {
            console.log("JWT refresh failed during initialization, logging out...")
            logout()
          }
        } catch (error) {
          console.error("Error refreshing token during initialization:", error)
          logout()
        }
      } else {
        // Token is valid
        // console.log("Token is valid, setting up authentication state")
        setToken(savedToken)
        setupTokenRefresh(savedToken)
        
        // Parse saved user
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            setIsAuthenticated(true)
            // console.log("User authenticated with existing valid token")
          } catch (e) {
            console.error("Error parsing user data:", e)
            logout()
          }
        } else {
          console.log("No user data found despite valid token, logging out")
          logout()
        }
      }
    } else {
      console.log("No token found in local storage.")
      setIsAuthenticated(false)
      setUser(null)
      setToken(null)
    }
    
    setLoading(false)
    initCompletedRef.current = true;
  }, [refreshJWT, setupTokenRefresh, logout])

  // Run initialization once on component mount
  useEffect(() => {
    initializeAuth().catch((error) => console.error("Error during authentication initialization:", error))
    
    // Cleanup function to clear timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
    }
  }, [initializeAuth])

  // Set up an interval to periodically check token validity
  useEffect(() => {
    if (!token) return;
    
    // Check token validity every minute
    const tokenCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken && !validateToken(currentToken)) {
        console.log("Token validity check failed, attempting refresh");
        refreshJWT().then(newToken => {
          if (newToken) {
            setToken(newToken);
            localStorage.setItem("token", newToken);
            setupTokenRefresh(newToken);
          } else {
            console.log("Periodic token refresh failed, logging out");
            toast.error("Your session has expired. Please log in again.");
            logout();
          }
        });
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
  }, [token, refreshJWT, logout, setupTokenRefresh]);

  // Login function
  const login = useCallback((userData: User, authToken: string) => {
    console.log(`Logging in user: ${userData.email}`);
    
    // Save to state
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
    
    // Setup token refresh
    setupTokenRefresh(authToken)
    
    // Check for return URL in query params
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo');
    
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate('/');
    }
    
  }, [setupTokenRefresh, navigate])

  // Function to check if the user is authenticated
  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log("Checking authentication status...")
    if (loading) {
      console.log("Auth still loading, waiting...")
      // Wait for initialization to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!loading) {
            clearInterval(checkInterval);
            resolve(isAuthenticated);
          }
        }, 100);
      });
    }
    
    if (isAuthenticated && token) {
      const isTokenValid = validateToken(token);
      if (!isTokenValid) {
        console.log("Token expired during auth check, attempting refresh");
        const newToken = await refreshJWT();
        if (newToken) {
          setToken(newToken);
          localStorage.setItem("token", newToken);
          setupTokenRefresh(newToken);
          return true;
        } else {
          console.log("Token refresh failed during auth check, logging out");
          toast.error("Your session has expired. Please log in again.");
          logout();
          return false;
        }
      }
      return true;
    }
    
    // Last resort: check if we have a token in localStorage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      if (validateToken(savedToken)) {
        console.log("Valid token found during auth check");
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setToken(savedToken);
          setIsAuthenticated(true);
          setupTokenRefresh(savedToken);
          return true;
        }
      } else {
        console.log("Invalid token found during auth check, attempting refresh");
        const newToken = await refreshJWT();
        if (newToken) {
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setToken(newToken);
            setIsAuthenticated(true);
            setupTokenRefresh(newToken);
            return true;
          }
        }
      }
    }
    
    console.log("Authentication check failed, user not authenticated");
    return false;
  }, [isAuthenticated, loading, token, setupTokenRefresh, refreshJWT, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
