import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import accounting from "accounting";
import Layout from "../components/layout/layout";
import { useContext, useEffect, useState } from "react";
import { OpenModalContext } from "../Contexts/ModalContext/ModalContext";
import axios from "axios";

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const { token } = useContext(OpenModalContext);

  useEffect(() => {
    axios
      .get("/deliveries", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setMyOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <Layout>
        <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
          Рейсы
        </Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Курер</Th>
                <Th>Вознаграждение</Th>
                <Th>ID</Th>
                <Th>Клиент</Th>
                <Th>Телефон</Th>
                <Th>Остаток</Th>
                <Th>Статус</Th>
              </Tr>
            </Thead>
            <Tbody>
              {myOrders.length > 0 ? (
                myOrders.map((e, i) => {
                  return (
                    <Tr key={i}>
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
      </Layout>
    </>
  );
}
