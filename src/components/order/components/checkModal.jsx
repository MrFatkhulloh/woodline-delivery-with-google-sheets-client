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
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import accounting from "accounting";
import axios from "axios";
import { useContext, useState } from "react";
import { OpenModalContext } from "../../../Contexts/ModalContext/ModalContext";

function CheckUpModalDelivery({
  pRows,
  rows,
  isOpen,
  onClose,
  curier,
  setTemporaryPaymentRow,
  hook,
  setHook,
  setSelectedCourier,
}) {
  const [loading, setLoading] = useState(false);

  const {
    token,
    selectedOrder,
    paymentRow,
    setD2cDeliveryRow,
    setPaymentRow,

    setSelectedOrder,
  } = useContext(OpenModalContext);

  const handleReloadD2c = () => {
    const uuid = uuidv4();
    setTemporaryPaymentRow([
      {
        id: paymentRow?.length > 1 ? paymentRow.length + 1 : 1,
        payment_type: "",
        payment_sum: 0,
        payment_$: 0,
        kurs: 0,
        amount_by_kurs: 0,
        change: 0,
        total_sum: 0,
        rest_money: 0,
        deal_id: selectedOrder?.deal?.id ? selectedOrder?.deal?.id : "",
        order_id: selectedOrder?.id ? selectedOrder?.id : "",
        wallet_id: "",
        delivery_uuid: uuid,
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
        deal_id: "",
        order_id: "",
        delivery_uuid: uuid,
      },
    ]);

    setD2cDeliveryRow([
      {
        id: 1,
        price: 0,
        order: {},
        title: "",
        delivery_uuid: uuid,
      },
    ]);

    setSelectedOrder({});
    setSelectedCourier({
      id: "someId",
      name: "some name",
    });
  };

  const handleSubmit = () => {
    if (loading) return;
    if (!curier?.phone) return alert("select the courier!");
    setLoading(true);
    axios
      .post(
        "/universal-d2c-delivery",
        {
          delivery_row: rows,
          courier: curier?.id,
          paymentRow,
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setHook(hook + 1);
        handleReloadD2c();
        console.log(response?.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Ощибка в сервере! Созвонитесь с разработчиком.");
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
            <Heading size="md" my={2}>
              Курер: {curier?.name}
            </Heading>
            <Divider />
            <Heading size="lg" my={2}>
              Данные о грузе
            </Heading>

            {rows?.map((row, index) => (
              <Box
                borderRadius={"8px"}
                p={2}
                mt={2}
                border={"1px solid gray"}
                key={index}
              >
                <Text>ID: {row?.order?.order_id}</Text>
                <Text>модель: {row?.order?.model?.name}</Text>
                <Text>имя клиента: {row?.order?.deal?.client?.name}</Text>
                <Box>
                  <details>
                    <summary>платежи</summary>
                    {pRows
                      ?.filter((pr) => pr.delivery_uuid === row.delivery_uuid)
                      ?.map((pRow, i) => (
                        <Box p={1} mt={1} border={"1px solid gray"} key={i}>
                          <Text>способ оплаты: {pRow.payment_type}</Text>
                          <Text>
                            общая сумма платежа:{" "}
                            {accounting.formatNumber(pRow.total_sum, 0, " ")}
                          </Text>
                        </Box>
                      ))}
                  </details>
                </Box>
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              сохранять
            </Button>
            <Button variant="ghost" onClick={onClose}>
              закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CheckUpModalDelivery;
