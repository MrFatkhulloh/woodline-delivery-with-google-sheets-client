import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
  Table,
  TableContainer,
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
import { ChevronDownIcon } from "@chakra-ui/icons";
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
  const [searchedData, setSearchedData] = useState([]);

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
    searchedPhone !== ""
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

  return (
    <>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>More Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Orders
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Order id</Th>
                          <Th>title</Th>
                          <Th>Category</Th>
                          <Th>sena</Th>
                          <Th>kol-vo</Th>
                          <Th>tissue</Th>
                          <Th>percent</Th>
                          <Th>is active</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {deal?.orders?.map((o) => (
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
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Payments
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>payment type</Th>
                          <Th>summa (sum)</Th>
                          <Th>kurs $</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {deal?.payments?.map((p) => (
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
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={editRestIsOpen} onClose={editRestOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit rest</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              onChange={(e) => setNewRest(e.target.value)}
              type="number"
              defaultValue={deal?.rest}
            />
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
              edit
            </Button>
            <Button onClick={editRestOnClose}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size={"2xl"} isOpen={addOrderIsOpen} onClose={addOrderOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add order</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex wrap={"wrap"} gap={"10px"}>
              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>order id</FormLabel>

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
                <FormLabel>category</FormLabel>

                <Select
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      cathegory: e.target.value,
                    });
                  }}
                  placeholder="choose a ctg"
                >
                  <option value="заказ">заказ</option>
                  <option value="продажа со склада">продажа со склада</option>
                  <option value="продажа с витрины">продажа с витрины</option>
                </Select>
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>tissue</FormLabel>

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
                <FormLabel>title</FormLabel>

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
                <FormLabel>cost</FormLabel>

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
                <FormLabel>sale</FormLabel>

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
                <FormLabel>qty</FormLabel>

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
                <FormLabel>sum</FormLabel>

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
                <FormLabel>furn type</FormLabel>

                <Select
                  onChange={(e) => setType(e.target.value)}
                  placeholder="choose a ctg"
                >
                  {types?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl width={"50%"} flexBasis={"300px"} flexGrow={1}>
                <FormLabel>model</FormLabel>

                <Select
                  onChange={(e) => {
                    setPostOrderData({
                      ...postOrderData,
                      model_id: e.target.value,
                    });
                  }}
                  isDisabled={models ? false : true}
                  placeholder="choose a ctg"
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
              add order
            </Button>
            <Button onClick={addOrderOnClose}>Отмена</Button>
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
            placeholder="search by phone"
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
                <Th>Nomer zdelke</Th>
                <Th>Order id</Th>
                <Th>Client</Th>
                <Th>Client Number</Th>
                <Th>Seller</Th>
                <Th>Rest</Th>
                <Th>Actions</Th>
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
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            onOpen();
                          }}
                        >
                          More info
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            editRestOpen();
                          }}
                        >
                          edit rest
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            addOrderOpen();
                          }}
                        >
                          Add order
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
