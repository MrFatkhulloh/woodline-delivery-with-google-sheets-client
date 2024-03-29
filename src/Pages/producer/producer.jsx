import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { instance } from "../../config/axios.instance.config";
import moment from "moment";
import "moment/locale/ru";
import { toast } from "react-toastify";
import { FiMeh } from "react-icons/fi";
import accounting from "accounting";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import DynamicPagination from "../../components/pagin/pagin";
import { AddIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

const Producer = () => {
  const {
    isOpen: statusCheckIsOpen,
    onOpen: statusCheckOnOpen,
    onClose: statusCheckOnClose,
  } = useDisclosure();
  const {
    isOpen: addProductIsOpen,
    onOpen: addProductOnOpen,
    onClose: addProductOnClose,
  } = useDisclosure();
  const [addLoading, setAddLoading] = useState(false);
  const [type, setType] = useState();
  const { types, token } = useContext(OpenModalContext);

  const { colorMode } = useColorMode();
  const [reqIndex, setReqIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [reload, setReload] = useState(false);
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState();
  const [changeLoading, setChangeLoading] = useState(false);
  const [productData, setProductData] = useState();
  const { role } = useContext(OpenModalContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState();

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    instance
      .get(
        `/get-order-by-status?status=${
          reqIndex === 0 ? "NEW" : reqIndex === 1 ? "ACCEPTED" : "REJECTED"
        }&page=${page}?limit=${limit}&search=${searchValue}`
      )
      .then((res) => {
        setOrders(res.data);
        setTotalCount(res?.data?.totalAmount);
      });
  }, [reqIndex, reload, page, limit, searchValue]);
  const handleChangeStatus = (event, order) => {
    statusCheckOnOpen();

    setStatus(event.target.value);

    setOrder(order);
  };

  const handleChangeStatusClick = () => {
    setChangeLoading(true);
    instance.put(`/order/${order?.id}?status=${status}`).then((res) => {
      if (res.status === 200) {
        toast.success("O'zgardi !");
        setReload(!reload);
        setChangeLoading(false);
        statusCheckOnClose();
      }
    });
  };

  const handleCreateProduct = () => {
    setAddLoading(true);

    instance
      .post(
        "/warehouse-products-only-producer",
        {
          ...productData,
          sum: 0,
          cost: 0,
          sale: 0,
          qty: 1,
        },
        {
          headers: {
            token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Создан новый заказ");
          setProductData();
          setReload(!reload);
          addProductOnClose();
        }
      })
      .finally(() => setAddLoading(false))
      .catch((err) => {
        console.log(err);
        if (err.message === "Network Error") {
          toast.error(
            "пожалуйста, проверьте свой интернет или повторите попытку"
          );
        }
      });
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleTabChange = (index) => {
    setPage(1);
    setReqIndex(index);
  };

  return (
    <Layout>
      {/* Check change status */}

      <Modal
        blockScrollOnMount={false}
        isOpen={statusCheckIsOpen}
        onClose={statusCheckOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменить статус</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              Вы действительно хотите{" "}
              {status === "REJECTED" ? "отменить" : "принять"} этот заказ?
            </Text>

            <List spacing={3} borderWidth="1px" borderRadius="lg" p={4}>
              <ListItem>
                ID:{" "}
                <Text fontWeight={"bold"} display={"inline-block"}>
                  {" "}
                  {order?.order_id}
                </Text>
              </ListItem>
              <ListItem>
                МОДЕЛЬ:{" "}
                <Text fontWeight={"bold"} display={"inline-block"}>
                  {order?.model?.name}
                </Text>
              </ListItem>
              <ListItem>
                КОЛ-ВО:{" "}
                <Text fontWeight={"bold"} display={"inline-block"}>
                  {order?.qty}
                </Text>
              </ListItem>
              <ListItem>
                ТКАНЬ:{" "}
                <Text fontWeight={"bold"} display={"inline-block"}>
                  {order?.tissue}
                </Text>
              </ListItem>
              <ListItem>
                ПОДРОБНОСТИ:{" "}
                <Text fontWeight={"bold"} display={"inline-block"}>
                  {order?.title}
                </Text>
              </ListItem>
            </List>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={changeLoading}
              onClick={handleChangeStatusClick}
              colorScheme="blue"
              mr={3}
            >
              Да
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setReload(!reload);
                statusCheckOnClose();
              }}
            >
              Нет
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD PRODUCT MODAL */}

      <Modal isOpen={addProductIsOpen} onClose={addProductOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить продукт</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl>
              <FormLabel>введите ID заказа</FormLabel>
              <Input
                onChange={(e) =>
                  setProductData({ ...productData, order_id: e.target.value })
                }
                type="number"
              />
            </FormControl>

            <Box display={"flex"} gap={"20px"}>
              <FormControl>
                <FormLabel>вид мебели</FormLabel>
                <Select
                  onChange={(e) => setType(e.target.value)}
                  placeholder="выбрать вид мебель"
                >
                  {types?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>модели</FormLabel>
                <Select
                  onChange={(e) =>
                    setProductData({ ...productData, model_id: e.target.value })
                  }
                  isDisabled={!type ? true : false}
                  placeholder="выбрать модель"
                >
                  {types
                    ?.find((ft) => ft.id === type)
                    ?.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <FormControl>
              <FormLabel>введите название ткани</FormLabel>
              <Input
                onChange={(e) =>
                  setProductData({ ...productData, tissue: e.target.value })
                }
                type="text"
              />
            </FormControl>

            <Textarea
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
              placeholder="Заголовок..."
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={
                productData?.order_id?.length &&
                type?.length &&
                productData?.model_id?.length &&
                productData?.tissue?.length &&
                productData?.title?.length
                  ? false
                  : true
              }
              isLoading={addLoading}
              onClick={handleCreateProduct}
              colorScheme="blue"
              mr={3}
            >
              Создавать
            </Button>
            <Button
              onClick={() => {
                addProductOnClose();
                setProductData();
              }}
              variant="ghost"
            >
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Tabs
        isFitted
        onChange={(index) => {
          handleTabChange(index);
        }}
      >
        <TabList>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            приём заказа 📥
          </Tab>
          <Tab
            fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}
            _selected={{ color: "#468626", borderBottom: "2px solid #468626" }}
          >
            нужно отправить ✅
          </Tab>
          <Tab
            fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}
            _selected={{ color: "red", borderBottom: "2px solid red" }}
          >
            отмененные заказы ❌
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                приём заказа
              </Heading>

              {role !== "MAIN_STOREKEEPER" ? (
                <>
                  <Menu>
                    <MenuButton
                      colorScheme="blue"
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                    >
                      Действия
                    </MenuButton>
                    <MenuList padding={"5px 5px 5px 5px"}>
                      <InputGroup margin={"0 0 7px 0"}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          onChange={(e) =>
                            setSearchValue(e.target.value.trim())
                          }
                          type="search"
                          placeholder="Поиск"
                        />
                      </InputGroup>

                      <Button
                        onClick={addProductOnOpen}
                        colorScheme="blue"
                        width={"100%"}
                      >
                        Добавить продукт
                      </Button>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <InputGroup maxWidth={"250px"}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                    type="search"
                    placeholder="Поиск ИД"
                  />
                </InputGroup>
              )}
            </Flex>

            {orders?.orders?.length === 0 ? (
              <Flex
                background={colorMode === "light" ? "#fff" : ""}
                borderWidth={"1px"}
                align="center"
                justify="center"
                height="500px"
              >
                <Icon as={FiMeh} boxSize="50px" color="gray.400" />
                <Text ml="4" fontSize="lg" color="gray.400">
                  Данные не найдены
                </Text>
              </Flex>
            ) : (
              <>
                <TableContainer overflowX="unset">
                  <Table
                    variant="simple"
                    background={colorMode === "light" ? "#fff" : ""}
                  >
                    <Thead position="sticky" top={0} zIndex="initial">
                      <Tr>
                        <Th>Дата</Th>
                        <Th>ID</Th>
                        <Th>Вид мебели</Th>
                        <Th>модель</Th>
                        <Th>кол-во</Th>
                        <Th>ткань</Th>
                        <Th>подробности</Th>
                        <Th>Дата доставки</Th>
                        <Th>изменить статус</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {reqIndex === 0
                        ? orders?.orders?.map((order) => (
                            <Tr key={order.id}>
                              <Td>
                                {moment(order.createdAt)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>{order.order_id}</Td>
                              <Td>{order.model?.furniture_type?.name}</Td>

                              <Td>{order.model?.name}</Td>
                              <Td>{order.qty}</Td>
                              <Td>{order.tissue}</Td>
                              <Td whiteSpace={"pre-wrap"}>{order.title}</Td>
                              <Td>
                                {moment(order.deal?.delivery_date)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>
                                <Select
                                  placeholder="изменить статус"
                                  defaultValue={order.status}
                                  width={200}
                                  onChange={(e) => handleChangeStatus(e, order)}
                                >
                                  <option value={"ACCEPTED"}>принял ✅</option>
                                  <option value={"REJECTED"}>
                                    отклоненный ❌
                                  </option>
                                </Select>
                              </Td>
                            </Tr>
                          ))
                        : null}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                нужно отправить
              </Heading>

              {role !== "MAIN_STOREKEEPER" ? (
                <>
                  <Menu>
                    <MenuButton
                      colorScheme="blue"
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                    >
                      Действия
                    </MenuButton>
                    <MenuList padding={"5px 5px 5px 5px"}>
                      <InputGroup margin={"0 0 7px 0"}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          onChange={(e) =>
                            setSearchValue(e.target.value.trim())
                          }
                          type="search"
                          placeholder="Поиск ИД"
                        />
                      </InputGroup>

                      <Button
                        onClick={addProductOnOpen}
                        colorScheme="blue"
                        width={"100%"}
                      >
                        Добавить продукт
                      </Button>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <InputGroup maxWidth={"250px"}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                    type="search"
                    placeholder="Поиск"
                  />
                </InputGroup>
              )}
            </Flex>

            {orders?.orders?.length === 0 ? (
              <Flex
                background={colorMode === "light" ? "#fff" : ""}
                borderWidth={"1px"}
                align="center"
                justify="center"
                height="500px"
              >
                <Icon as={FiMeh} boxSize="50px" color="gray.400" />
                <Text ml="4" fontSize="lg" color="gray.400">
                  Данные не найдены
                </Text>
              </Flex>
            ) : (
              <>
                <TableContainer>
                  <Table
                    variant="simple"
                    background={colorMode === "light" ? "#fff" : ""}
                  >
                    <Thead>
                      <Tr>
                        <Th>Дата создания</Th>
                        <Th>ID</Th>
                        <Th>Вид мебели</Th>
                        <Th>модель</Th>
                        <Th>количество</Th>
                        <Th>ткань</Th>
                        <Th>подробности</Th>
                        <Th>Дата доставки</Th>
                        <Th>изменить статус</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {reqIndex === 1
                        ? orders?.orders?.map((order) => (
                            <Tr key={order.id}>
                              <Td>
                                {moment(order.createdAt)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>{order.order_id}</Td>
                              <Td>{order.model?.furniture_type?.name}</Td>
                              <Td>{order.model?.name}</Td>
                              <Td>{order.qty}</Td>
                              <Td>{order.tissue}</Td>
                              <Td whiteSpace={"pre-wrap"}>{order.title}</Td>
                              <Td>
                                {moment(order.deal?.delivery_date)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>
                                <Select
                                  isDisabled={order.status === "CREATED"}
                                  defaultValue={order.status}
                                  width={200}
                                  onChange={(e) => handleChangeStatus(e, order)}
                                >
                                  {order.status === "CREATED" ? (
                                    <option>на склад</option>
                                  ) : null}
                                  <option value={"ACCEPTED"}>принял ✅</option>
                                  <option value={"REJECTED"}>
                                    отклоненный ❌
                                  </option>
                                </Select>
                              </Td>
                            </Tr>
                          ))
                        : null}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                отмененные заказы
              </Heading>
              <InputGroup maxWidth={"250px"}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setSearchValue(e.target.value.trim())}
                  type="search"
                  placeholder="Поиск ИД"
                />
              </InputGroup>
            </Flex>

            {orders?.orders?.length === 0 ? (
              <Flex
                background={colorMode === "light" ? "#fff" : ""}
                borderWidth={"1px"}
                align="center"
                justify="center"
                height="500px"
              >
                <Icon as={FiMeh} boxSize="50px" color="gray.400" />
                <Text ml="4" fontSize="lg" color="gray.400">
                  Данные не найдены
                </Text>
              </Flex>
            ) : (
              <>
                <TableContainer>
                  <Table
                    variant="simple"
                    background={colorMode === "light" ? "#fff" : ""}
                  >
                    <Thead>
                      <Tr>
                        <Th>Дата создания</Th>
                        <Th>ID</Th>
                        <Th>Вид мебели</Th>

                        <Th>модель</Th>
                        <Th>количество</Th>
                        <Th>ткань</Th>
                        <Th>подробности</Th>
                        <Th>Дата доставки</Th>
                        <Th>изменить статус</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {reqIndex === 2
                        ? orders?.orders?.map((order) => (
                            <Tr key={order.id}>
                              <Td>
                                {moment(order.createdAt)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>{order.order_id}</Td>
                              <Td>{order.model?.furniture_type?.name}</Td>
                              <Td>{order.model?.name}</Td>
                              <Td>{order.qty}</Td>
                              <Td>{order.tissue}</Td>
                              <Td whiteSpace={"pre-wrap"}>{order.title}</Td>
                              <Td>
                                {moment(order.deal?.delivery_date)
                                  .locale("ru")
                                  .format("L")}
                              </Td>
                              <Td>
                                <Select
                                  defaultValue={order.status}
                                  width={200}
                                  onChange={(e) => handleChangeStatus(e, order)}
                                >
                                  <option value={"ACCEPTED"}>принял ✅</option>
                                  <option value={"REJECTED"}>
                                    отклоненный ❌
                                  </option>
                                </Select>
                              </Td>
                            </Tr>
                          ))
                        : null}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </TabPanel>
          {totalCount > 10 ? (
            <DynamicPagination
              totalCount={totalCount}
              pageSize={limit}
              currentPage={page}
              onPageChange={handlePageChange}
              page={page}
            >
              <Select
                defaultValue={limit}
                ml={4}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Choose"
                w={100}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </Select>
            </DynamicPagination>
          ) : null}
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Producer;
