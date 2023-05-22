import { v4 as uuidv4 } from "uuid";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

const OpenModalContext = createContext();

function Provider({ children }) {
  const myUuid = uuidv4();
  const {
    onOpen: openFinal,
    isOpen: isOpenFinal,
    onClose: closeFinal,
  } = useDisclosure();
  const token = window.localStorage.getItem("token");
  const role = window.localStorage.getItem("role");
  const [id, setId] = useState("");
  function generateRandomNumber() {
    axios
      .get("/getId", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setId(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const [wallets, setWallets] = useState([]);
  const [courier, setCourier] = useState([]);
  const [state, setState] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [types, setTypes] = useState([]);
  const [orderShow, setOrderShow] = useState(true);
  const [userDataModal, setUserDataModal] = useState(false);
  const [d2cDeliveryRow, setD2cDeliveryRow] = useState([
    {
      id: 1,
      price: 0,
      order: {},
      title: "",
    },
  ]);
  const [deliveryRow, setDeliveryRow] = useState([
    {
      id: 1,
      price: 0,
      order_id: myUuid,
      title: "",
    },
  ]);
  const [paymentRow, setPaymentRow] = useState([
    {
      id: 1,
      payment_type: "",
      payment_sum: 0,
      payment_$: 0,
      kurs: 0,
      amount_by_kurs: 0,
      change: 0,
      total_sum: 0,
      rest_money: 0,
      deal_id: "",
      order_id: "",
      wallet_id: "",
    },
  ]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [allModels, setAllModels] = useState([]);
  const [warehouseOrders, setWarehouseOrders] = useState([
    {
      id: 1,
      cathegory: "from delivery",
      orderId: "",
      type: "",
      model: "",
      tissue: "",
      title: "",
      price: 0,
      sale: 0,
      qty: 0,
      sum: 0,
      sale_sum: 0,
      is_first: false,
      status: "ready",
      uuid: myUuid,
    },
  ]);
  const [formData, setFormData] = useState({
    id,
    clientName: "",
    phone: "",
    whereFrom: "инста",
    status: "первая покупка",
    seller: "",
    deliveryDate: "",
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    generateRandomNumber();
    axios
      .get("/furniture-type", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/models-with-type", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setAllModels(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/wallet", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setWallets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/get-couriers", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setCourier(response?.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    const myUuidInUseEffect = uuidv4();
    generateRandomNumber();
    axios
      .get("/furniture-type", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/wallet", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setWallets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("/models-with-type", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setAllModels(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setWarehouseOrders([
      {
        id: 1,
        cathegory: "from delivery",
        orderId: "",
        type: "",
        model: "",
        tissue: "",
        title: "",
        price: 0,
        sale: 0,
        qty: 0,
        sum: 0,
        sale_sum: 0,
        is_first: false,
        status: "ready",
        uuid: myUuidInUseEffect,
      },
    ]);
    setDeliveryRow([
      {
        id: 1,
        price: 0,
        order_id: myUuidInUseEffect,
        title: "",
      },
    ]);
  }, [state]);

  return (
    <OpenModalContext.Provider
      value={{
        isOpenModal,
        setIsOpenModal,
        setOpenApply,
        openApply,
        loginOpen,
        setLoginOpen,
        orderShow,
        setOrderShow,
        input,
        setInput,
        userDataModal,
        setUserDataModal,
        paymentRow,
        setPaymentRow,
        paymentModal,
        setPaymentModal,
        warehouseOrders,
        setWarehouseOrders,
        formData,
        setFormData,
        generateRandomNumber,
        token,
        role,
        id,
        setId,
        types,
        setTypes,
        allModels,
        setAllModels,
        openFinal,
        isOpenFinal,
        closeFinal,
        state,
        setState,
        deliveryRow,
        setDeliveryRow,
        d2cDeliveryRow,
        setD2cDeliveryRow,
        courier,
        wallets,
        setWallets,
      }}
    >
      {children}
    </OpenModalContext.Provider>
  );
}

export { OpenModalContext, Provider };
