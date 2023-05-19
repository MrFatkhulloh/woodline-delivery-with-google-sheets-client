import axios from "axios";

const token = window.localStorage.getItem("token");

export const instance = axios.create({
  baseURL: "http://64.226.90.160:9090",
  // baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
    token: `${token}`,
  },
});
