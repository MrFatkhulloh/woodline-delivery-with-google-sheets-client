import React, { useEffect, useState } from "react";
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
import accounting from "accounting";
import Layout from "../components/layout/layout";
import { useContext } from "react";
import { OpenModalContext } from "../Contexts/ModalContext/ModalContext";
import axios from "axios";
import moment from "moment";
import "moment/locale/ru";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { instance } from "../config/axios.instance.config";
import { toast } from "react-toastify";
import DynamicPagination from "../components/pagin/pagin";

const MyOrders = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const {
    isOpen: updateIsOpen,
    onOpen: updateOpen,
    onClose: updateClose,
  } = useDisclosure();

  const [updateLoading, setUpdateLoading] = useState(false);

  const [myOrders, setMyOrders] = useState([]);
  const { token, courier } = useContext(OpenModalContext);
  const { colorMode } = useColorMode();
  const [reys, setReys] = useState();
  const [reload, setReload] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState();

  const [updateData, setUpdateData] = useState({
    price: null,
    title: null,
    trip_id: null,
    delivery_date: null,
    courier_id: null,
  });

  useEffect(() => {
    axios
      .get(`/delivery/pagination?page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setMyOrders(response.data.delivery);
        setCount(response.data.totalAmount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, reload, page, limit]);

  const handleDeleteReys = () => {
    setDeleteLoading(true);
    console.log(reys);
    instance
      .delete(`/deliveries/${reys?.id}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          toast.success(`${res.data}`);
          onClose();
        }
      })
      .finally(() => {
        setReload(!reload);
        setDeleteLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(reys.id);
      });
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleUpdateSubmit = () => {
    setUpdateLoading(true);
    instance
      .put(`/deliveries/${reys.id}`, { ...updateData })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${res.data}`);
          setReload(!reload);
        }
      })
      .finally(() => {
        setUpdateLoading(false);
        updateClose();
      });
  };

  return (
    <>
      {/* Edit modal */}

      <Modal mx={{ base: "20px" }} isOpen={updateIsOpen} onClose={updateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменить reys</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Изменить price</FormLabel>

              <Input
                defaultValue={reys?.price}
                onChange={(e) => {
                  setUpdateData({ ...updateData, price: e.target.value });
                }}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Изменить title</FormLabel>

              <Input
                defaultValue={reys?.title}
                onChange={(e) => {
                  setUpdateData({ ...updateData, title: e.target.value });
                }}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Изменить trip id</FormLabel>

              <Input
                defaultValue={reys?.trip_id}
                onChange={(e) => {
                  setUpdateData({ ...updateData, trip_id: e.target.value });
                }}
                type="text"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Изменить date</FormLabel>

              <Input
                defaultValue={reys?.delivery_date}
                onChange={(e) => {
                  setUpdateData({
                    ...updateData,
                    delivery_date: e.target.value,
                  });
                }}
                type="date"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Изменить courier</FormLabel>

              <Select
                placeholder="choose a client"
                defaultValue={reys?.courier_id}
                onChange={(e) => {
                  setUpdateData({ ...updateData, courier_id: e.target.value });
                }}
              >
                {courier?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={updateLoading}
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateSubmit}
            >
              {"Изменять"}
            </Button>
            <Button variant="ghost" onClick={updateClose}>
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete modal */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вы уверены, что хотите удалить?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button
              isLoading={deleteLoading}
              onClick={() => {
                handleDeleteReys();
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
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Рейсы
          </Heading>
        </Flex>

        <TableContainer>
          <Table
            variant="simple"
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>номер рейса</Th>
                <Th>Курер</Th>
                <Th>Вознаграждение</Th>
                <Th>ID</Th>
                <Th>Клиент</Th>
                <Th>Телефон</Th>
                <Th>Остаток</Th>
                <Th>Статус</Th>
                <Th>Дата создании</Th>
                <Th>Дата доставки</Th>
                <Th>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myOrders.length > 0 ? (
                myOrders.map((e, i) => {
                  return (
                    <Tr key={i}>
                      <Td>{e?.trip_id}</Td>
                      <Td>{e?.seller ? e?.seller?.name : ""}</Td>
                      <Td>
                        {accounting.formatNumber(e?.price, 0, " ") + " sum"}
                      </Td>
                      <Td>{e?.order?.order_id}</Td>
                      <Td>
                        {e?.order?.deal
                          ? e?.order?.deal?.client?.name
                          : "Склад"}
                      </Td>
                      <Td>
                        {e?.order?.deal
                          ? e?.order?.deal?.client?.phone
                          : "Склад"}
                      </Td>
                      <Td>
                        {accounting.formatNumber(
                          e?.order?.deal ? e?.order?.deal?.rest : 0,
                          0,
                          " "
                        )}{" "}
                        сум
                      </Td>
                      <Td>{e.copied ? "В таблице" : "Ожидание..."}</Td>
                      <Td>{moment(e?.createdAt).locale("ru").format("L")}</Td>
                      <Td>
                        {moment(e?.delivery_date).locale("ru").format("L")}
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            Действия
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                setReys(e);
                                updateOpen();
                              }}
                              icon={<EditIcon />}
                            >
                              Изменять
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setReys(e);
                                onOpen();
                              }}
                              icon={<DeleteIcon />}
                            >
                              Удалить
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

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
      </Layout>
    </>
  );
};

export default MyOrders;
