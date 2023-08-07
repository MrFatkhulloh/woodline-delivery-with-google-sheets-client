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
  EditIcon,
} from "@chakra-ui/icons";
import copy from "copy-to-clipboard";
import { InputLabel, Typography } from "@mui/material";

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

  const {
    isOpen: editProductIsOpen,
    onOpen: editProductOpen,
    onClose: editProductClose,
  } = useDisclosure();

  const [productData, setProductData] = useState();
  const { types, courier, token } = useContext(OpenModalContext);
  const [order, setOrder] = useState();

  const [transferLoading, setTransferLoading] = useState(false);
  const [returnedLoading, setReturnedLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [postWarehouse, setPostWarehouse] = useState();

  const [reload, setReload] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [returnedModal, setReturnedModal] = useState(false);

  const [returnedProdectWarehouseId, setReturnedProdectWarehouseId] =
    useState("");
  const [companyId, setCompanyId] = useState("");
  const [returnedProduct, setReturnedProduct] = useState({});
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [searchDealProducts, setSearchDealProducts] = useState([]);
  const [dealSearch, setDealSearch] = useState("");
  const [product, setProduct] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [myCopyData, setMyCopyData] = useState();
  const [copiedData, setCopiedData] = useState();
  const [putOrderId, setPutOrderId] = useState("");
  const [putOrder, setPutOrder] = useState({});

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

    instance
      .get(`/warehouse-products-by-status?status=DELIVERED`)
      .then((res) => {
        setDeliveredProducts(res.data);
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

  const handleReturnedProduct = () => {
    setReturnedLoading(true);
    instance
      .put(`/warehouse-product-returned/${returnedProduct?.order?.id}`, {
        warehouse_id: returnedProdectWarehouseId,
      })
      .then((res) => {
        toast.success("Successfully returned product");
        setReturnedModal(false);
      })
      .finally(() => {
        setReturnedLoading(false);
      })
      .catch((err) => {
        setReturnedModal(false);
        toast.error("Error Returned Product");
        console.log(err);
      });
  };

  const handePutProduct = async () => {
    instance
      .put(`/order-update/${putOrderId}`, {
        title: putOrder?.title,
        model_id: putOrder?.model_id,
        tissue: putOrder?.tissue,
      })
      .then((res) => {
        if (res.status === 200) {
          editProductClose();
          toast.success("изменено успешно");
          setReload(!reload);
        }
      });
  };

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
                <FormLabel>Склад</FormLabel>

                <Select
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      warehouse_id: e.target.value,
                    })
                  }
                  placeholder="выбирать..."
                >
                  {warehouses?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Статус</FormLabel>

                <Select
                  onChange={(e) =>
                    setProductData({ ...productData, status: e.target.value })
                  }
                  placeholder="выбирать..."
                >
                  <option value={"NEW"}>Новый</option>
                  <option value={"ACTIVE"}>Готово</option>
                  <option value={"DEFECTED"}>Брак</option>
                  <option value={"RETURNED"}>Возврат</option>
                  <option value={"SOLD_AND_CHECKED"}>К отправке</option>
                  <option value={"DELIVERED"}>Доставлено</option>
                  <option disabled={true} value={"VIEWED_STOREKEEPER"}>
                    VIEWED_STOREKEEPER
                  </option>
                  <option disabled={true} value={"READY_TO_DELIVERY"}>
                    READY_TO_DELIVERY
                  </option>
                </Select>
              </FormControl>
            </Box>

            <Textarea
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
              placeholder="Заголовок..."
            />
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
                  {accounting.formatNumber(returnedProduct?.order?.sum, 0, " ")}
                  сум
                </ListItem>
              </List>
              <FormControl sx={{ my: 4 }}>
                <Select
                  id="demo-simple-select"
                  label="Филиал"
                  placeholder="Выберите филиал"
                  onChange={(e) => {
                    // setReturnedProdectId(returnedProduct.id);
                    // setReturnedProdectWarehouseId(e.target.value);
                  }}
                >
                  {warehouses?.map((w) => {
                    if (returnedProduct.warehouse_id !== w.id) {
                      return (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      );
                    }
                  })}
                </Select>
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={returnedLoading}
              onClick={() => {
                handleReturnedProduct();
              }}
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

      {/* EDIT MODAL */}
      <Modal isOpen={editProductIsOpen} onClose={editProductClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактировать продукт</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl>
              <FormLabel>заголовок</FormLabel>
              <Input
                defaultValue={putOrder.title}
                onChange={(e) =>
                  setPutOrder({ ...putOrder, title: e.target.value })
                }
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
                  defaultValue={putOrder?.model?.name}
                  onChange={(e) =>
                    setPutOrder({ ...putOrder, model_id: e.target.value })
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
                defaultValue={putOrder.tissue}
                onChange={(e) =>
                  setPutOrder({ ...putOrder, tissue: e.target.value })
                }
                type="text"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={addLoading}
              onClick={handePutProduct}
              colorScheme="blue"
              mr={3}
            >
              Готова
            </Button>
            <Button
              onClick={() => {
                editProductClose();
              }}
              variant="ghost"
            >
              Закрывать
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
                    <Th>Статус</Th>
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
                    <Th>Склад</Th>
                    <Th>Статус</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((p) => (
                    <Tr>
                      <Td>{p.order?.order_id}</Td>
                      <Td>{p.order?.model?.furniture_type?.name}</Td>
                      <Td>{p.order?.model?.name}</Td>
                      <Td>{p.order?.qty}</Td>
                      <Td>{p.order?.tissue}</Td>
                      <Td whiteSpace={"pre-wrap"}>{p.order?.title}</Td>
                      <Td>
                        {warehouses?.find((w) => w.id === p.warehouse_id)?.name}
                      </Td>
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
                                p.order?.status === "SOLD_AND_CHECKED" ||
                                p.order?.status === "DELIVERED" ||
                                p.order?.status === "RETURNED" ||
                                p.order?.status === "BOOKED" ||
                                p.order?.status === "SOLD" ||
                                p.order?.status === "CREATED"
                                  ? true
                                  : false
                              }
                              onClick={() => {
                                editProductOpen();
                                setPutOrder(p?.order);
                                setPutOrderId(p?.order?.id);
                              }}
                              icon={<EditIcon />}
                            >
                              Редактировать
                            </MenuItem>
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
                    <Th>Складъ</Th>
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
                  {deliveredProducts?.map((p) => {
                    const warehouse = warehouses.find(
                      (warehouse) => warehouse.id == p?.warehouse_id
                    );

                    return (
                      <Tr key={p.id}>
                        <Td>{p.order?.order_id}</Td>
                        <Td>{p.order?.model?.name}</Td>

                        <Td>{warehouse?.name}</Td>
                        <Td>{p.order?.qty}</Td>
                        <Td>{p.order?.tissue}</Td>
                        <Td>
                          {accounting.formatNumber(p.order?.cost, 0, " ")}
                        </Td>
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
                              Actions
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                onClick={() => {
                                  // handleCheckedOrder(p, "RETURNED");
                                  setReturnedProdectWarehouseId(
                                    p?.warehouse_id
                                  );
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
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default MainWarehouse;
