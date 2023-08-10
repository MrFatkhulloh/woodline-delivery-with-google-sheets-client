import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Text,
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
import { SearchIcon } from "@chakra-ui/icons";

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
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();

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
      {/* search Modal */}
      <Modal size="2xl" isOpen={modalIsOpen} onClose={modalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Искать</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={"15px"}
              mb={"15px"}
            >
              <FormControl>
                <Select
                  // defaultValue={searchBy}
                  placeholder="Искать по:"
                  // onChange={(event) => setSearchBy(event.target.value)}
                >
                  <option value={"order_id"}>ID</option>
                  <option value={"name"}>имя клиента</option>
                  <option value={"phone"}>Телефон</option>
                  <option value={"model"}>Модель</option>
                  <option value={"tissue"}>Ткань</option>
                  <option value={"rest"}>Остаток</option>
                </Select>
              </FormControl>

              <Flex gap={2}>
                <Input
                  placeholder="Поиск"
                  w={"100%"}
                  // onChange={(event) => setSearchKey(event.target.value)}
                />
                <IconButton
                  aria-label="Search database"
                  icon={<SearchIcon />}
                  // icon={!loading ? <SearchIcon /> : <Spinner />}
                  onClick={(event) => {
                    // setIndexSelected(999999999);
                    // handleSearch(searchKey);
                  }}
                />
              </Flex>
            </Flex>
            <Divider />
            <Flex wrap={"wrap"} overflow={"auto"} gap={"20px"} height={"400px"}>
              {/* {foundOrders?.length ? (
                foundOrders.map((foundOrder, orderIndex) => (
                  <Card
                    width={"100%"}
                    maxWidth={"280px"}
                    variant={"outline"}
                    key={orderIndex}
                  >
                    <CardHeader p={2}>
                      <Heading size="md">{foundOrder?.order_id}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text maxWidth={300}>
                        <span style={{ fontWeight: "bold" }}>Имя:</span>{" "}
                        {foundOrder?.deal?.client?.name}
                      </Text>
                      <Text maxWidth={300}>
                        <span style={{ fontWeight: "bold" }}>Телефон:</span>{" "}
                        {foundOrder?.deal?.client?.phone}
                      </Text>
                      <Text maxWidth={300}>
                        <span style={{ fontWeight: "bold" }}>Модель:</span>{" "}
                        {foundOrder?.model?.name}
                      </Text>
                      <Text maxWidth={300}>
                        <span style={{ fontWeight: "bold" }}>Ткань:</span>{" "}
                        {foundOrder?.tissue}
                      </Text>
                      <Text maxWidth={300}>
                        <span style={{ fontWeight: "bold" }}>Остаток:</span>{" "}
                        {foundOrder?.deal?.rest
                          ? accounting.formatNumber(
                              foundOrder?.deal?.rest,
                              0,
                              " "
                            ) + " sum"
                          : "not found!"}
                      </Text>
                    </CardBody>
                    <CardFooter>
                      <IconButton
                        aria-label="Search database"
                        // icon={
                        //   indexSelected == orderIndex ? (
                        //     <CheckIcon />
                        //   ) : (
                        //     <AddIcon />
                        //   )
                        // }
                        onClick={() => {
                          // setIndexSelected(orderIndex);
                          // setFoundOrders(foundOrders);
                        }}
                      />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Heading textAlign={"center"}>
                    Пока нечего не найдено 😐 побробуйте искать 🔎 заново
                  </Heading>
                </Flex>
              )} */}
              <Flex alignItems={"center"} justifyContent={"center"}>
                <Heading textAlign={"center"}>
                  Пока нечего не найдено 😐 побробуйте искать 🔎 заново
                </Heading>
              </Flex>
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              my={5}
              mx={5}
              className="footer_buttons"
            ></Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              // isDisabled={indexSelected > 1000}
              colorScheme="blue"
              // spinner={<Spinner color="white" />}
              mr={3}
              onClick={() => {
                // handleSubmit();
              }}
            >
              Сохранить
            </Button>
            <Button variant="ghost" onClick={modalOnClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ============= */}
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
              <Th>ИД </Th>
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
                    onOpen={modalOnOpen}
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
          Отправить
        </Button>
      </Flex>
    </>
  );
}

export default D2wOrderTable;
