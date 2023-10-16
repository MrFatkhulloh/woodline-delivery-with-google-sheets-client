import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
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
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
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
  TableCaption,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
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
  DownloadIcon,
  EditIcon,
} from "@chakra-ui/icons";
import copy from "copy-to-clipboard";
import { InputLabel, Typography } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DynamicPagination from "../../components/pagin/pagin";
import axios from "axios";
import TuneIcon from "@mui/icons-material/Tune";
const MainWarehouse = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState();

  const [page3, setPage3] = useState(1);
  const [limit3, setLimit3] = useState(10);
  const [count3, setCount3] = useState();
  const [page4, setPage4] = useState(1);
  const [limit4, setLimit4] = useState(10);
  const [count4, setCount4] = useState();

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehouses, setWarehouses] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [products, setProducts] = useState([]);
  const [bookedOrder, setBookedOrder] = useState();
  const [seller, setSeller] = useState();

  const [type, setType] = useState("");

  const [addPrLoading, setAddPrLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [acceptID, setAcceptID] = useState(true);
  const [errorID, setErrortID] = useState(true);
  const [errorMessage, setErrorMessage] = useState(
    "значение не должно быть меньше 6 цифр"
  );

  const [orderId2, setOrderId2] = useState("");
  const [acceptID2, setAcceptID2] = useState(true);
  const [errorID2, setErrortID2] = useState(true);
  const [errorMessage2, setErrorMessage2] = useState(
    "значение не должно быть меньше 6 цифр"
  );

  const [adminWarehouse, setAdminWarehouse] = useState({});
  const [newAdminWarehouse, setNewAdminWarehouse] = useState({});
  const [editAdminWarehouseLoading, setAdminWarehouseLoading] = useState(false);

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

  const {
    isOpen: downloadModalIsOpen,
    onOpen: downloadModalOpen,
    onClose: downloadModalClose,
  } = useDisclosure();

  const {
    isOpen: moreProductIsOpen,
    onOpen: mordeProductOpen,
    onClose: mordeProductClose,
  } = useDisclosure();

  const {
    isOpen: confrimWarehouseIsOpen,
    onOpen: confrimWarehouseOpen,
    onClose: confrimWarehouseClose,
  } = useDisclosure();

  const {
    isOpen: infoIsOpen,
    onOpen: infoOpen,
    onClose: infoClose,
  } = useDisclosure();

  const {
    isOpen: editWarehouseAdminIsOpen,
    onOpen: editWarehouseAdminOpen,
    onClose: editWarehouseAdminClose,
  } = useDisclosure();

  const [empty, setEmpty] = useState(false);
  const [productData, setProductData] = useState();
  const [moreProductTissue, setMoreProductTissue] = useState("");
  const [moreProductTitle, setMoreProductTitle] = useState("");
  const [moreProductData, setMoreProductData] = useState({
    model_id: "",
    order_id: "",
    status: "",
    tissue: "",
    title: "",
  });

  const [checkProductData, setCheckProductData] = useState({
    model_id: false,
    order_id: false,
    status: false,
    tissue: false,
    title: false,
    type: false,
    warehouse_id: false,
  });
  const [checkMoreProductData, setCheckMoreProductData] = useState({
    model_id: false,
    order_id: false,
    status: false,
    tissue: false,
    title: false,
    type: false,
  });
  const [allMoreProductData, setAllMoreProductData] = useState([]);
  const [oneWarehouseForAllMoreProducts, setOneWarehouseForAllMoreProducts] =
    useState("");
  const [moreProductLoading, setMoreProductLoading] = useState(false);

  const handleAddMoreProductFunc = () => {
    setAllMoreProductData((prevData) => [...prevData, moreProductData]);
    setMoreProductData({
      model_id: "",
      order_id: "",
      status: "",
      tissue: "",
      title: "",
    });
    setOrderId2("");
    setMoreProductTissue("");
    setMoreProductTitle("");
    setType("");
  };
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

  const [searchProductsData, setSearchProductsData] = useState([]);
  const [productsSearch, setProductsSearch] = useState("");

  const [searchDeliveredProductsData, setSearchDeliveredProductsData] =
    useState([]);
  const [deliveredProductsSearch, setDeliveredProductsSearch] = useState("");
  const [filterProductWarehouse, setFilterProductWarehouse] = useState([]);
  const [filterProductWarehouseData, setFilterProductWarehouseData] = useState(
    []
  );
  const [product, setProduct] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [myCopyData, setMyCopyData] = useState();
  const [copiedData, setCopiedData] = useState();
  const [putOrderId, setPutOrderId] = useState("");
  const [putOrder, setPutOrder] = useState({});
  const [downloadWarehouseId, setDownloadWarehouseId] = useState("");
  const [dowloadLoading, setDownloadLoading] = useState(false);
  const [isChecked, setIsChecked] = useState([
    {
      id: "",
      checked: false,
    },
  ]);

  //  booked order info

  useEffect(() => {
    bookedOrder?.order?.seller_id &&
      instance
        .get(`/get-seller/${bookedOrder?.order?.seller_id}`, {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        })
        .then((response) => {
          setSeller(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
  }, [bookedOrder]);

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });

    instance.get("/get-by-role?role=STOREKEEPER").then((res) => {
      setUsers(res.data);
    });

    instance.get(`/warehouse`).then((res) => {
      setWarehouses(res.data);
    });

    instance
      .get(
        `/warehouse-products?search=${productsSearch}&page=${page3}&limit=${limit3}&warehouse=${
          filterProductWarehouse === "all" ? "" : filterProductWarehouse
        }`
      )
      .then((res) => {
        setSearchProductsData(res.data.products);
        setCount3(res.data.totalAmount);
      });

    instance
      .get(
        `/warehouse-products-by-status?status=DELIVERED&search=${deliveredProductsSearch}&page=${page4}&limit=${limit4}`
      )
      .then((res) => {
        // console.log(res);
        setSearchDeliveredProductsData(res.data.products);
        setCount4(res.data.totalAmount);
      });
  }, [
    reload,
    limit3,
    page3,
    page4,
    limit4,
    productsSearch,
    deliveredProductsSearch,
    filterProductWarehouse,
    editAdminWarehouseLoading,
  ]);
  useEffect(() => {
    instance
      .get(
        `/warehouse-products-search-deal?search=${dealSearch}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        // console.log(res)
        setSearchDealProducts(res.data);
        setCount(res.data?.length);
      });
  }, [dealSearch, page, limit]);

  useEffect(() => {
    product?.order?.deal_id &&
      instance
        .get(`/get-for-mainstorekeeper-by-deal-id/${product?.order?.deal_id}`)
        .then((res) => setMyCopyData(res.data));
  }, [product]);

  const handleClearMoreProductMOdalData = () => {
    setMoreProductData({
      model_id: "",
      order_id: "",
      status: "",
      tissue: "",
      title: "",
    });
    setType("");
    setOneWarehouseForAllMoreProducts("");
    setAllMoreProductData([]);
  };

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
          setOrderId("");
        }
      })
      .finally(() => setAddPrLoading(false))
      .catch((err) => {
        console.log(err);
        if (err.message === "Network Error") {
          toast.error(
            "пожалуйста, проверьте свой интернет или повторите попытку"
          );
        }
      });
  };

  const handleMoreProduct = () => {
    // console.log({
    //   products: allMoreProductData,
    //   warehouse_id: oneWarehouseForAllMoreProducts,
    // });
    setMoreProductLoading(true);
    instance
      .post("/bulck-create-warehouse-products", {
        products: allMoreProductData,
        warehouse_id: oneWarehouseForAllMoreProducts,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Создан");
          setReload(!reload);
          mordeProductClose();
          handleClearMoreProductMOdalData();
        }
      })
      .finally(() => setMoreProductLoading(false))
      .catch((err) => {
        console.log(err);
        if (err.message === "Network Error") {
          toast.error(
            "пожалуйста, проверьте свой интернет или повторите попытку"
          );
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
      .put(`/warehouse-product-returned/${returnedProduct?.order_id}`, {
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
  console.log(returnedProduct)

  const handePutProduct = async () => {
    console.log(putOrder?.model_id);
    instance
      .put(`/order-update/${putOrderId}`, {
        title: putOrder?.title,
        model: putOrder?.model_id,
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
  const handlePageChange = (p) => {
    setPage(p);
  };

  const handlePageChange3 = (p) => {
    setPage3(p);
  };
  const handlePageChange4 = (p) => {
    setPage4(p);
  };

  // Download data type exel
  const handleDownload = () => {
    setDownloadLoading(true);
    instance
      .get(`/warehouse-products-to-excel?warehouse=${downloadWarehouseId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "file.xlsx";
        a.click();
        URL.revokeObjectURL(url);
        setDownloadLoading(false);
        downloadModalClose();
      })
      .catch((error) => console.error("Error downloading the file:", error));
  };

  // edit admin warehouse
  const handleEditWarehouseAdmin = () => {
    instance
      .put(`warehouse/${adminWarehouse?.id}`, newAdminWarehouse)
      .then((res) => {
        setAdminWarehouseLoading(true);
        if (res.status === 200) {
          setAdminWarehouseLoading(false);
          setReload(!reload);
          editWarehouseAdminClose();
          setAdminWarehouse({});
          toast.success("Изменено успешно");
        }
      })
      .catch((err) => {
        console.log(`Error in edit admin warehouse ${err}`);
        toast.error("Этот пользователь привязан к другому складу");
      });
  };
  
  return (
    <Layout>
      {/* ADD WAREHOUSE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Создать склад</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAdminWarehouse({});
            }}
          />
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
            <Button
              onClick={() => {
                onClose();
                setAdminWarehouse({});
              }}
              variant="ghost"
            >
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
          <ModalCloseButton
            onClick={() => {
              setAcceptID(true);
              setErrortID(true);
            }}
          />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl>
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
                    setCheckProductData({
                      ...checkProductData,
                      type: true,
                    });
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
                    setCheckProductData({ ...checkProductData, tissue: true });
                  } else {
                    setCheckProductData({ ...checkProductData, tissue: false });
                  }
                }}
                type="text"
              />
            </FormControl>

            <Box display={"flex"} gap={"20px"}>
              <FormControl>
                <FormLabel>Склад</FormLabel>

                <Select
                  onChange={(e) => {
                    setProductData({
                      ...productData,
                      warehouse_id: e.target.value,
                    });
                    setCheckProductData({
                      ...checkProductData,
                      warehouse_id: true,
                    });
                  }}
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
                  onChange={(e) => {
                    setProductData({ ...productData, status: e.target.value });
                    setCheckProductData({ ...checkProductData, status: true });
                  }}
                  placeholder="выбирать..."
                >
                  <option value={"NEW"}>Новый</option>
                  <option value={"ACTIVE"}>Готово</option>
                  <option value={"DEFECTED"}>Брак</option>
                  <option value={"RETURNED"}>Возврат</option>
                  <option value={"SOLD_AND_CHECKED"}>К отправке</option>
                  <option value={"DELIVERED"}>Доставлено</option>
                  <option disabled={false} value={"READY_TO_DELIVERY"}>
                    К отправке
                  </option>
                  <option disabled={true} value={"VIEWED_STOREKEEPER"}>
                    VIEWED_STOREKEEPER
                  </option>
                </Select>
              </FormControl>
            </Box>

            <Textarea
              onChange={(e) => {
                setProductData({ ...productData, title: e.target.value });
                if (e.target.value?.length && e.target.value?.length !== 0) {
                  setCheckProductData({ ...checkProductData, title: true });
                } else {
                  setCheckProductData({ ...checkProductData, title: false });
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
                checkProductData?.warehouse_id &&
                checkProductData?.status &&
                checkProductData?.title
                  ? false
                  : true
              }
              isLoading={addPrLoading}
              onClick={handleCreateProduct}
              colorScheme="blue"
              mr={3}
            >
              Создавать
            </Button>
            <Button
              onClick={() => {
                addProductOnClose();
                setOrderId("");
                setProductData();
              }}
              variant="ghost"
            >
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CONFIRM WAREHOUSE FOR MORE PRODUCTS MODAL */}
      <Modal isOpen={confrimWarehouseIsOpen} onClose={confrimWarehouseClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Выберите склад</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <Box display={"flex"} gap={"20px"}>
              <FormControl>
                <FormLabel>Склад</FormLabel>
                <Select
                  required
                  onChange={(e) =>
                    setOneWarehouseForAllMoreProducts(e.target.value)
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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={oneWarehouseForAllMoreProducts?.length ? false : true}
              onClick={confrimWarehouseClose}
              colorScheme="teal"
              mr={3}
            >
              Подтверждать
            </Button>
            <Button
              onClick={() => {
                confrimWarehouseClose();
                setOneWarehouseForAllMoreProducts("");
              }}
              variant="ghost"
            >
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD MORE PRODUCT MODAL */}
      <Modal isOpen={moreProductIsOpen} onClose={mordeProductClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            onClick={() => {
              setAcceptID2(true);
              setErrortID2(true);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "400px" }}>
              <ModalHeader>Добавить несколько продуктов</ModalHeader>

              <ModalBody
                display={"flex"}
                flexDirection={"column"}
                gap={"15px"}
                sx={{ mb: 5 }}
              >
                <FormControl>
                  <FormLabel>введите ID заказа</FormLabel>
                  <Input
                    value={orderId2}
                    focusBorderColor={
                      !orderId2?.length || orderId2?.length === 0
                        ? "#63b3ed"
                        : !acceptID2 || !errorID2
                        ? `#FC8181`
                        : "#65ce88"
                    }
                    onChange={(e) => {
                      const checkId = allMoreProductData.find(
                        (item) => item?.order_id === e.target.value.trim()
                      );
                      if (e.target.value?.length < 6) {
                        setAcceptID2(false);
                        setErrortID2(true);
                        setErrorMessage2(
                          "значение не должно быть меньше 6 цифр"
                        );
                        setCheckMoreProductData({
                          ...checkMoreProductData,
                          order_id: false,
                        });
                      } else {
                        setAcceptID2(true);
                        instance
                          .get(`/has-order-id/${e.target.value.trim()}`)
                          .then((res) => {
                            // console.log(res, checkId);
                            if (res.data === null && !checkId) {
                              // console.log(res)
                              setErrortID2(true);
                              setErrorMessage2("");
                              setMoreProductData({
                                ...moreProductData,
                                order_id: e.target.value.trim(),
                              });
                              setCheckMoreProductData({
                                ...checkMoreProductData,
                                order_id: true,
                              });
                            } else {
                              setErrortID2(false);
                              setErrorMessage2("этот продукт уже создан.");
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                      setOrderId2(e.target.value.trim());
                    }}
                    type="number"
                  />
                  {!acceptID2 ? (
                    <FormHelperText color={"#FC8181"}>
                      {errorMessage2}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                  {!errorID2 ? (
                    <FormHelperText color={"#FC8181"}>
                      {errorMessage2}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>

                <Box display={"flex"} gap={"20px"}>
                  <FormControl>
                    <FormLabel>вид мебели</FormLabel>
                    <Select
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        setCheckMoreProductData({
                          ...checkMoreProductData,
                          type: true,
                        });
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
                      value={moreProductData.model_id}
                      onChange={(e) => {
                        setMoreProductData({
                          ...moreProductData,
                          model_id: e.target.value,
                        });
                        setCheckMoreProductData({
                          ...checkMoreProductData,
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
                    value={moreProductTissue}
                    onChange={(e) => {
                      setMoreProductData({
                        ...moreProductData,
                        tissue: e.target.value.trim(),
                      });
                      setMoreProductTissue(e.target.value);
                      if (
                        e.target.value?.length &&
                        e.target.value?.length !== 0
                      ) {
                        setCheckMoreProductData({
                          ...checkMoreProductData,
                          tissue: true,
                        });
                      } else {
                        setCheckMoreProductData({
                          ...checkMoreProductData,
                          tissue: false,
                        });
                      }
                    }}
                    type="text"
                  />
                </FormControl>

                <Box display={"flex"} gap={"20px"}>
                  <FormControl>
                    <FormLabel>Статус</FormLabel>

                    <Select
                      value={moreProductData.status}
                      onChange={(e) => {
                        setMoreProductData({
                          ...moreProductData,
                          status: e.target.value,
                        });
                        setCheckMoreProductData({
                          ...checkMoreProductData,
                          status: true,
                        });
                      }}
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
                  value={moreProductTitle}
                  onChange={(e) => {
                    setMoreProductData({
                      ...moreProductData,
                      title: e.target.value.trim(),
                    });
                    setMoreProductTitle(e.target.value);
                    if (
                      e.target.value?.length &&
                      e.target.value?.length !== 0
                    ) {
                      setCheckMoreProductData({
                        ...checkMoreProductData,
                        title: true,
                      });
                    } else {
                      setCheckMoreProductData({
                        ...checkMoreProductData,
                        title: false,
                      });
                    }
                  }}
                  placeholder="Заголовок..."
                />

                <Button
                  isDisabled={
                    checkMoreProductData?.order_id &&
                    checkMoreProductData?.type &&
                    checkMoreProductData?.model_id &&
                    checkMoreProductData?.tissue &&
                    checkMoreProductData?.status &&
                    checkMoreProductData?.title
                      ? false
                      : true
                  }
                  onClick={() => {
                    handleAddMoreProductFunc();
                  }}
                  colorScheme="teal"
                  width="100%"
                  variant="outline"
                >
                  Добавить продукт +
                </Button>
              </ModalBody>
            </Box>
            <Box>
              <ModalHeader sx={{ display: "flex" }}>
                Складъ:
                <Text
                  sx={{
                    marginLeft: "10px",
                    color: oneWarehouseForAllMoreProducts?.length
                      ? "cyan"
                      : "grey",
                  }}
                >
                  {warehouses?.map((w) => {
                    let wName;
                    if (w.id === oneWarehouseForAllMoreProducts) wName = w.name;
                    if (oneWarehouseForAllMoreProducts?.length) {
                      return wName;
                    }
                  })}
                  {!oneWarehouseForAllMoreProducts?.length && "Не выбран"}
                </Text>
              </ModalHeader>
              <ModalBody>
                <TableContainer
                  width={"550px"}
                  height={"500px"}
                  overflowY={"auto"}
                  overflowX={"auto"}
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Но</Th>
                        <Th>IDИД заказа</Th>
                        <Th>Заголовок</Th>
                        <Th>Модель</Th>
                        <Th>Ткань</Th>
                        <Th>Статус</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {allMoreProductData?.length ? (
                        allMoreProductData?.map((p, i) => {
                          let mName;
                          types?.map((t) => {
                            t?.models?.map((m) => {
                              if (m?.id === p?.model_id) mName = m?.name;
                            });
                          });
                          console.log(p);
                          return (
                            <Tr key={i}>
                              <Td>{i + 1}</Td>
                              <Td>{p?.order_id}</Td>
                              <Td>{p?.title}</Td>
                              <Td>{mName}</Td>
                              <Td>{p?.tissue}</Td>
                              <Td>
                                {p?.status === "NEW"
                                  ? "Новый"
                                  : p?.status === "ACTIVE"
                                  ? "Готовa"
                                  : p?.status === "DEFECTED"
                                  ? "Брак"
                                  : p?.status === "SOLD_AND_CHECKED"
                                  ? "к отправке"
                                  : p?.status === "DELIVERED"
                                  ? "Доставлена"
                                  : p?.status === "RETURNED"
                                  ? "Возврат"
                                  : ""}
                                {/* DELIVERED */}
                              </Td>
                            </Tr>
                          );
                        })
                      ) : (
                        <Tr></Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </ModalBody>
            </Box>
          </Box>
          <Divider />
          <ModalFooter sx={{ mt: 5 }}>
            {oneWarehouseForAllMoreProducts?.length ? (
              <Button
                isDisabled={allMoreProductData?.length ? false : true}
                isLoading={moreProductLoading}
                onClick={() => {
                  handleMoreProduct();
                }}
                colorScheme="blue"
                mr={3}
              >
                Создавать
              </Button>
            ) : (
              <Button
                isDisabled={allMoreProductData?.length ? false : true}
                onClick={confrimWarehouseOpen}
                colorScheme="facebook"
                mr={3}
                title="Hello"
              >
                Выберите склад
              </Button>
            )}
            <Button
              onClick={() => {
                mordeProductClose();
                handleClearMoreProductMOdalData();
              }}
              variant="ghost"
            >
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

      {/* DOWNLOAD MODAL */}
      <Modal isOpen={downloadModalIsOpen} onClose={downloadModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Информация о складе</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap="15px">
            <FormControl>
              <FormLabel>Выберите склад</FormLabel>
              <Select
                onChange={(e) => setDownloadWarehouseId(e.target.value)}
                placeholder="Choose warehouse"
              >
                {warehouses?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={dowloadLoading}
              onClick={handleDownload}
              colorScheme="teal"
              mr={3}
            >
              Скачать
            </Button>
            <Button onClick={downloadModalClose} variant="ghost">
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* INFO MODAL */}

      <Modal isOpen={infoIsOpen} onClose={infoClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Данные о продукте</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setBookedOrder();
            }}
          />
          <ModalBody>
            <Card>
              <CardHeader>
                <Heading size="md">этот продукт забронирован</Heading>
              </CardHeader>
              <CardBody>
                <Text>Имя продавца: {seller?.name ? seller?.name : ""}</Text>
                <Divider my={3} />
                <Text>
                  Номер телефона: {seller?.phone ? seller?.phone : ""}
                </Text>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                infoClose();
                setBookedOrder();
              }}
              colorScheme="blue"
              mr={3}
            >
              понятно
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT ADMIN WAREHOUSE */}
      <Modal
        isOpen={editWarehouseAdminIsOpen}
        onClose={editWarehouseAdminClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Выберите администратора</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"15px"}>
            <FormControl>
              <FormLabel>администратор</FormLabel>
              <Select
                defaultValue={adminWarehouse?.seller?.id}
                onChange={(e) => {
                  setNewAdminWarehouse({
                    ...newAdminWarehouse,
                    admin: e.target.value,
                  });
                }}
              >
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                editWarehouseAdminClose();
              }}
              variant="ghost"
            >
              Закрывать
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              isLoading={editAdminWarehouseLoading}
              onClick={handleEditWarehouseAdmin}
              colorScheme="blue"
              mr={3}
            >
              Готова
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
                    <Th>ИД</Th>
                    <Th>Вид мебели</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>заголовок</Th>
                    <Th>Статус</Th>
                    <Th>действия</Th>
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
                    <Th>ИД</Th>
                    <Th>название склада</Th>
                    <Th>компания</Th>
                    <Th>администратор</Th>
                    <Th>телефон администратора</Th>
                    <Th>ДЕЙСТВИЯ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {warehouses?.map((w, i) => (
                    <Tr key={i}>
                      <Td>{i + 1}</Td>
                      <Td>{w.name}</Td>
                      <Td>{w.company?.name}</Td>
                      <Td>{w.seller?.name}</Td>
                      <Td>{w.seller?.phone}</Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          onClick={() => {
                            editWarehouseAdminOpen();
                            setAdminWarehouse(w);
                          }}
                        >
                          Изменить <EditIcon style={{ marginLeft: "5px" }} />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Flex
              justifyContent="space-between"
              flexWrap="wrap"
              alignItems="center"
              my={5}
            >
              <Heading
                fontSize={{ base: "18px", md: "26px", lg: "32px" }}
                my={5}
              >
                Продукты
              </Heading>
              <Box
                sx={{
                  width: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Menu>
                    <MenuButton
                      colorScheme="blue"
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                    >
                      Ещё
                    </MenuButton>
                    <MenuList sx={{ px: "10px", width: "300px" }}>
                      <InputGroup fullWith my={2}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          onChange={(e) => setProductsSearch(e.target.value)}
                          type="search"
                          placeholder="Поиск по ID заказа"
                        />
                      </InputGroup>

                      <Button
                        sx={{ width: "100%", my: "10px" }}
                        onClick={addProductOnOpen}
                        colorScheme="blue"
                      >
                        добавить продукт
                      </Button>

                      <Button
                        sx={{ width: "100%", mb: "10px" }}
                        onClick={mordeProductOpen}
                        colorScheme="messenger"
                      >
                        добавить несколько продуктов
                      </Button>

                      <Button
                        sx={{ width: "100%" }}
                        colorScheme="teal"
                        onClick={() => {
                          downloadModalOpen();
                        }}
                      >
                        скачать &nbsp;
                        <SaveAltIcon />
                      </Button>
                    </MenuList>
                  </Menu>
                </Box>
                <Box>
                  <Menu closeOnSelect={false}>
                    <MenuButton as={Button} colorScheme="whatsapp">
                      <TuneIcon />
                    </MenuButton>
                    <MenuList minWidth="240px">
                      <MenuOptionGroup
                        onChange={(e) => {
                          // console.log(e);
                          setFilterProductWarehouse(e);
                        }}
                        defaultValue="all"
                        type="radio"
                      >
                        <MenuItemOption value="all">All</MenuItemOption>
                        {warehouses?.map((w) => {
                          return (
                            <MenuItemOption value={w?.id}>
                              {w?.name}
                            </MenuItemOption>
                          );
                        })}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
              </Box>
            </Flex>

            <TableContainer>
              <Table
                variant={"simple"}
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>ИД</Th>
                    <Th>Вид мебели</Th>
                    <Th>Модел</Th>
                    <Th>кол-во</Th>
                    <Th>ткань</Th>
                    <Th>заголовок</Th>
                    <Th>Склад</Th>
                    <Th>Статус</Th>
                    <Th>ДЕЙСТВИЯ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchProductsData?.map((p) => (
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
                          cursor={
                            p.order?.status === "BOOKED" ? "pointer" : "auto"
                          }
                          onClick={() => {
                            // console.log(p);
                            setBookedOrder(p);
                            p.order?.status === "BOOKED" && infoOpen();
                          }}
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
                              : p.order?.status === "CREATED"
                              ? "info"
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
                            : p.order?.status === "CREATED"
                            ? "Создан"
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
                            ДЕЙСТВИЯ
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
                                p.order?.status === "SOLD_AND_CHECKED" ||
                                p.order?.status === "CREATED"
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
                              Доставка
                            </MenuItem>
                            <MenuItem
                              isDisabled={
                                p.order?.status === "ACTIVE" ||
                                p.order?.status === "SOLD_AND_CHECKED"
                                  ? true
                                  : false
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
                              Готова
                            </MenuItem>

                            <MenuItem
                              isDisabled={
                                p.order?.status === "DEFECTED" ||
                                p.order?.status === "CREATED"
                                  ? true
                                  : false
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
                              Брак
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
                  onChange={(e) => {
                    setDeliveredProductsSearch(e.target.value);
                  }}
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
                    <Th>Складъ</Th>
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
                  {searchDeliveredProductsData?.map((p) => {
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
                              ДЕЙСТВИЯ
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
            {count4 < 10 ? (
              ""
            ) : (
              <DynamicPagination
                totalCount={count4}
                itemsPerPage={5}
                pageSize={limit4}
                currentPage={page4}
                onPageChange={handlePageChange4}
              >
                <Select
                  defaultValue={setLimit4}
                  ml={4}
                  onChange={(e) => setLimit4(e.target.value)}
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

export default MainWarehouse;
