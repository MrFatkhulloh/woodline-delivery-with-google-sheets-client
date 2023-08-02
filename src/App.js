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
import Analytics from "./Pages/analytics/analytics";
import Debts from "./Pages/debts/debts";
import Producer from "./Pages/producer/producer";
import Warehouse from "./Pages/warehouse/warehouse";
import MainWarehouse from "./Pages/main-warehouse/main-warehouse";

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
        <Route path="/debts" element={<Debts />} />
        <Route path="/producer" element={<Producer />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/main-warehouse" element={<MainWarehouse />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
