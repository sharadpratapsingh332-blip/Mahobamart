import axios from "axios";

const api = axios.create({
  baseURL: "https://mahobamart.onrender.com/api",
  withCredentials: true,
});

export default api;