import React, { useEffect, useState } from "react";
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
  MenuDivider,
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
import PayModal from "./components/pay-modal";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";
import moment from "moment";
import "moment/locale/ru";
import DynamicPagination from "../../components/pagin/pagin";
import Pagination from "../../components/pagination/p";
import {
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import { toast } from "react-toastify";

const PaySalary = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [pays, setPays] = useState([]);
  const [id, setId] = useState({});
  const [reload, setReload] = useState(false);
  const [course, setCourse] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState();
  const [apply, setApply] = useState();
  const [approval, setApproval] = useState();
  const [updateLoading, setUpdateLoading] = useState(false);

  const [updateData, setUpdateData] = useState({
    amount_sum: null,
    amount_dollar: null,
    kurs: null,
  });

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const {
    isOpen: deleteIsOpen2,
    onOpen: deleteOnOpen2,
    onClose: deleteClose2,
  } = useDisclosure();

  const {
    isOpen: moreIsOpen,
    onOpen: moreOnOpen,
    onClose: moreClose,
  } = useDisclosure();

  const {
    isOpen: updateIsOpen,
    onOpen: updateOpen,
    onClose: updateClose,
  } = useDisclosure();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteLoading2, setDeleteLoading2] = useState(false);

  useEffect(() => {
    instance.get(`/applies?page=${page}&limit=${limit}`).then((res) => {
      setPays(res?.data?.allApplies);
      setTotalPages(res?.data?.totalAmount);
      console.log(res?.data?.totalAmount);
      setCourse(res?.data?.kurs);
    });
  }, [reload, limit, page]);

  const handlePageChange = (p) => {
    setPage(p);
  };

  const { colorMode } = useColorMode();

  const handleDeleteApply = () => {
    setDeleteLoading(true);
    instance
      .delete(`/apply/${apply.id}`)
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

  const handleDeleteApproval = () => {
    setDeleteLoading2(true);
    instance
      .delete(`/approval/${approval?.id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${res.data}`);

          setId({
            ...id,
            approvals: id?.approvals?.filter((fa) => fa.id !== approval?.id),
          });

          setReload(!reload);
        }
      })
      .finally(() => {
        setDeleteLoading2(false);
        deleteClose2();
      });
  };

  const handleUpdateSubmit = () => {
    setUpdateLoading(true);
    instance
      .put(`/approval/${approval.id}`, { ...updateData })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          toast.success("Updated data");

          const indexToUpdate = id?.approvals?.findIndex(
            (obj) => obj.id === approval?.id
          );

          if (indexToUpdate !== -1) {
            setId({
              ...id,
              approvals: [
                ...id?.approvals.slice(0, indexToUpdate), // Elements before the object
                res.data, // Updated object
                ...id?.approvals?.slice(indexToUpdate + 1), // Elements after the object
              ],
            });
          }

          setReload(!reload);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUpdateLoading(false);
        updateClose();
      });
  };

  return (
    <>
      <PayModal
        isOpen={isOpen}
        onClose={onClose}
        id={id}
        reload={reload}
        setReload={setReload}
      />

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
            <Button onClick={deleteClose}>Нет</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Approval modal */}

      <Modal
        closeOnOverlayClick={false}
        isOpen={deleteIsOpen2}
        onClose={deleteClose2}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вы уверены, что хотите удалить?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button
              isLoading={deleteLoading2}
              onClick={() => {
                handleDeleteApproval();
              }}
              colorScheme="blue"
              mr={3}
            >
              Да
            </Button>
            <Button onClick={deleteClose2}>Нет</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* More info modal */}

      <Modal size={"5xl"} isOpen={moreIsOpen} onClose={moreClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Оплаты</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ДАТА</Th>
                    <Th>ОПЛАТА (СУМ)</Th>
                    <Th>ОПЛАТА В (ДОЛЛОР)</Th>
                    <Th>СУММА ПО КУРСУ</Th>
                    <Th>ОБЩАЯ СУММА</Th>
                    <Th>Действия</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {id?.approvals?.map((ap) => (
                    <Tr>
                      <Td>{moment(ap?.createdAt).locale("ru").format("L")}</Td>
                      <Td>
                        {accounting.formatNumber(ap?.amount_sum, 0, " ")} sum
                      </Td>
                      <Td>
                        $ {accounting.formatNumber(ap?.amount_dollar, 0, " ")}
                      </Td>
                      <Td>{accounting.formatNumber(ap?.kurs, 0, " ")} sum</Td>
                      <Td>
                        {accounting.formatNumber(
                          Number(ap?.kurs) * Number(ap?.amount_dollar) +
                            Number(ap?.amount_sum),
                          0,
                          " "
                        )}{" "}
                        sum
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
                                setApproval(ap);
                                updateOpen();
                                console.log(approval);
                              }}
                              icon={<EditIcon />}
                            >
                              Изменять
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                              onClick={() => {
                                setApproval(ap);
                                deleteOnOpen2();
                              }}
                              icon={<DeleteIcon />}
                            >
                              Удалить
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit approval modal */}

      <Modal mx={{ base: "20px" }} isOpen={updateIsOpen} onClose={updateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменить Оплатый</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <FormControl mb={5}>
              <FormLabel>Изменить дата</FormLabel>

              <Input
                onChange={(e) => {}}
                defaultValue={approval?.createdAt}
                type="date"
              />
            </FormControl> */}

            <FormControl mb={5}>
              <FormLabel>Изменить оплата (сум)</FormLabel>

              <Input
                onChange={(e) => {
                  setUpdateData({
                    ...updateData,
                    amount_sum: e.target.value,
                  });
                }}
                defaultValue={approval?.amount_sum}
                type="number"
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel>Изменить оплата в (доллор)</FormLabel>

              <Input
                onChange={(e) => {
                  setUpdateData({
                    ...updateData,
                    amount_dollar: e.target.value,
                  });
                }}
                defaultValue={approval?.amount_dollar}
                type="number"
              />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel>Изменить сумма по курсу</FormLabel>

              <Input
                onChange={(e) => {
                  setUpdateData({
                    ...updateData,
                    kurs: e.target.value,
                  });
                }}
                defaultValue={approval?.kurs}
                type="number"
              />
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

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
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
                <Th>ид</Th>
                <Th>Категория</Th>
                <Th>Отдел получател</Th>
                <Th>Дата</Th>
                <Th>Конь получатель</Th>
                <Th>Сумма (сумм)</Th>
                <Th>Сумма $</Th>
                <Th>Общая сумма</Th>
                <Th>Выданная сумма</Th>
                <Th>Закрыто в%</Th>
                <Th>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pays?.map((p, i) => {
                return (
                  <Tr key={i}>
                    <Td>{p.apply_id}</Td>
                    <Td>{p.cathegory}</Td>
                    <Td>{p.receiver_department}</Td>
                    <Td>{moment(p.createdAt).locale("ru").format("L")}</Td>
                    <Td>{p.receiver_finish}</Td>
                    <Td>
                      {accounting.formatNumber(p.amount_in_sum, 0, " ")} so'm
                    </Td>
                    <Td>
                      ${accounting.formatNumber(p.amount_in_dollar, 0, " ")}
                    </Td>
                    <Td>
                      {accounting.formatNumber(
                        p.amount_in_dollar * course + Number(p.amount_in_sum),
                        0,
                        " "
                      )}{" "}
                      so'm
                    </Td>
                    <Td>
                      {accounting.formatNumber(
                        p?.approvals
                          ?.map((p) => {
                            return (
                              Number(p.amount_dollar) * course +
                              Number(p.amount_sum)
                            );
                          })
                          ?.reduce((a, b) => {
                            return Number(a) + Number(b);
                          }, 0),
                        0,
                        " "
                      )}{" "}
                      so'm
                    </Td>
                    <Td>
                      {Math.round(
                        (p?.approvals
                          ?.map((p) => {
                            return (
                              Number(p.amount_dollar) * course +
                              Number(p.amount_sum)
                            );
                          })
                          ?.reduce((a, b) => {
                            return Number(a) + Number(b);
                          }, 0) *
                          100) /
                          (p.amount_in_dollar * course +
                            Number(p.amount_in_sum))
                      )}{" "}
                      %
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Действия
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              moreOnOpen();
                              setId(p);
                            }}
                            icon={<InfoIcon />}
                          >
                            Подробное
                          </MenuItem>
                          <MenuItem
                            icon={<CheckIcon />}
                            isDisabled={
                              p.amount_in_dollar * course +
                                Number(p.amount_in_sum) >
                              p?.approvals
                                ?.map((p) => {
                                  return (
                                    Number(p.amount_dollar) * course +
                                    Number(p.amount_sum)
                                  );
                                })
                                ?.reduce((a, b) => {
                                  return Number(a) + Number(b);
                                }, 0)
                                ? false
                                : true
                            }
                            colorScheme="teal"
                            onClick={() => {
                              onOpen();
                              setId(p);
                            }}
                          >
                            Выдать
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setApply(p);
                              deleteOnOpen();
                            }}
                            icon={<DeleteIcon />}
                          >
                            Удалить
                          </MenuItem>
                        </MenuList>
                      </Menu>

                      {/* <Button>Выдать</Button> */}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <DynamicPagination
          totalCount={totalPages}
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

export default PaySalary;
