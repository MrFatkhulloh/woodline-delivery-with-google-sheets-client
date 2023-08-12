import { useContext, useEffect, useState } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import {
  Box,
  Button,
  Flex,
  Heading,
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
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spacer,
  IconButton,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
  FormControl,
} from "@chakra-ui/react";
import {
  AddIcon,
  CheckCircleIcon,
  CheckIcon,
  MinusIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import axios from "axios";

function SearchModal({
  isOpen,
  onClose,
  onOpen,
  rowIndex,
  foundOrders,
  setFoundOrders,
}) {
  const { openFinal, d2cDeliveryRow, setD2cDeliveryRow, token } =
    useContext(OpenModalContext);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [state, setState] = useState(1);
  const [searchBy, setSearchBy] = useState("order_id");
  const [searchKey, setSearchKey] = useState("");
  const [indexSelected, setIndexSelected] = useState(999999999);

  const handleSubmit = () => {
    setSubmitLoading(true);
    const newDeliveryRow = d2cDeliveryRow.map((delivery, delivery_index) => {
      if (delivery_index == rowIndex) {
        return {
          ...delivery,
          order: foundOrders[indexSelected],
        };
      }
      return delivery;
    });
    // console.log(newDeliveryRow)
    setD2cDeliveryRow(newDeliveryRow);
    setFoundOrders([]);
    setIndexSelected(999999999);
    onClose();
  };

  const handleSearch = (value) => {
    if (loading) return;
    setLoading(true);
    if (searchBy == "order_id" || searchBy == "tissue") {
      axios
        .get(`/get-orders?${searchBy}=${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          setFoundOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          alert("database error");
          setLoading(false);
          console.error(error);
        });
    }
    if (searchBy == "deal_id") {
      axios
        .get(`/get-orders-by-deal_id?${searchBy}=${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          // console.log(response);
          setFoundOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          alert("database error");
          console.error(error);
        });
    }

    if (searchBy == "name" || searchBy == "phone") {
      axios
        .get(`/get-orders-by-client?${searchBy}=${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          setFoundOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          alert("database error");
          console.error(error);
        });
    }
    if (searchBy == "rest") {
      axios
        .get(`/get-orders-by-deal?${searchBy}=${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          setFoundOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          alert("database error");
          console.error(error);
        });
    }
    if (searchBy == "model") {
      axios
        .get(`/get-orders-by-model?${"model_name"}=${searchKey}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          setFoundOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          alert("database error");
          console.error(error);
        });
    }
  };

  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
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
                  defaultValue={searchBy}
                  placeholder="Искать по:"
                  onChange={(event) => setSearchBy(event.target.value)}
                >
                  <option value={"order_id"}>ID</option>
                  <option value={"deal_id"}>номер сделки </option>
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
                  onChange={(event) => setSearchKey(event.target.value)}
                />
                <IconButton
                  aria-label="Search database"
                  icon={!loading ? <SearchIcon /> : <Spinner />}
                  onClick={(event) => {
                    setIndexSelected(999999999);
                    handleSearch(searchKey);
                  }}
                />
              </Flex>
            </Flex>
            <Divider />
            <Flex wrap={"wrap"} overflow={"auto"} gap={"20px"} height={"400px"}>
              {foundOrders?.length ? (
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
                        icon={
                          indexSelected == orderIndex ? (
                            <CheckIcon />
                          ) : (
                            <AddIcon />
                          )
                        }
                        onClick={() => {
                          setIndexSelected(orderIndex);
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
              )}
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
              isDisabled={indexSelected > 1000}
              colorScheme="blue"
              spinner={<Spinner color="white" />}
              mr={3}
              onClick={() => {
                handleSubmit();
              }}
            >
              Сохранить
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SearchModal;
