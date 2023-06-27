import axios from "axios";

const token = window.localStorage.getItem("token");

export const instance = axios.create({
  baseURL: "https://fatkhullo.backend4devs.uz",
  // baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
    token: `${token}`,
  },
});
