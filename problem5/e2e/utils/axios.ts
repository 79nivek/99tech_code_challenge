import axios from "axios";
import { E2E_CONFIG } from "../config";

export const axiosInstance = axios.create({
  baseURL: `${E2E_CONFIG.BASE_URL}/api/v1`,
});

