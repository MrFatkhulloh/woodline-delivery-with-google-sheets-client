import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import PayModal from "./components/pay-modal";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";
import moment from "moment";
import "moment/locale/ru";
import Items from "../../components/pagin/pagin";
import Pagination from "rc-pagination";

const PaySalary = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [pays, setPays] = useState([]);
  const [id, setId] = useState({});
  const [reload, setReload] = useState(false);
  const [course, setCourse] = useState(0);

  useEffect(() => {
    instance.get("/applies").then((res) => {
      setPays(res?.data?.allApplies);
      setCourse(res?.data?.kurs);
    });
  }, [reload]);

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
        </Flex>

        <TableContainer>
          <Table variant="simple">
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

      </Layout>
    </>
  );
};

export default PaySalary;
