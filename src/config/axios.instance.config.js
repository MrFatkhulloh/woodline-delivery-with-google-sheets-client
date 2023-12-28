import axios from "axios";

const token = window.localStorage.getItem("token");

export const instance = axios.create({
    // baseURL: "https://apiv1.woodlines.shop",
    // baseURL: "https://mirabdullo.backend4devs.uz",
    headers: {
        "Content-Type": "application/json",
        token: `${token}`,
    },
});
