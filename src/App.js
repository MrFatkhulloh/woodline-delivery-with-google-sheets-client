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
        <Route path="/login" element={<LoginModal />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
