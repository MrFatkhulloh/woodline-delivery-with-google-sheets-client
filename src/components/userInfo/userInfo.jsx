import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Box,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import axios from "axios";

const UserInfo = ({ onClose, isOpen, onOpen, selectedCourier }) => {
  const { onOpen: a, isOpen: b, onClose: c } = useDisclosure();

  const {
    formData,
    setFormData,
    id,
    warehouseOrders,
    allModels,
    deliveryRow,
    token,
    state,
    setState,
  } = useContext(OpenModalContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value, id }));
  };

  const handleSubmit = () => {
    console.log(deliveryRow);
    if (loading) return;
    setLoading(true);

    axios
      .post(
        "/universal-delivery",
        {
          warehouseOrders,
          courierId: selectedCourier?.id,
          deliveryRow,
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(deliveryRow);
        setState(state + 1);
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        alert("Ощибка в сервере! Созвонитесь с разработчиком.");
        console.error(error);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Проверьте!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading>Курер</Heading>
            <Text>
              <span style={{ fontWeight: "bold" }}>Имя:</span>{" "}
              {selectedCourier?.name}
            </Text>
            <Heading>Данные о грузе</Heading>
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
                    <span style={{ fontWeight: "bold" }}>Кол-во:</span>{" "}
                    {order?.qty}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Вознаграждение:</span>{" "}
                    {accounting.formatNumber(
                      deliveryRow[orderIndex]?.price,
                      0,
                      " "
                    )}
                  </Text>
                </Box>
              ))}
            <Divider />
            <Heading>
              {/* Остаток: {accounting.formatNumber(allIncome - allPayment, 0, " ")} */}
            </Heading>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {loading ? "loading..." : "Сохранить"} {loading && <Spinner />}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInfo;
