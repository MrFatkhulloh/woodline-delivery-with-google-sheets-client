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
} from "@chakra-ui/react";
import {
  AddIcon,
  CheckCircleIcon,
  CheckIcon,
  MinusIcon,
  Search2Icon,
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
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mx={5}>Search modal</ModalHeader>
          <ModalCloseButton mx={5} />
          <ModalBody>
            <Heading ml={5} my={5} variant="h2" size="lg">
              <Flex
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                wrap={"wrap"}
              >
                <Flex wrap={"wrap"} m={2}>
                  <Text minWidth={200}>Search by:</Text>
                  <Select
                    placeholder="Select..."
                    minWidth={200}
                    maxWidth={350}
                    onChange={(event) => setSearchBy(event.target.value)}
                  >
                    <option value={"order_id"}>ID</option>
                    <option value={"name"}>client_name</option>
                    <option value={"phone"}>client_phone</option>
                    <option value={"model"}>model</option>
                    <option value={"tissue"}>tissue</option>
                    <option value={"rest"}>rest</option>
                  </Select>
                </Flex>
                <Spacer />
                <Flex>
                  <Input
                    mr={2}
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
                <Spacer />
              </Flex>
            </Heading>
            <Divider />
            <Flex wrap={"wrap"}>
              {foundOrders?.length ? (
                foundOrders.map((foundOrder, orderIndex) => (
                  <Card m={2} variant={"outline"} key={orderIndex}>
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
                <Card m={2} variant={"outline"}>
                  <CardHeader>
                    <Heading size="md">123456</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text maxWidth={300}>
                      View a summary of all your customers over the last month.
                      Some another title here to broaden
                    </Text>
                  </CardBody>
                  <CardFooter>
                    <Button>View here</Button>
                  </CardFooter>
                </Card>
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
              isLoading={indexSelected > 1000}
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
