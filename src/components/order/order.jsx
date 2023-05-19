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
} from "@chakra-ui/react";
import accounting from "accounting";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import UserInfo from "../userInfo/userInfo";
import { D2COrderRow, OrderRow } from "./orderRow";
import D2cOrderTable from "./d2cDelivery";
import D2wOrderTable from "./d2wDelivery";

// function OrderRow({
//   i,
//   e,
//   handleChange,
//   deliveryRow,
//   cathegoryOptions,
//   typeOptions,
//   modelOptions,
//   allModels,
//   handleMinus,
//   handleDeliveryChange,
// }) {
//   const [models, setModels] = useState(modelOptions);
//   const filterModels = (selectType) => {
//     const filteredModels = allModels.filter((e) => e.type == selectType);
//     setModels(filteredModels);
//   };
//   return (
//     <Tr>
//       <Td>
//         {e.cathegory == "заказ" ? (
//           <Input
//             type="text"
//             placeholder={"авто"}
//             value={e.orderId}
//             disabled={true}
//             id={e.id}
//             onChange={(event) =>
//               handleChange(event, event.target.id, "orderId")
//             }
//             onBlur={(event) => {
//               handleChange(event, event.target.id, "orderId");
//             }}
//           />
//         ) : (
//           <Input
//             maxLength={7}
//             w={"200px"}
//             type="text"
//             placeholder={e.cathegory == "заказ" ? "авто" : "id"}
//             value={e.orderId}
//             id={e.id}
//             onChange={(event) =>
//               handleChange(event, event.target.id, "orderId")
//             }
//             onBlur={(event) => {
//               handleChange(event, event.target.id, "orderId");
//             }}
//           />
//         )}
//       </Td>
//       <Td>
//         {" "}
//         <Select
//           w={"200px"}
//           placeholder="Выберите вид..."
//           name="type"
//           value={e.type}
//           id={e.id}
//           onChange={(event) => {
//             handleChange(event, event.target.id, "type");
//             filterModels(event.target.value);
//           }}
//           onBlur={(event) => {
//             handleChange(event, event.target.id, "type");
//             filterModels(event.target.value);
//           }}
//         >
//           {typeOptions.map((el, ind) => (
//             <option key={ind} value={el.name}>
//               {el.name}
//             </option>
//           ))}
//         </Select>
//       </Td>
//       <Td>
//         <Select
//           w={"200px"}
//           placeholder="Выберите модель..."
//           name="model"
//           id={e.id}
//           value={e.model}
//           onChange={(event) => handleChange(event, event.target.id, "model")}
//           onBlur={(event) => handleChange(event, event.target.id, "model")}
//         >
//           {models.map((el, ind) => (
//             <option key={ind} value={el.id}>
//               {el.name}
//             </option>
//           ))}
//         </Select>
//       </Td>
//       <Td>
//         <Input
//           w={"200px"}
//           placeholder="ТКАНЬ..."
//           type="text"
//           id={e.id}
//           value={e.tissue}
//           onChange={(event) => handleChange(event, event.target.id, "tissue")}
//           onBlur={(event) => handleChange(event, event.target.id, "tissue")}
//         />
//       </Td>
//       <Td>
//         <Input
//           w={"200px"}
//           type="text"
//           id={e.id}
//           value={e.title}
//           onChange={(event) => handleChange(event, event.target.id, "title")}
//           onBlur={(event) => handleChange(event, event.target.id, "title")}
//         />
//       </Td>
//       <Td>
//         <Input
//           w={"200px"}
//           type="number"
//           id={e.id}
//           value={accounting.unformat(e.qty)}
//           onChange={(event) => handleChange(event, event.target.id, "qty")}
//           onBlur={(event) => handleChange(event, event.target.id, "qty")}
//         />
//       </Td>
//       <Td>
//         <Input
//           w={"200px"}
//           type="text"
//           id={e.id}
//           value={accounting.formatNumber(deliveryRow[i]?.price, 0, " ")}
//           onChange={(event) =>
//             handleDeliveryChange(event, event.target.id, "price")
//           }
//         />
//       </Td>
//       <Td>
//         <Button onClick={() => handleMinus(i)}>-</Button>
//       </Td>
//     </Tr>
//   );
// }

function OrderTable() {
  const {
    warehouseOrders,
    setWarehouseOrders,
    setOrderShow,
    setOpenApply,
    types,
    allModels,
    state: hook,
    setState: setHook,
    deliveryRow,
    setDeliveryRow,
    courier,
  } = useContext(OpenModalContext);
  const [selectedCourier, setSelectedCourier] = useState({
    id: "someId",
    name: "some name",
  });
  const [delivery_type, setDelivery_type] = useState("");
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
    setHook(hook + 1);
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
        return {
          ...row,
          [fieldName]: event.target.value,
        };
      } else {
        return row;
      }
    });
    setWarehouseOrders(updatedRows);
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Spacer />
        <Flex flex={1}>
          <Box>
            <Text>Вид доставки:</Text>
            <Select
              placeholder="Выберите ..."
              mr={4}
              onChange={(element) => setDelivery_type(element.target.value)}
            >
              <option value="deliver to warehouse">доставка на склад</option>
              <option value="deliver to client">доставка к клиенту</option>
            </Select>
          </Box>
          <Spacer />
          <Box>
            <Text>Курьер:</Text>
            <Select
              placeholder="Выберите ..."
              onChange={(event) => handleCoruier(event.target.value)}
              defaultValue={selectedCourier?.name}
            >
              {courier.length &&
                courier.map((c, ci) => (
                  <option value={c?.id} key={ci}>
                    {c?.name}
                  </option>
                ))}
            </Select>
          </Box>
        </Flex>
        <Spacer />
        <Button
          onClick={() => {
            setOpenApply(true);
            setOrderShow(false);
          }}
        >
          Подача заявки на оплату
        </Button>
      </Flex>

      <D2wOrderTable
        delivery_type={delivery_type}
        selectedCourier={selectedCourier}
        setSelectedCourier={setSelectedCourier}
      />

      <D2cOrderTable
        delivery_type={delivery_type}
        selectedCourier={selectedCourier}
        setSelectedCourier={setSelectedCourier}
      />
    </>
  );
}

export default OrderTable;
