import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider Running");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
 const getCurrentUser = async () => {
  try {
    console.log("Calling /auth/me");

    const { data } = await api.get("/auth/me");

    console.log(data);

    setUser(data.user);

  } catch (error) {
    console.log(error.response?.data);

    setUser(null);

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};