import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
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
  Textarea,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { instance } from "../../config/axios.instance.config";
import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  InfoIcon,
  SearchIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import { toast } from "react-toastify";
import DynamicPagination from "../../components/pagin/pagin";

const Warehouse = () => {
  const { colorMode } = useColorMode();
  const { types, token } = useContext(OpenModalContext);
  const {
    isOpen: addProductIsOpen,
    onOpen: addProductOnOpen,
    onClose: addProductOnClose,
  } = useDisclosure();
  const {
    isOpen: trIsOpen,
    onOpen: trOnOpen,
    onClose: trOnClose,
  } = useDisclosure();

  // Pagination statse
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState();
  const [page, setPage] = useState(1);
  const [limit2, setLimit2] = useState(10);
  const [count2, setCount2] = useState();
  const [page2, setPage2] = useState(1);
  const [limit1, setLimit1] = useState(10);
  const [count1, setCount1] = useState();
  const [page1, setPage1] = useState(1);
  const [limit3, setLimit3] = useState(10);
  const [count3, setCount3] = useState();
  const [page3, setPage3] = useState(1);

  const [products, setProducts] = useState([]);
  const [type, setType] = useState();
  const [productData, setProductData] = useState();
  const [checkProductData, setCheckProductData] = useState({
    order_id: false,
    type: false,
    model_id: false,
    tissue: false,
    title: false,
  });
  const [reload, setReload] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [order, setOrder] = useState();
  const [companyId, setCompanyId] = useState("");
  const [companys, setCompanys] = useState([]);
  const [returnedProduct, setReturnedProduct] = useState({});
  const [returnedModal, setReturnedModal] = useState(false);

  // Search data States
  const [searchData, setSearchData] = useState([]);
  const [searchProductData, setSearchProductData] = useState("");
  const [searchTranferedData, setSearchTransferedData] = useState([]);
  const [transferSearch, setTransferSearch] = useState("");
  const [searchDeliveredData, setSearchDeliveredData] = useState([]);
  const [deliveredSearch, setDeliveredSearch] = useState("");
  const [searchAplicatinsData, setSearchAplicationsData] = useState([]);
  const [aplicationsSearch, setAplicationsSearch] = useState("");
  const [orderId, setOrderId] = useState("");
  const [acceptID, setAcceptID] = useState(true);
  const [errorID, setErrortID] = useState(true);
  const [errorMessage, setErrorMessage] = useState(
    "значение не должно быть меньше 6 цифр"
  );
  useEffect(() => {
    instance.get("/warehouse-all").then((res) => {
      setCompanys(res.data);
    });

    // For search results
    instance
      .get(
        `/warehouse-products-search?search=${searchProductData}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        // console.log(res.data);
        setSearchData(res.data.products);
        // console.log(res.data);
        setCount(res.data.totalAmount);
      });
  }, [reload, searchProductData, page, limit]);

  useEffect(() => {
    index === 0
      ? instance
          .get(`/warehouse-products-by-status?status=PRODUCTS`)
          .then((res) => {
            setProducts(res.data.products);
            // console.log(res);
          })
      : index === 2
      ? instance
          .get(
            `/warehouse-products-by-status?page=${page2}&limit=${limit2}&search=${aplicationsSearch}`
          )
          .then((res) => {
            setSearchAplicationsData(res.data.products);
            setCount2(res?.data?.totalAmount);
          })
      : instance
          .get(
            `/warehouse-products-by-status?status=${
              index === 1 ? "TRANSFERED" : "DELIVERED"
            }&page=${index === 1 ? page1 : page3}&limit=${
              index === 1 ? limit1 : limit3
            }&search=${index === 1 ? transferSearch : deliveredSearch}`
          )
          .then((res) => {
            if (index === 1) {
              setCount1(res.data.totalAmount);
              setSearchTransferedData(res.data.products);
            } else {
              setCount3(res.data.totalAmount);
              setSearchDeliveredData(res.data.products);
            }
            // console.log(res);
          });
  }, [
    reload,
    index,
    page2,
    limit2,
    limit1,
    limit3,
    page1,
    page3,
    transferSearch,
    deliveredSearch,
    aplicationsSearch,
  ]);

  const handleCreateProduct = () => {
    setAddLoading(true);

    instance
      .post(
        "/warehouse-products",
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
          setProductData({
            cathegory: "заказ",
          });
          setReload(!reload);
          addProductOnClose();
          setOrderId("");
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

  const handleTransferProduct = () => {
    setTransferLoading(true);

    instance
      .put(`/change-warehouse-products/${order?.order?.id}`, {
        warehouse_id: companyId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Продукт был передан");

          setReload(!reload);

          trOnClose();
        }
      })
      .finally(() => setTransferLoading(false))
      .catch((err) => {
        console.log(companyId);
        console.log(err);
      });
  };

  const handleCheckedOrder = (order, status) => {
    instance.put(`/order/${order?.order_id}?status=${status}`).then((res) => {
      if (res.status === 200) {
        console.log(res);
        toast.success("изменено успешно");
        setReload(!reload);
      }
    });
  };

  // Validation create product ID
  const checkCreateproductId = (id) => {
    if (id.length < 6) {
      setAcceptID(false);
      setErrortID(true);
      setErrorMessage("значение не должно быть меньше 6 цифр");
      setCheckProductData({ ...checkProductData, order_id: false });
    } else {
      setAcceptID(true);
      instance
        .get(`/has-order-id/${id}`)
        .then((res) => {
          console.log(res);
          if (res.data === null) {
            // console.log(res)
            setErrortID(true);
            setErrorMessage("");
            setProductData({ ...productData, order_id: id });
            setCheckProductData({ ...checkProductData, order_id: true });
          } else {
            setErrortID(false);
            setErrorMessage("этот продукт уже создан.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
  };
  const handlePageChange2 = (p) => {
    setPage2(p);
  };
  const handlePageChange1 = (p) => {
    setPage1(p);
  };
  const handlePageChange3 = (p) => {
    setPage3(p);
  };

  return (
    <Layout>
      {/* ADD PRODUCT MODAL */}
      <Modal isOpen={addProductIsOpen} onClose={addProductOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить продукт</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAcceptID(true);
              setErrortID(true);
            }}
          />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl isInvalid={!acceptID || !errorID}>
              <FormLabel>введите ID заказа</FormLabel>
              <Input
                focusBorderColor={
                  !orderId?.length || orderId?.length === 0
                    ? "#63b3ed"
                    : !acceptID || !errorID
                    ? `#FC8181`
                    : "#65ce88"
                }
                onChange={(e) => {
                  if (!e.target.value?.length || e.target.value?.length === 0) {
                    setErrorMessage("");
                  }
                  checkCreateproductId(e.target.value.trim());
                  setOrderId(e.target.value.trim());
                }}
                type="number"
              />
              {!acceptID ? (
                <FormHelperText color={"#FC8181"}>
                  {errorMessage}
                </FormHelperText>
              ) : (
                ""
              )}
              {!errorID ? (
                <FormHelperText color={"#FC8181"}>
                  {errorMessage}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>

            <Box display={"flex"} gap={"20px"}>
              <FormControl>
                <FormLabel>вид мебели</FormLabel>
                <Select
                  onChange={(e) => {
                    setType(e.target.value);
                    setCheckProductData({ ...checkProductData, type: true });
                  }}
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
                  onChange={(e) => {
                    setProductData({
                      ...productData,
                      model_id: e.target.value,
                    });
                    setCheckProductData({
                      ...checkProductData,
                      model_id: true,
                    });
                  }}
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
                onChange={(e) => {
                  setProductData({ ...productData, tissue: e.target.value });
                  if (e.target.value?.length && e.target.value?.length !== 0) {
                    setCheckProductData({
                      ...checkProductData,
                      tissue: true,
                    });
                  } else {
                    setCheckProductData({
                      ...checkProductData,
                      tissue: false,
                    });
                  }
                }}
                type="text"
              />
            </FormControl>

            <Textarea
              onChange={(e) => {
                setProductData({ ...productData, title: e.target.value });
                if (e.target.value?.length && e.target.value?.length !== 0) {
                  setCheckProductData({
                    ...checkProductData,
                    title: true,
                  });
                } else {
                  setCheckProductData({
                    ...checkProductData,
                    title: false,
                  });
                }
              }}
              placeholder="Заголовок..."
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={
                checkProductData?.order_id &&
                checkProductData?.type &&
                checkProductData?.model_id &&
                checkProductData?.tissue &&
                checkProductData?.title
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
                setAcceptID(true);
                setErrortID(true);
                setProductData({
                  cathegory: "заказ",
                });
              }}
              variant="ghost"
            >
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* TRANSFER MODAL */}
      <Modal isOpen={trIsOpen} onClose={trOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Перенести продукт</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl>
              <FormLabel>выбрать компанию</FormLabel>
              <Select
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="выбирать..."
              >
                {companys?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Box boxShadow={"xs"} p={4} rounded="md">
              <List spacing={3}>
                <ListItem>ID ЗАКАЗA: {order?.order?.order_id}</ListItem>
                <ListItem>МОДЕЛ: {order?.order?.model?.name}</ListItem>
                <ListItem>КОЛ-ВО: {order?.order?.qty} </ListItem>
                <ListItem>
                  ЦЕНА: {accounting.formatNumber(order?.order?.cost, 0, " ")}{" "}
                  сум
                </ListItem>
                <ListItem>РАСПРОДАЖА: {order?.order?.sale} %</ListItem>
                <ListItem>ЗАГОЛОВОК: {order?.order?.title}</ListItem>
                <ListItem>
                  СУММА: {accounting.formatNumber(order?.order?.sum, 0, " ")}{" "}
                  сум
                </ListItem>
              </List>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={transferLoading}
              onClick={handleTransferProduct}
              colorScheme="blue"
              mr={3}
            >
              Oтправлять
            </Button>
            <Button onClick={trOnClose} variant="ghost">
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* RETURNED MODAL */}
      <Modal isOpen={returnedModal} onClose={setReturnedModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вы уверены, что хотите вернуть его?</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <Box boxShadow={"xs"} p={4} rounded="md">
              <List spacing={3}>
                <ListItem>
                  ID ЗАКАЗA: {returnedProduct?.order?.order_id}
                </ListItem>
                <ListItem>
                  МОДЕЛ: {returnedProduct?.order?.model?.name}
                </ListItem>
                <ListItem>КОЛ-ВО: {returnedProduct?.order?.qty} </ListItem>
                <ListItem>
                  ЦЕНА:{" "}
                  {accounting.formatNumber(
                    returnedProduct?.order?.cost,
                    0,
                    " "
                  )}{" "}
                  сум
                </ListItem>
                <ListItem>
                  РАСПРОДАЖА: {returnedProduct?.order?.sale} %
                </ListItem>
                <ListItem>ЗАГОЛОВОК: {returnedProduct?.order?.title}</ListItem>
                <ListItem>
                  СУММА:{" "}
                  {accounting.formatNumber(returnedProduct?.order?.sum, 0, " ")}{" "}
                  сум
                </ListItem>
              </List>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={transferLoading}
              onClick={handleTransferProduct}
              colorScheme="blue"
              mr={3}
            >
              Подтверждать
            </Button>
            <Button
              onClick={() => {
                setReturnedModal(false);
              }}
              variant="ghost"
              colorScheme="red"
            >
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Tabs onChange={(index) => setIndex(index)} isFitted>
        <TabList>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Продукты
          </Tab>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Трансферы
          </Tab>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Заявки
          </Tab>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Доставленныe
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Продукты
              </Heading>

              <Menu>
                <MenuButton
                  colorScheme="blue"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Ещё
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      addProductOnOpen();
                    }}
                    icon={<AddIcon />}
                  >
                    Добавить продукт
                  </MenuItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="search"
                      placeholder="поиск"
                      onChange={(e) => {
                        setSearchProductData(e.target.value.trim());
                      }}
                    />
                  </InputGroup>
                </MenuList>
              </Menu>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ИД</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>скидка</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>Статус</Th>
                    <Th>действия</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(searchData ? searchData : products)?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Alert
                          width={150}
                          borderRadius={"md"}
                          size={"sm"}
                          status={
                            p.order?.status === "ACTIVE"
                              ? "success"
                              : p.order?.status === "DEFECTED"
                              ? "error"
                              : p.order?.status === "SOLD_AND_CHECKED"
                              ? "info"
                              : "warning"
                          }
                        >
                          <AlertIcon />
                          {p.order?.status === "ACTIVE"
                            ? "Готовa"
                            : p.order?.status === "DEFECTED"
                            ? "Брак"
                            : p.order?.status === "SOLD_AND_CHECKED"
                            ? "к отправке"
                            : "Возврат"}
                        </Alert>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            ДЕЙСТВИЯ
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "SOLD_AND_CHECKED"
                              }
                              onClick={() => {
                                trOnOpen();
                                setOrder(p);
                              }}
                              icon={<ExternalLinkIcon />}
                            >
                              Трансферы
                            </MenuItem>

                            <MenuItem
                              isDisabled={
                                p.order?.status === "ACTIVE" ||
                                p.order?.status === "SOLD_AND_CHECKED"
                              }
                              onClick={() => {
                                handleCheckedOrder(p, "ACTIVE");
                              }}
                              icon={<CheckIcon />}
                            >
                              Готова
                            </MenuItem>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "DEFECTED" ||
                                p.order?.status === "SOLD_AND_CHECKED"
                              }
                              onClick={() => {
                                handleCheckedOrder(p, "DEFECTED");
                              }}
                              icon={<InfoIcon />}
                            >
                              Брак
                            </MenuItem>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "RETURNED" ||
                                p.order?.status === "DEFECTED" ||
                                p.order?.status === "ACTIVE"
                              }
                              onClick={() => {
                                handleCheckedOrder(p, "DELIVERED");
                              }}
                              icon={<InfoIcon />}
                            >
                              Доставлена
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {count < 10 ? (
              ""
            ) : (
              <DynamicPagination
                totalCount={count}
                itemsPerPage={5}
                pageSize={limit}
                currentPage={page}
                onPageChange={handlePageChange}
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
            )}
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Трансферы
              </Heading>
              <InputGroup w={250}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => {
                    setTransferSearch(e.target.value);
                  }}
                  type="search"
                  placeholder="Поиск по ID заказа"
                />
              </InputGroup>
              {/* <Menu>
                <MenuButton
                  colorScheme="blue"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      addProductOnOpen();
                    }}
                    icon={<AddIcon />}
                  >
                    Добавить продукт
                  </MenuItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input type="search" placeholder="search" />
                  </InputGroup>
                </MenuList>
              </Menu> */}
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ИД</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>СКИДКА</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>ДЕЙСТВИЯ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchTranferedData?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Select
                          onChange={(e) => {
                            instance
                              .put(
                                `/order/${p.order_id}?status=${e.target.value}`
                              )
                              .then((res) => {
                                if (res.status === 200) {
                                  toast.success("изменено успешно");
                                  setReload(!reload);
                                }
                              });
                          }}
                          placeholder="выбрать статус"
                        >
                          <option value={"ACTIVE"}>Готова</option>
                          <option value={"DEFECTED"}>Брак</option>
                        </Select>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {count1 < 10 ? (
              ""
            ) : (
              <DynamicPagination
                totalCount={count1}
                itemsPerPage={5}
                pageSize={limit1}
                currentPage={page1}
                onPageChange={handlePageChange1}
              >
                <Select
                  defaultValue={limit1}
                  ml={4}
                  onChange={(e) => setLimit1(e.target.value)}
                  placeholder="Choose"
                  w={100}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </Select>
              </DynamicPagination>
            )}
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Заявки
              </Heading>
              <InputGroup w={250}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setAplicationsSearch(e.target.value)}
                  type="search"
                  placeholder="Поиск по ID заказа"
                />
              </InputGroup>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ИД</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>СКИДКА</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>ДЕЙСТВИЯ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchAplicatinsData?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Button
                          onClick={() => {
                            handleCheckedOrder(p, "SOLD_AND_CHECKED");
                          }}
                          leftIcon={<ViewIcon />}
                        >
                          Я видел
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {count2 < 10 ? (
              ""
            ) : (
              <DynamicPagination
                totalCount={count2}
                itemsPerPage={5}
                pageSize={limit2}
                currentPage={page2}
                onPageChange={handlePageChange2}
              >
                <Select
                  defaultValue={limit2}
                  ml={4}
                  onChange={(e) => setLimit2(e.target.value)}
                  placeholder="Choose"
                  w={100}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </Select>
              </DynamicPagination>
            )}
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Доставленныe
              </Heading>
              <InputGroup w={250}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setDeliveredSearch(e.target.value)}
                  type="search"
                  placeholder="Поиск по ID заказа"
                />
              </InputGroup>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ИД</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>распродажа</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>ДЕЙСТВИЯ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchDeliveredData?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            ДЕЙСТВИЯ
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                // handleCheckedOrder(p, "RETURNED");
                                setReturnedProduct(p);
                                setReturnedModal(true);
                              }}
                              icon={<InfoIcon />}
                            >
                              Возврат
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {count3 < 10 ? (
              ""
            ) : (
              <DynamicPagination
                totalCount={count3}
                itemsPerPage={5}
                pageSize={limit3}
                currentPage={page3}
                onPageChange={handlePageChange3}
              >
                <Select
                  defaultValue={limit3}
                  ml={4}
                  onChange={(e) => setLimit3(e.target.value)}
                  placeholder="Choose"
                  w={100}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </Select>
              </DynamicPagination>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Warehouse;
