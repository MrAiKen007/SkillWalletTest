import axios from "axios";

const api = axios.create({
  baseURL: "https://skill-wallet-test.vercel.app/",
  withCredentials: true,
});

export default api;
