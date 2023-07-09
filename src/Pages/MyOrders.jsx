import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { useContext, useEffect, useState } from "react";
import { OpenModalContext } from "../Contexts/ModalContext/ModalContext";
import axios from "axios";
import moment from "moment";
import "moment/locale/ru";

export default function MyOrders() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [myOrders, setMyOrders] = useState([]);
  const { token } = useContext(OpenModalContext);
  const { colorMode } = useColorMode();

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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Salom alekum</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
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
