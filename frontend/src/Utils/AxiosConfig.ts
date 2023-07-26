import axios, { AxiosInstance as Axios } from "axios";

const AxiosInstance: Axios = axios.create({
  baseURL: "http://10.0.0.59:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default AxiosInstance;
