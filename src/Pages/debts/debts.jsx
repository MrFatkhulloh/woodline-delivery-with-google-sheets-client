import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";
import moment from "moment";
import "moment/locale/ru";
import DynamicPagination from "../../components/pagin/pagin";
import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";

const Debts = () => {
  const { types } = useContext(OpenModalContext);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: editRestOpen,
    isOpen: editRestIsOpen,
    onClose: editRestOnClose,
  } = useDisclosure();
  const {
    onOpen: addOrderOpen,
    isOpen: addOrderIsOpen,
    onClose: addOrderOnClose,
  } = useDisclosure();
  const [debts, setDebts] = useState([]);
  const [reload, setReload] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deal, setDeal] = useState();
  const [newRest, setNewRest] = useState();
  const [editLoading, setEditLoading] = useState(false);
  const [changeOrdLoading, setChangeOrdLoading] = useState(false);
  const [type, setType] = useState("");
  const [ord, setOrd] = useState();
  const [isChanged, setIsChanged] = useState();
  const [searchedPhone, setSearchedPhone] = useState("");
  const [dealMoreInfos, setDealMoreInfos] = useState();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addOrderLoading, setAddOrderLoading] = useState(false);

  const [postOrderData, setPostOrderData] = useState({
    order_id: 0,
    cathegory: "",
    tissue: "",
    title: "",
    cost: 0,
    sale: 0,
    qty: 0,
    sum: 0,
    model_id: "",
  });

  const [models, setModels] = useState();

  const { colorMode } = useColorMode();

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleEditRest = () => {
    setEditLoading(true);
    instance.put(`/deal-rest/${deal.id}`, { rest: newRest }).then((res) => {
      if (res.status === 200) {
        toast.success("Successfully changed");

        editRestOnClose();

        setEditLoading(false);

        setReload(!reload);
      }
    });
  };

  useEffect(() => {
    setModels(types?.find((t) => t.id === type));
  }, [type]);

  const handleAddOrder = () => {
    setAddOrderLoading(true);
    instance
      .post("/add-order", {
        ...postOrderData,
        deal_rest: deal.rest,
        deal_id: deal.id,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Added new order");
          console.log(res);

          setReload(!reload);

          addOrderOnClose();
        }
      })
      .finally(() => setAddOrderLoading(false))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeOrderStatus = (order) => {
    setChangeOrdLoading(true);
    instance
      .put(`/disactivate-order/${order.id}`, {
        is_active: !order.is_active,
        deal_rest: deal.rest,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("Successfully changed order status");

          setIsChanged(res.status);
        }
      })
      .finally(() => {
        setChangeOrdLoading(false);
        setReload(!reload);
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          toast.error("Internetni tekshirib qayta urinib ko'ring");
        } else {
          toast.error("Serverda muammo bor !");
        }
      });
  };

  useEffect(() => {
    searchedPhone.trim() !== ""
      ? instance
          .get(`/search-deals-dept/${searchedPhone.toString().trim()}`)
          .then((res) => {
            setDebts(res?.data?.depts);
          })
      : instance
          .get(`/deals-in-dept?page=${page}&limit=${limit}`)
          .then((res) => {
            console.log(res, "my response");
            setDebts(res?.data?.depts);
            setTotalCount(res.data?.totalAmount);
          });
  }, [reload, limit, page, searchedPhone]);

  const handleDeleteApply = () => {
    setDeleteLoading(true);
    instance
      .delete(`/deal/${deal.id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${res.data}`);

          setReload(!reload);
        }
      })
      .finally(() => {
        setDeleteLoading(false);
        deleteClose();
      });
  };

  useEffect(() => {
    deal !== undefined &&
      instance.get(`/dealId/${deal?.id}`).then((res) => {
        setDealMoreInfos(res.data);
      });
  }, [deal]);

  return (
    <>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Подробное</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Заказы</Tab>
                <Tab>Платежи</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ЗАКАЗА ID</Th>
                          <Th>Заголовок</Th>
                          <Th>КАТЕГОРИЯ</Th>
                          <Th>Цена</Th>
                          <Th>КОЛ-ВО</Th>
                          <Th>ТКАНЬ</Th>
                          <Th>ПРОЦЕНТ</Th>
                          <Th>АКТИВЕН</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dealMoreInfos?.orders?.map((o) => (
                          <Tr>
                            <Td>{o.order_id}</Td>
                            <Td>{o.title}</Td>
                            <Td>{o.cathegory}</Td>
                            <Td>{o.cost}</Td>
                            <Td>{o.qty}</Td>
                            <Td>{o.tissue}</Td>
                            <Td>{Math.round(o.sale)} %</Td>
                            <Td>
                              {changeOrdLoading && ord.id === o.id ? (
                                <Spinner size={"lg"} colorScheme="green" />
                              ) : (
                                <Switch
                                  onChange={() => {
                                    setOrd(o);
                                    handleChangeOrderStatus(o);
                                  }}
                                  defaultChecked={
                                    isChanged && ord.id === o.id
                                      ? !o.is_active
                                      : o.is_active
                                  }
                                  size={"lg"}
                                  colorScheme={"green"}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ТИП ПЛАТЕЖА</Th>
                          <Th>СУММА (СУММ)</Th>
                          <Th>КУРС $</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dealMoreInfos?.payments?.map((p) => (
                          <Tr>
                            <Td>{p.payment_type}</Td>
                            <Td>
                              {accounting.formatNumber(p.payment_sum, 0, " ")}{" "}
                              sum
                            </Td>
                            <Td>
                              {accounting.formatNumber(p.dollar_to_sum, 0, " ")}{" "}
                              sum
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={editRestIsOpen} onClose={editRestOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменить остаток</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Введите значение для изменения</FormLabel>
              <Input
                onChange={(e) => setNewRest(e.target.value)}
                type="number"
                defaultValue={deal?.rest}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={editLoading}
              onClick={() => {
                handleEditRest();
              }}
              colorScheme="blue"
              mr={3}
            >
              Изменить
            </Button>
            <Button onClick={editRestOnClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size={"2xl"} isOpen={addOrderIsOpen} onClose={addOrderOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить заказ</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap={"wrap"} gap={"10px"}>
              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>3аказа ID</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      order_id: e.target.value,
                    });
                  }}
                  type="number"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Категории</FormLabel>

                <Select
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      cathegory: e.target.value,
                    });
                  }}
                  placeholder="выберите категорию"
                >
                  <option value="заказ">заказ</option>
                  <option value="продажа со склада">продажа со склада</option>
                  <option value="продажа с витрины">продажа с витрины</option>
                </Select>
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>ткань</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      tissue: e.target.value,
                    });
                  }}
                  type="text"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Заголовок</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      title: e.target.value,
                    });
                  }}
                  type="text"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Цена</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      cost: e.target.value,
                    });
                  }}
                  type="number"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Распродажа</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      sale: e.target.value,
                    });
                  }}
                  type="number"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Кол-во</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      qty: e.target.value,
                    });
                  }}
                  type="number"
                />
              </FormControl>
              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Сумма</FormLabel>

                <Input
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      sum: e.target.value,
                    });
                  }}
                  type="number"
                />
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Тип мебели</FormLabel>

                <Select
                  onChange={(e) => setType(e.target.value)}
                  placeholder="выбрать тип мебели"
                >
                  {types?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>Модели</FormLabel>

                <Select
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      model_id: e.target.value,
                    });
                  }}
                  isDisabled={models ? false : true}
                  placeholder="выбрать модель"
                >
                  {models?.models?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={addOrderLoading}
              onClick={() => {
                handleAddOrder();
              }}
              colorScheme="blue"
              mr={3}
            >
              Добавить
            </Button>
            <Button onClick={addOrderOnClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete modal */}

      <Modal
        closeOnOverlayClick={false}
        isOpen={deleteIsOpen}
        onClose={deleteClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вы уверены, что хотите удалить?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button
              isLoading={deleteLoading}
              onClick={() => {
                handleDeleteApply();
              }}
              colorScheme="blue"
              mr={3}
            >
              Да
            </Button>
            <Button onClick={onClose}>Нет</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Долги
          </Heading>

          <Input
            onChange={(e) => {
              setSearchedPhone(e.target.value);
            }}
            width={200}
            type="number"
            placeholder="Искать по тел."
          />
        </Flex>

        <TableContainer>
          <Table
            variant="simple"
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>Дата</Th>
                <Th>Номер сделки</Th>
                <Th>ID заказа</Th>
                <Th>Клиент</Th>
                <Th>Номер Клиента</Th>
                <Th>Продавец</Th>
                <Th>Остаток</Th>
                <Th>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {debts?.map((d, i) => (
                <Tr key={i}>
                  <Td>{moment(d?.createdAt).locale("ru").format("L")}</Td>
                  <Td>{100000000 + d?.deal_id}</Td>
                  <Td>{d?.orders[0]?.order_id}</Td>
                  <Td>{d?.client?.name}</Td>
                  <Td>{d?.client?.phone}</Td>
                  <Td>{d?.seller?.name}</Td>
                  <Td>{accounting.formatNumber(d?.rest, 0, " ")} сум</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        onClick={() => {
                          setDeal(d);
                        }}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Действия
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          icon={<InfoIcon />}
                          onClick={() => {
                            setDeal(d);
                            onOpen();
                          }}
                        >
                          подробное
                        </MenuItem>
                        <MenuItem
                          icon={<AddIcon />}
                          onClick={() => {
                            addOrderOpen();
                          }}
                        >
                          добавить заказ
                        </MenuItem>
                        <MenuItem
                          icon={<EditIcon />}
                          onClick={() => {
                            editRestOpen();
                          }}
                        >
                          изменить остаток
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          onClick={() => {
                            deleteOnOpen();
                          }}
                        >
                          удалить
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {searchedPhone !== "" ? null : (
          <DynamicPagination
            totalCount={totalCount}
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
      </Layout>
    </>
  );
};

export default Debts;
