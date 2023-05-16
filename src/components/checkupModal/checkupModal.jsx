import {
  Box,
  Button,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import accounting from "accounting";

const LastModal = ({ onClose, isOpen, onOpen }) => {
  const timeoutRef = useRef(null);
  const [allIncome, setAllIncome] = useState(0);
  const [allPayment, setAllPayment] = useState(0);
  const navigate = useNavigate();
  const {
    formData,
    warehouseOrders,
    paymentRow,
    allModels,
    token,
    setFormData,
    setPaymentRow,
    setWarehouseOrders,
    id,
    setId,
  } = useContext(OpenModalContext);

  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (!ready) {
      timeoutRef.current = setTimeout(() => {
        alert(
          "Загрузка занимает более 7 секунд. Попробуйте проверить, был ли выполнен ваш запрос, или проверьте соединение с Интернетом!"
        );
        handleReload();
        navigate("/my-orders");
      }, 1000 * 7);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [ready]);

  useEffect(() => {
    const income = warehouseOrders.reduce((a, b) => {
      return a + Number(b?.sum);
    }, 0);
    setAllIncome(income);
  }, [warehouseOrders]);

  useEffect(() => {
    const payment = paymentRow.reduce((a, b) => {
      return (
        a +
        Number(b?.payment_sum) +
        Number(b?.amount_by_kurs) -
        Number(b?.change)
      );
    }, 0);
    setAllPayment(payment);
  }, [paymentRow]);

  const handleReload = () => {
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
    setFormData({
      id,
      clientName: "",
      phone: "",
      whereFrom: "инста",
      status: "первая покупка",
      seller: "",
      deliveryDate: "",
    });
    setWarehouseOrders([
      {
        id: 1,
        cathegory: "",
        orderId: "",
        type: "",
        model: "",
        tissue: "",
        title: "-",
        price: 0,
        sale: 0,
        qty: 0,
        sum: 0,
        sale_sum: 0,
      },
    ]);
    setPaymentRow([
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
      },
    ]);
    onClose();
    setReady(true);
  };

  const handleSubmit = () => {
    if (!ready) return;
    setReady(false);
    axios
      .post(
        "/universal",
        {
          data: { warehouseOrders, formData, paymentRow },
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // window.location.reload();
          // clearTimeout(timeoutRef);
          handleReload();
        } else {
          alert("Ощибка в сервере! Созвонитесь с разработчиком.");
          setReady(true);
          onClose();
        }
      })
      .catch((error) => {
        alert("Ощибка в сервере! Созвонитесь с разработчиком.");
        // window.location.reload();
        handleReload();
        console.error(error);
      });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="outside"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Проверьте!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading>данные о клиенте</Heading>
            <Text>
              <span style={{ fontWeight: "bold" }}>Имя:</span>{" "}
              {formData?.clientName}
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>Номер телефона:</span>{" "}
              {formData?.phone}
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>откуда пришёл:</span>{" "}
              {formData?.whereFrom}
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>дата доставки:</span>{" "}
              {formData?.deliveryDate}
            </Text>
            <Heading>Данные о заказе</Heading>
            {warehouseOrders.length &&
              warehouseOrders.map((order, orderIndex) => (
                <Box key={orderIndex}>
                  <Divider />
                  <Text>
                    <span style={{ fontWeight: "bold" }}>ID:</span>{" "}
                    {order?.cathegory == "заказ"
                      ? formData?.id
                      : order?.orderId}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Категория:</span>{" "}
                    {order?.cathegory}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Вид мебели:</span>{" "}
                    {order?.type}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Модель:</span>{" "}
                    {allModels.find((model) => model?.id == order?.model)?.name}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Ткань:</span>{" "}
                    {order?.tissue}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>примечание:</span>{" "}
                    {order?.title}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Цена:</span>{" "}
                    {accounting.formatNumber(order?.price, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Скидка:</span>{" "}
                    {Math.round(order?.sale * 100) / 100} %
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Кол-во:</span>{" "}
                    {order?.qty}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Сумма:</span>{" "}
                    {accounting.formatNumber(order?.sum, 0, " ")}
                  </Text>
                </Box>
              ))}
            <Heading>Предоплата</Heading>
            {paymentRow.length &&
              paymentRow.map((payment, paymentIndex) => (
                <Box key={paymentIndex}>
                  <Divider />
                  <Text fontSize={"1xl"}>{paymentIndex + 1}</Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Вид оплаты:</span>{" "}
                    {payment?.payment_type}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>сум:</span>{" "}
                    {accounting.formatNumber(payment?.payment_sum, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>доллар$:</span>{" "}
                    {accounting.formatNumber(payment?.payment_$, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>
                      Курс 100 доллара:
                    </span>{" "}
                    {accounting.formatNumber(payment?.kurs, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Сумма по курсу:</span>{" "}
                    {accounting.formatNumber(payment?.amount_by_kurs, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Здачи:</span>{" "}
                    {accounting.formatNumber(payment?.change, 0, " ")}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Общая сумма:</span>{" "}
                    {accounting.formatNumber(payment?.total_sum, 0, " ")}
                  </Text>
                </Box>
              ))}
            <Divider />
            <Heading>
              Остаток: {accounting.formatNumber(allIncome - allPayment, 0, " ")}
            </Heading>
          </ModalBody>

          <ModalFooter>
            <Button
              id="my_button"
              colorScheme="blue"
              mr={3}
              onMouseDown={handleSubmit}
              onTouchStart={handleSubmit}
              onClick={handleSubmit}
            >
              {!ready ? "loading..." : "Правильно"}
              <Spinner display={!ready ? "block" : "none"} />
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Не правильно
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LastModal;
