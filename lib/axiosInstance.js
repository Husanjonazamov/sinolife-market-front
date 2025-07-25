// lib/axiosInstance.js
import axios from 'axios';
import BASE_URL from "../app/config";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
