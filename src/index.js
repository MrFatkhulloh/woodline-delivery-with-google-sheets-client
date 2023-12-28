import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider as ModalProvider } from "./Contexts/ModalContext/ModalContext";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer as Toastify } from "react-toastify";
import ModalForm from "./components/applyForm/applyForm";
// axios.defaults.baseURL = "https://apiv1.woodlines.shop";
// axios.defaults.baseURL = "https://mirabdullo.backend4devs.uz";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ModalProvider>
                <ChakraProvider
                    toastOptions={{ defaultOptions: { position: "top" } }}
                >
                    <Toastify autoClose={3000} />
                    <App />
                </ChakraProvider>
            </ModalProvider>
        </BrowserRouter>
    </React.StrictMode>
);
