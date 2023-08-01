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
  SearchIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import { toast } from "react-toastify";

const Warehouse = () => {
  const { colorMode } = useColorMode();
  const { types } = useContext(OpenModalContext);
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
  const [products, setProducts] = useState([]);
  const [type, setType] = useState();
  const [productData, setProductData] = useState();
  const [reload, setReload] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [order, setOrder] = useState();
  const [companyId, setCompanyId] = useState("");

  const [companys, setCompanys] = useState([]);

  useEffect(() => {
    instance.get("/warehouse-all").then((res) => {
      setCompanys(res.data);
    });
  }, [reload]);

  useEffect(() => {
    index === 0
      ? instance
          .get("/warehouse-products-by-status?status=PRODUCTS")
          .then((res) => setProducts(res.data))
      : index === 2
      ? instance.get("/warehouse-products-by-status").then((res) => {
          setProducts(res.data);
        })
      : instance
          .get(
            `/warehouse-products-by-status?status=${
              index === 1 ? "TRANSFERED" : "DELIVERED"
            }`
          )
          .then((res) => {
            console.log(res);
            setProducts(res.data);
          });
  }, [reload, index]);

  console.log(products);

  const handleCreateProduct = () => {
    setAddLoading(true);
    let sum = Math.round(
      (1 - Number(productData?.sale) / 100) *
        productData?.cost *
        productData?.qty
    );
    instance
      .post("/warehouse-products", {
        ...productData,
        sum,
        cost: 0,
        sale: 0,
        qty: 1,
        title: "",
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Создан новый заказ");
          setProductData({
            cathegory: "заказ",
          });
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

  const handleCheckedOrder = (order) => {
    instance
      .put(`/order/${order?.order_id}?status=SOLD_AND_CHECKED`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("изменено успешно");
          setReload(!reload);
        }
      });
  };

  return (
    <Layout>
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
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={addLoading}
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
              </Menu>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>распродажа</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>status</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td>{p.order?.title}</Td>
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
                            Actions
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                trOnOpen();
                                setOrder(p);
                              }}
                              icon={<ExternalLinkIcon />}
                            >
                              Трансферы
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
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Трансферы
              </Heading>

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
                    <Th>ID</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>распродажа</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td>{p.order?.title}</Td>
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
                          placeholder="choose a status"
                        >
                          <option value={"ACTIVE"}>ACTIVE</option>
                          <option value={"DEFECTED"}>DEFECTED</option>
                        </Select>
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
                Заявки
              </Heading>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>распродажа</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Button
                          onClick={() => {
                            handleCheckedOrder(p);
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
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" my={5}>
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Доставленныe
              </Heading>
            </Flex>

            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>цена</Th>
                    <Th>распродажа</Th>
                    <Th>заголовок</Th>
                    <Th>сумма</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td>{accounting.formatNumber(p.order?.cost, 0, " ")}</Td>
                      <Td>{p.order?.sale} %</Td>
                      <Td>{p.order?.title}</Td>
                      <Td>
                        {accounting.formatNumber(p.order?.sum, 0, " ")} сум
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            Actions
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                trOnOpen();
                                setOrder(p);
                              }}
                              icon={<ExternalLinkIcon />}
                            >
                              Трансферы
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
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Warehouse;
