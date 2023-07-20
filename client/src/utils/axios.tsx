import axios from "axios";

export const serverAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_ROOT_URL}/api/v1`,
});
