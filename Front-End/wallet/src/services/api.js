import axios from "axios";

const api = axios.create({
  baseURL: "https://skill-wallet-test.vercel.app/api/",
  withCredentials: true,
});

export default api;
