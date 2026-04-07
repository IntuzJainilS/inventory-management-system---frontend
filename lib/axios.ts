import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_backend_base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
