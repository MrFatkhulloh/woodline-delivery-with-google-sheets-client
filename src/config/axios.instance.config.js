import axios from "axios";

const token = window.localStorage.getItem("token");

export const instance = axios.create({
  // baseURL: "https://fatkhullo.backend4devs.uz", 
    baseURL: "https://mirabdullo.backend4devs.uz", 

  headers: {
    "Content-Type": "application/json",
    token: `${token}`,
  },
});


// /order-update/:order
