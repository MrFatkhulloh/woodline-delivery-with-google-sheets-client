import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Button,
  Flex,
  Heading,
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

const PaySalary = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [pays, setPays] = useState([]);
  const [id, setId] = useState({});
  const [reload, setReload] = useState(false);
  const [course, setCourse] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    instance.get(`/applies?page=${page}&limit=${limit}`).then((res) => {
      setPays(res?.data?.allApplies);
      setCourse(res?.data?.kurs);
    });
  }, [reload, limit, page]);

  const handlePageChange = (p) => {
    setPage(p);
  };

  const { colorMode } = useColorMode();

  return (
    <>
      <PayModal
        isOpen={isOpen}
        onClose={onClose}
        id={id}
        reload={reload}
        setReload={setReload}
      />

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Заявки
          </Heading>

          <Select
            width={"200px"}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Choose"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </Select>
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
                <Th>Выдать</Th>
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
                      <Button
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
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <DynamicPagination
          totalItems={100}
          itemsPerPage={5}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </Layout>
    </>
  );
};

export default PaySalary;
