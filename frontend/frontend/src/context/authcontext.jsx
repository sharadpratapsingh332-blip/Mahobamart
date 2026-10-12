import {
createContext,
useContext,
useEffect,
useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const getCurrentUser = async () => {
try {
const { data } = await api.get("/auth/me");
setUser(data.user);
} catch (error) {
setUser(null);
console.error(
"Failed to load profile:",
error.response?.data || error.message
);
} finally {
setLoading(false);
}
};

getCurrentUser();


}, []);

return (
<AuthContext.Provider
value={{ user, setUser, loading }}
>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
