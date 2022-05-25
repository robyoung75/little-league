import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8001",
  withCredentials: true,
});

export const axioInstanceFormData = axios.create({
  baseURL: "http://localhost:8001",
  withCredentials: true,

  headers: {
    "Content-Type": "multipart/form-data",
  },
});
