import axios from "axios";

const api = axios.create({
  baseURL: "https://mahobamart.onrender.com",
  withCredentials: true,
});

export default api;