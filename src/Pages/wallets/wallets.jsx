import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Button,
  Flex,
  Heading,
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
import AddWalletModal from "./components/add-wallet-modal";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";

const Wallets = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reload, setReload] = useState(false);

  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    instance.get("wallet").then((res) => setWallets(res.data));
  }, [reload]);

  const { colorMode } = useColorMode();

  return (
    <>
      <AddWalletModal
        isOpen={isOpen}
        onClose={onClose}
        reload={reload}
        setReload={setReload}
      />
      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Кошельки
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Добавить кошелек
          </Button>
        </Flex>

        <TableContainer>
          <Table
            variant="simple"
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>amount sum</Th>
                <Th>amount dollor</Th>
                <Th>is active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {wallets?.map((w, i) => {
                return (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{w.name}</Td>
                    <Td>{w.type}</Td>
                    <Td>
                      {accounting.formatNumber(w.amount_sum, 0, " ")} so'm
                    </Td>
                    <Td>
                      $ {accounting.formatNumber(w.amount_dollar, 0, " ")}
                    </Td>
                    <Td>
                      <Switch
                        size="lg"
                        colorScheme="green"
                        defaultChecked={w?.is_active}
                      />
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

export default Wallets;
