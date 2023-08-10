import axios from "axios";

const token = window.localStorage.getItem("token");

export const instance = axios.create({
  // baseURL: "https://fatkhullo.backend4devs.uz",
  baseURL: "http://64.226.90.160:3005",
  headers: {
    "Content-Type": "application/json",
    token: `${token}`,
  },
});


// /order-update/:order
