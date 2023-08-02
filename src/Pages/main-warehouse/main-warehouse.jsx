import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
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
  Tooltip,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { instance } from "../../config/axios.instance.config";
import { toast } from "react-toastify";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  InfoIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import copy from "copy-to-clipboard";

const MainWarehouse = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [products, setProducts] = useState([]);

  const [type, setType] = useState();

  const [addPrLoading, setAddPrLoading] = useState(false);

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

  const {
    isOpen: podatIsOpen,
    onOpen: podatOnOpen,
    onClose: podatOnClose,
  } = useDisclosure();

  const {
    isOpen: copyIsOpen,
    onOpen: copyOnOpen,
    onClose: copyOnClose,
  } = useDisclosure();

  const [productData, setProductData] = useState();
  const { types, courier, token } = useContext(OpenModalContext);
  const [order, setOrder] = useState();

  const [transferLoading, setTransferLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [postWarehouse, setPostWarehouse] = useState();

  const [reload, setReload] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [companyId, setCompanyId] = useState("");

  const [searchDealProducts, setSearchDealProducts] = useState([]);
  const [dealSearch, setDealSearch] = useState("");
  const [product, setProduct] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [myCopyData, setMyCopyData] = useState();
  const [copiedData, setCopiedData] = useState();
  const [isChecked, setIsChecked] = useState([
    {
      id: "",
      checked: false,
    },
  ]);

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });

    instance.get("/get-storekeeper").then((res) => {
      setUsers(res.data);
    });

    instance.get("/warehouse").then((res) => setWarehouses(res.data));

    instance.get("/warehouse-products").then((res) => {
      setProducts(res.data);
    });
  }, [reload]);

  useEffect(() => {
    instance
      .get(`/warehouse-products-search-deal?search=${dealSearch}`)
      .then((res) => {
        setSearchDealProducts(res.data);
      });
  }, [dealSearch]);

  useEffect(() => {
    product?.order?.deal_id &&
      instance
        .get(`/get-for-mainstorekeeper-by-deal-id/${product?.order?.deal_id}`)
        .then((res) => setMyCopyData(res.data));
  }, [product]);

  const handleCreateWarehouse = () => {
    setAddLoading(true);
    instance
      .post("/warehouse", { ...postWarehouse })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Склад создан");

          setReload(!reload);

          onClose();

          setPostWarehouse(undefined);
        }
      })
      .finally(() => setAddLoading(false))
      .catch((err) => {
        if (err.message === "Network Error") {
          toast.error(
            "пожалуйста, проверьте свой интернет или повторите попытку"
          );
        }
      });
  };

  const handleCreateProduct = () => {
    setAddPrLoading(true);

    instance
      .post(
        "/warehouse-products-only-admin",
        {
          ...productData,
          sum: 0,
          cost: 0,
          sale: 0,
          qty: 1,
          title: "",
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

  // console.log("mmm  ", searchDealProducts[0]?.order?.deal);

  console.log(myCopyData);
  console.log(searchDealProducts);
  return (
    <Layout>
      {/* ADD WAREHOUSE MODAL */}
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Создать склад</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap="15px">
            <FormControl>
              <FormLabel>enter a name</FormLabel>
              <Input
                onChange={(e) =>
                  setPostWarehouse({ ...postWarehouse, name: e.target.value })
                }
                placeholder="enter..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>choose a company</FormLabel>
              <Select
                onChange={(e) =>
                  setPostWarehouse({
                    ...postWarehouse,
                    company_id: e.target.value,
                  })
                }
                placeholder="choose..."
              >
                {companys?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>choose a admin</FormLabel>
              <Select
                onChange={(e) =>
                  setPostWarehouse({ ...postWarehouse, admin: e.target.value })
                }
                placeholder="choose..."
              >
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>choose a type</FormLabel>
              <Select
                onChange={(e) =>
                  setPostWarehouse({ ...postWarehouse, type: e.target.value })
                }
                placeholder="choose..."
              >
                <option value={"витрина"}>витрина</option>
                <option value={"склад"}>склад</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={addLoading}
              onClick={handleCreateWarehouse}
              colorScheme="blue"
              mr={3}
            >
              Создавать
            </Button>
            <Button onClick={onClose} variant="ghost">
              Закрывать
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

            <Box display={"flex"} gap={"20px"}>
              <FormControl>
                <FormLabel>warehouse</FormLabel>

                <Select
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      warehouse_id: e.target.value,
                    })
                  }
                  placeholder="choose..."
                >
                  {warehouses?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>status</FormLabel>

                <Select
                  onChange={(e) =>
                    setProductData({ ...productData, status: e.target.value })
                  }
                  placeholder="choose..."
                >
                  <option value={"NEW"}>NEW</option>
                  <option value={"ACTIVE"}>ACTIVE</option>
                  <option value={"VIEWED_STOREKEEPER"}>
                    VIEWED_STOREKEEPER
                  </option>
                  <option value={"READY_TO_DELIVERY"}>READY_TO_DELIVERY</option>
                  <option value={"DEFECTED"}>DEFECTED</option>
                  <option value={"RETURNED"}>RETURNED</option>
                  <option value={"SOLD_AND_CHECKED"}>SOLD_AND_CHECKED</option>
                  <option value={"DELIVERED"}>DELIVERED</option>
                </Select>
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={addPrLoading}
              onClick={handleCreateProduct}
              colorScheme="blue"
              mr={3}
            >
              Создавать
            </Button>
            <Button onClick={addProductOnClose} variant="ghost">
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* TRANSFER PRODUCT MODAL */}

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
                {warehouses?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
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

      {/* PODAT MODAL */}

      <Modal size={"4xl"} isOpen={podatIsOpen} onClose={podatOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Заявки</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <TableContainer>
                <Table
                  variant={"simple"}
                  background={colorMode === "light" ? "#fff" : ""}
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Furniture Type</Th>
                      <Th>Model</Th>
                      <Th>Tissue</Th>
                      <Th>Title</Th>
                      <Th>Check</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {myCopyData?.map((ord) => (
                      <Tr>
                        <Td>{ord.order?.order_id}</Td>
                        <Td>{ord?.order.model?.furniture_type?.name}</Td>
                        <Td>{ord?.order.model?.name}</Td>
                        <Td>{ord?.order?.tissue}</Td>
                        <Td whiteSpace={"pre-wrap"}>{ord?.order?.title}</Td>
                        <Td>
                          <Checkbox
                            onChange={() => {
                              setIsChecked([
                                ...isChecked,
                                {
                                  ...isChecked,
                                  id: ord.id,
                                  checked: !isChecked.checked,
                                },
                              ]);
                              if (
                                checkedList.find((chl) => chl.id === ord.id)
                              ) {
                                setCheckedList(
                                  checkedList.filter(
                                    (ch) =>
                                      ch.id !==
                                      isChecked.find((isC) => isC.id === ord.id)
                                        .id
                                  )
                                );
                                console.log(true);
                              } else {
                                setCheckedList([...checkedList, ord]);
                                console.log(false);
                              }
                            }}
                            size={"lg"}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                podatOnClose();
                copyOnOpen();
              }}
              colorScheme="blue"
              mr={3}
            >
              Сохранять
            </Button>
            <Button onClick={podatOnClose} variant="ghost">
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* COPY MODAL */}

      <Modal scrollBehavior="inside" isOpen={copyIsOpen} onClose={copyOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"10px"}>
            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"} whiteSpace={"nowrap"}>
                Номер рейса:
              </FormLabel>
              <Input
                onChange={(e) =>
                  setCopiedData({ ...copiedData, number_reys: e.target.value })
                }
              />
            </FormControl>

            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"}>Категория:</FormLabel>
              <Input
                onChange={(e) =>
                  setCopiedData({ ...copiedData, category: e.target.value })
                }
              />
            </FormControl>

            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"}>Курьер:</FormLabel>
              <Select
                onChange={(e) =>
                  setCopiedData({ ...copiedData, courier: e.target.value })
                }
                placeholder="choose a courier"
              >
                {courier?.map((c) => (
                  <option value={c.name} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"}>Куда:</FormLabel>
              <Input
                onChange={(e) =>
                  setCopiedData({ ...copiedData, kuda: e.target.value })
                }
              />
            </FormControl>

            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"18px"} whiteSpace={"nowrap"}>
                Контактное лицо:
              </Text>
              <Text fontSize={"22px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {product?.order?.deal?.client?.name}
              </Text>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"18px"} whiteSpace={"nowrap"}>
                Ном. Тел:
              </Text>
              <Text fontSize={"22px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {product?.order?.deal?.client?.phone}
              </Text>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"18px"} whiteSpace={"nowrap"}>
                Продовец:
              </Text>
              <Text fontSize={"22px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {product?.order?.deal?.seller?.name}
              </Text>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"18px"} whiteSpace={"nowrap"}>
                Тел. Продовца:
              </Text>
              <Text fontSize={"22px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {product?.order?.deal?.seller?.phone}
              </Text>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"18px"} whiteSpace={"nowrap"}>
                Остаток:
              </Text>
              <Text fontSize={"22px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {product?.order?.deal?.rest}
              </Text>
            </Box>

            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"} whiteSpace={"nowrap"}>
                Когда:{" "}
              </FormLabel>
              <Input
                onChange={(e) =>
                  setCopiedData({ ...copiedData, kogda: e.target.value })
                }
                type="date"
              />
            </FormControl>

            <Text fontSize={"22px"}>
              {myCopyData?.map((mc, i) => (
                <>
                  {i + 1}) 🆔 : {mc.order?.order_id} <br />
                  Откуда: {mc.warehouse?.name} <br />
                  Груз:{" "}
                  {mc.order?.model?.furniture_type?.name +
                    " - " +
                    mc.order?.model?.name}
                </>
              ))}
            </Text>

            <FormControl display={"flex"} alignItems={"center"} gap={"10px"}>
              <FormLabel fontSize={"18px"} whiteSpace={"nowrap"}>
                Вознаграждение:{" "}
              </FormLabel>
              <Input
                onChange={(e) =>
                  setCopiedData({ ...copiedData, vozna: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              colorScheme="blue"
              onClick={() => {
                setIsCopied(true);

                copy(
                  `Номер рейса: ${copiedData?.number_reys} \nКатегория: ${
                    copiedData?.category
                  }\nКурьер: ${copiedData?.courier}\nКуда: ${
                    copiedData?.kuda
                  }\nКонтактное лицо: ${
                    product?.order?.deal?.client?.name
                  }\nНом. Тел.: ${
                    product?.order?.deal?.client?.phone
                  }\nПродовец: ${
                    product?.order?.deal?.seller?.name
                  }\nТел. Продовца: ${
                    product?.order?.deal?.seller?.phone
                  }\nОстаток: ${product?.order?.deal?.rest}\nКогда: ${
                    copiedData?.kogda
                  }\n\n${myCopyData
                    ?.map(
                      (o, i) =>
                        `${i + 1}) 🆔 : ${o.order?.order_id}\nОткуда: ${
                          o.warehouse?.name
                        } \nГруз: ${
                          o.order?.model?.furniture_type?.name +
                          " - " +
                          o.order?.model?.name
                        }\n`
                    )
                    .join("\n")}\n\nВознаграждение: ${copiedData?.vozna}`
                );

                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
              rightIcon={isCopied ? <CheckIcon /> : <CopyIcon />}
            >
              {isCopied ? "Copied" : "Copy"}
            </Button>
            <Button onClick={copyOnClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Tabs isFitted>
        <TabList>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Подать заявки
          </Tab>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            складские помещения
          </Tab>
          <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
            Продукты
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
                Подать заявки
              </Heading>

              <InputGroup w={250}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setDealSearch(e.target.value)}
                  type="search"
                  placeholder="Поиск по ID заказа"
                />
              </InputGroup>
            </Flex>

            <TableContainer>
              <Table
                variant={"simple"}
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Вид мебели</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>заголовок</Th>
                    <Th>status</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchDealProducts?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.furniture_type?.name}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        <Alert
                          width={150}
                          borderRadius={"md"}
                          size={"sm"}
                          status={"info"}
                        >
                          <AlertIcon />
                          {"к отправке"}
                        </Alert>
                      </Td>
                      <Td>
                        <Button
                          onClick={() => {
                            setProduct(p);
                            podatOnOpen();
                          }}
                        >
                          Подать
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                складские помещения
              </Heading>
              <Button onClick={onOpen} colorScheme="blue">
                добавить склад
              </Button>
            </Flex>

            <TableContainer>
              <Table
                variant={"simple"}
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>название склада</Th>
                    <Th>компания</Th>
                    <Th>администратор</Th>
                    <Th>телефон администратора</Th>
                    {/* <Th>actions</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {warehouses?.map((w, i) => (
                    <Tr>
                      <Td>{i + 1}</Td>
                      <Td>{w.name}</Td>
                      <Td>{w.company?.name}</Td>
                      <Td>{w.seller?.name}</Td>
                      <Td>{w.seller?.phone}</Td>
                      {/* <Td>actions</Td> */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Продукты
              </Heading>
              <Button onClick={addProductOnOpen} colorScheme="blue">
                добавить продукт
              </Button>
            </Flex>

            <TableContainer>
              <Table
                variant={"simple"}
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Вид мебели</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>заголовок</Th>
                    <Th>status</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.model?.furniture_type?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        <Alert
                          bgColor={
                            p.order?.status === "BOOKED" ? "#c0c0c0" : ""
                          }
                          width={200}
                          borderRadius={"md"}
                          color={
                            colorMode === "dark" && p.order?.status === "BOOKED"
                              ? "#000"
                              : ""
                          }
                          size={"sm"}
                          status={
                            p.order?.status === "ACTIVE"
                              ? "success"
                              : p.order?.status === "DEFECTED"
                              ? "error"
                              : p.order?.status === "SOLD_AND_CHECKED"
                              ? "info"
                              : p.order?.status === "BOOKED"
                              ? "warning"
                              : "warning"
                          }
                        >
                          {p.order?.status === "BOOKED" ? (
                            <AlertIcon
                              color={
                                colorMode === "light" ? "#545454" : "#3d3d3d"
                              }
                            />
                          ) : (
                            <AlertIcon />
                          )}
                          {p.order?.status === "ACTIVE"
                            ? "Готовa"
                            : p.order?.status === "DEFECTED"
                            ? "Брак"
                            : p.order?.status === "SOLD_AND_CHECKED"
                            ? "к отправке"
                            : p.order?.status === "BOOKED"
                            ? "Забронировано"
                            : "Возврат"}
                        </Alert>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            isDisabled={
                              p.order?.status === "BOOKED" ? true : false
                            }
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            Actions
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "SOLD_AND_CHECKED"
                                  ? true
                                  : false
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
                                p.order?.status === "SOLD_AND_CHECKED"
                                  ? false
                                  : true
                              }
                              icon={<InfoIcon />}
                              onClick={() => {
                                instance
                                  .put(`/order/${p.order_id}?status=DELIVERED`)
                                  .then((res) => {
                                    if (res.status === 200) {
                                      toast.success(
                                        "статус изменился на доставлено"
                                      );

                                      setReload(!reload);
                                    }
                                  });
                              }}
                            >
                              Dostavka
                            </MenuItem>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "ACTIVE" ? true : false
                              }
                              onClick={() => {
                                instance
                                  .put(`/order/${p.order_id}?status=ACTIVE`)
                                  .then((res) => {
                                    if (res.status === 200) {
                                      toast.success(
                                        "статус изменился на доставлено"
                                      );

                                      setReload(!reload);
                                    }
                                  });
                              }}
                              icon={<CheckIcon />}
                            >
                              Active
                            </MenuItem>

                            <MenuItem
                              isDisabled={
                                p.order?.status === "DEFECTED" ? true : false
                              }
                              onClick={() => {
                                instance
                                  .put(`/order/${p.order_id}?status=DEFECTED`)
                                  .then((res) => {
                                    if (res.status === 200) {
                                      toast.success(
                                        "статус изменился на доставлено"
                                      );

                                      setReload(!reload);
                                    }
                                  });
                              }}
                              icon={<InfoIcon />}
                            >
                              Defected
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>asdajsdlk</TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default MainWarehouse;