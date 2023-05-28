import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider as ModalProvider } from "./Contexts/ModalContext/ModalContext";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// axios.defaults.baseURL = "http://localhost:9090";
axios.defaults.baseURL = "http://64.226.90.160:9090";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <ChakraProvider>
          <ToastContainer autoClose={3000} />
          <App />
        </ChakraProvider>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
