import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import accounting from "accounting";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import UserInfo from "../userInfo/userInfo";
import { D2COrderRow, OrderRow } from "./orderRow";

function D2wOrderTable({ selectedCourier, setSelectedCourier }) {
  const {
    warehouseOrders,
    setWarehouseOrders,
    types,
    allModels,
    state: hook,
    setState: setHook,
    deliveryRow,
    setDeliveryRow,
    courier,
  } = useContext(OpenModalContext);
  //   const [delivery_type, setDelivery_type] = useState("");
  const [state, setState] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const mappedData = warehouseOrders.map((e) => {
      return {
        ...e,
        sum: e.price * e.qty * (1 - e.sale * 0.01),
      };
    });
    setWarehouseOrders(mappedData);
  }, [state]);

  const cathegoryOptions = ["заказ", "продажа с витрины", "продажа со склада"];
  const modelOptions = allModels;

  const handleCoruier = (value) => {
    const foundCourier = courier.find((c) => c?.id == value);
    if (!foundCourier) return;
    setSelectedCourier(foundCourier);
  };

  const handleMinus = (index) => {
    warehouseOrders.splice(index, 1);
    const newRow = warehouseOrders.map((e, i) => {
      return {
        ...e,
        id: i + 1,
      };
    });
    setWarehouseOrders(newRow);
  };

  const handlePlus = () => {
    const myUuid = uuidv4();
    deliveryRow.push({
      id: deliveryRow.length + 1,
      price: 0,
      order_id: myUuid,
      title: "",
    });
    warehouseOrders.push({
      id: warehouseOrders.length + 1,
      cathegory: "",
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
    });
    setDeliveryRow(deliveryRow);
    setWarehouseOrders(warehouseOrders);
    setState(state + 1);
  };

  const handleSubmit = () => {
    // setHook(hook + 1);
    const dangerousData = warehouseOrders.find(
      (orderRow) => orderRow.type == "" || orderRow.model == ""
    );
    if (dangerousData) {
      return alert(
        `Вы не выбрали тип или модель на строке ${dangerousData.id}.`
      );
    }
    return onOpen();
  };

  function handleDeliveryChange(event, rowId, fieldName) {
    const updatedRows = deliveryRow.map((row) => {
      if (row.id == rowId) {
        if (fieldName == "delivery_date") {
          return {
            ...row,
            [fieldName]: new Date(event.target.value).getTime(),
          };
        }
        return {
          ...row,
          [fieldName]: accounting.unformat(event.target.value),
        };
      } else {
        return row;
      }
    });
    setDeliveryRow(updatedRows);
  }

  function handleChange(event, rowId, fieldName) {
    console.log(event.target.value, rowId, fieldName, "changeFn");
    const updatedRows = warehouseOrders.map((row) => {
      if (row.id == rowId) {
        if (fieldName == "price") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["sum"]: Math.round(
              accounting.unformat(event.target.value) *
                row.qty *
                (1 - row.sale * 0.01)
            ),
            ["sale"]:
              ((accounting.unformat(event.target.value) - row.sale_sum) /
                accounting.unformat(event.target.value)) *
              100,
          };
        }
        if (fieldName == "qty") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["sum"]: Math.round(
              row.price *
                accounting.unformat(event.target.value) *
                (1 - row.sale * 0.01)
            ),
          };
        }
        if (fieldName == "sale") {
          return {
            ...row,
            [fieldName]: event.target.value,
            ["sum"]: Math.round(
              row.price * row.qty * (1 - event.target.value * 0.01)
            ),
          };
        }
        if (fieldName == "sale_sum") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["sale"]:
              ((row.price - accounting.unformat(event.target.value)) /
                row.price) *
              100,
            ["sum"]: Math.round(
              row.price *
                row.qty *
                (1 -
                  ((row.price - accounting.unformat(event.target.value)) /
                    row.price) *
                    100 *
                    0.01)
            ),
          };
        }
        if (fieldName == "delivery_date") {
          return {
            ...row,
            ["delivery_date"]: new Date(event.target.value).getTime(),
          };
        } else {
          return {
            ...row,
            [fieldName]: event.target.value,
          };
        }
      } else {
        return row;
      }
    });
    setWarehouseOrders(updatedRows);
  }

  const { colorMode } = useColorMode();

  return (
    <>
      <UserInfo
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onOpen}
        selectedCourier={selectedCourier}
      />

      <TableContainer>
        <Table
          variant="simple"
          background={colorMode === "light" ? "#fff" : ""}
        >
          <Thead>
            <Tr>
              <Th>ID_______</Th>
              <Th>вид мебели</Th>
              <Th>модель</Th>
              <Th>ткань</Th>
              <Th>примечание</Th>
              <Th>кол-во</Th>
              <Th>вознаграждение</Th>
              <Th>номер рейса</Th>

              <Th>Дата доставки</Th>
              <Th>Удалить строка</Th>
            </Tr>
          </Thead>
          <Tbody>
            {warehouseOrders &&
              warehouseOrders.map((e, i) => {
                return (
                  <OrderRow
                    key={i}
                    i={i}
                    e={e}
                    handleChange={handleChange}
                    cathegoryOptions={cathegoryOptions}
                    typeOptions={types}
                    modelOptions={modelOptions}
                    allModels={allModels}
                    handleMinus={handleMinus}
                    deliveryRow={deliveryRow}
                    handleDeliveryChange={handleDeliveryChange}
                  />
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex alignItems="center" justifyContent="end" gap={"20px"} mx={3} my={5}>
        <Button colorScheme="cyan" onClick={handlePlus}>
          +
        </Button>
        <Button colorScheme="green" onClick={handleSubmit}>
          submit
        </Button>
      </Flex>
    </>
  );
}

export default D2wOrderTable;
