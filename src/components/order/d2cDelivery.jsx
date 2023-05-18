import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Text,
  Spacer,
  Box,
  Spinner,
} from "@chakra-ui/react";
import accounting from "accounting";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import UserInfo from "../userInfo/userInfo";
import { D2COrderRow, OrderRow } from "./orderRow";
import SearchModal from "../search/search";
import PaymentTable from "../payment/payment";
import axios from "axios";

function D2cOrderTable({ delivery_type, selectedCourier, setSelectedCourier }) {
  const {
    types,
    allModels,
    state: hook,
    setState: setHook,
    d2cDeliveryRow,
    setD2cDeliveryRow,
    courier,
    paymentRow,
    setPaymentRow,
    token,
  } = useContext(OpenModalContext);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(1);
  const [payState, setPayState] = useState(1);
  const [deliveryIndex, setDeliveryIndex] = useState(0);
  const [foundOrders, setFoundOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [temporaryPaymentRow, setTemporaryPaymentRow] = useState([
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
    },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPayment,
    onOpen: onOpenPayment,
    onClose: onClosePayment,
  } = useDisclosure();

  const handleReloadD2c = () => {
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
      },
    ]);

    setD2cDeliveryRow([
      {
        id: 1,
        price: 0,
        order: {},
        title: "",
      },
    ]);

    setSelectedOrder({});
    setSelectedCourier({
      id: "someId",
      name: "some name",
    });
  };

  useEffect(() => {
    const mappedData = d2cDeliveryRow.map((e) => {
      return {
        ...e,
        sum: e.price * e.qty * (1 - e.sale * 0.01),
      };
    });
    setD2cDeliveryRow(mappedData);
  }, [state]);

  useEffect(() => {
    const filteredRow = paymentRow.filter(
      (row) => row?.order_id == selectedOrder?.id
    );
    if (filteredRow?.length) {
      setTemporaryPaymentRow(
        filteredRow.map((row, row_index) => {
          return {
            ...row,
            id: row_index + 1,
          };
        })
      );
    } else {
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
        },
      ]);
    }
    if (selectedOrder?.id) {
      onOpenPayment();
    }
  }, [selectedOrder, payState]);

  const cathegoryOptions = ["заказ", "продажа с витрины", "продажа со склада"];
  const modelOptions = allModels;

  const handleSelectModel = (index) => {
    setDeliveryIndex(index);
    onOpen();
  };

  const handleSelectPayment = (index) => {
    setSelectedOrder(d2cDeliveryRow[index]?.order);
    setPayState(payState + 1);
  };

  const handleCoruier = (value) => {
    const foundCourier = courier.find((c) => c?.id == value);
    if (!foundCourier) return;
    setSelectedCourier(foundCourier);
  };

  const handleMinus = (index) => {
    d2cDeliveryRow.splice(index, 1);
    const newRow = d2cDeliveryRow.map((e, i) => {
      return {
        ...e,
        id: i + 1,
      };
    });
    setD2cDeliveryRow(newRow);
  };

  const handlePlus = () => {
    d2cDeliveryRow.push({
      id: d2cDeliveryRow.length + 1,
      price: 0,
      order: {},
      title: "",
    });
    setD2cDeliveryRow(d2cDeliveryRow);
    setState(state + 1);
  };

  const handleSubmit = () => {
    if (loading) return;
    if (!selectedCourier?.phone) return alert("select the courier!");
    setLoading(true);
    axios
      .post(
        "/universal-d2c-delivery",
        {
          delivery_row: d2cDeliveryRow,
          courier: selectedCourier?.id,
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
      })
      .catch((error) => {
        alert("Ощибка в сервере! Созвонитесь с разработчиком.");
        console.error(error);
      });
  };

  function handleDeliveryChange(event, rowId, fieldName) {
    const updatedRows = d2cDeliveryRow.map((row) => {
      if (row.id == rowId) {
        return {
          ...row,
          [fieldName]: accounting.unformat(event.target.value),
        };
      } else {
        return row;
      }
    });
    setD2cDeliveryRow(updatedRows);
  }

  function handleChange(event, rowId, fieldName) {
    const updatedRows = d2cDeliveryRow.map((row) => {
      if (row.id == rowId) {
        if (fieldName == "price") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
          };
        }
        return {
          ...row,
          [fieldName]: event.target.value,
        };
      } else {
        return row;
      }
    });
    setD2cDeliveryRow(updatedRows);
  }

  return (
    <>
      <SearchModal
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onOpen}
        selectedCourier={selectedCourier}
        rowIndex={deliveryIndex}
        foundOrders={foundOrders}
        setFoundOrders={setFoundOrders}
      />

      <PaymentTable
        onClose={onClosePayment}
        isOpen={isOpenPayment}
        onOpen={onOpenPayment}
        selectedCourier={selectedCourier}
        rowIndex={deliveryIndex}
        foundOrders={foundOrders}
        setFoundOrders={setFoundOrders}
        temporaryPaymentRow={temporaryPaymentRow}
        setTemporaryPaymentRow={setTemporaryPaymentRow}
        selectedOrder={selectedOrder}
      />

      <TableContainer display={delivery_type == "deliver to client" || "none"}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID_______</Th>
              <Th>Остаток</Th>
              <Th>оплатили</Th>
              <Th>примечание</Th>
              <Th>вознаграждение</Th>
              <Th>Удалить строка</Th>
            </Tr>
          </Thead>
          <Tbody>
            {d2cDeliveryRow &&
              d2cDeliveryRow.map((e, i) => {
                return (
                  <D2COrderRow
                    key={i}
                    i={i}
                    e={e}
                    handleChange={handleChange}
                    cathegoryOptions={cathegoryOptions}
                    typeOptions={types}
                    modelOptions={modelOptions}
                    allModels={allModels}
                    handleMinus={handleMinus}
                    d2cDeliveryRow={d2cDeliveryRow}
                    handleDeliveryChange={handleDeliveryChange}
                    handleSelectModel={handleSelectModel}
                    setFoundOrders={setFoundOrders}
                    handleSelectPayment={handleSelectPayment}
                  />
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        alignItems="center"
        justifyContent="space-between"
        mx={3}
        my={5}
        display={delivery_type == "deliver to client" || "none"}
      >
        <Button onClick={handlePlus}>+</Button>
        <Button style={{ float: "right" }} onClick={handleSubmit}>
          {loading ? "loading..." : "submit"} {loading && <Spinner />}
        </Button>
      </Flex>
    </>
  );
}

export default D2cOrderTable;
