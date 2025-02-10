import axios from "axios";
import { BASE_URL } from "./api";

const axiosIntense = axios.create({
  baseURL: `${BASE_URL}api`,
  withCredentials: true,
});

export default axiosIntense;
