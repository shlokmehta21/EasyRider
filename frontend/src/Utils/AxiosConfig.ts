import axios, { AxiosInstance as Axios } from "axios";

const AxiosInstance: Axios = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default AxiosInstance;
