import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginModal from "./components/login/login";
import { useContext, useEffect } from "react";
import Order from "./Pages/Order";
import MyOrders from "./Pages/MyOrders";
import Admin from "./Pages/Admin/main/Admin";
import NotFoundPage from "./Pages/404/404";
import LastModal from "./components/checkupModal/checkupModal";
import { OpenModalContext } from "./Contexts/ModalContext/ModalContext";
import PaySalary from "./Pages/pay-salary/pay-salary";
import Companys from "./Pages/companys/companys";
import Wallets from "./Pages/wallets/wallets";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const token = window.localStorage.getItem("token");

function App() {
  const { closeFinal, openFinal, isOpenFinal } = useContext(OpenModalContext);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      handleNavigate();
    }
  }, []);

  return (
    <div className="App">
      <LastModal onClose={closeFinal} isOpen={isOpenFinal} onOpen={openFinal} />
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/pay-salary" element={<PaySalary />} />
        <Route path="/companys" element={<Companys />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;