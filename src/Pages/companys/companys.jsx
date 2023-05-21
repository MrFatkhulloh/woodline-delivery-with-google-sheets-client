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
  useDisclosure,
} from "@chakra-ui/react";
import AddCompanyModal from "./components/add-company-modal";
import { instance } from "../../config/axios.instance.config";
import EditCompanyModal from "./components/edit-company-modal";

const Companys = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: editOpen,
    isOpen: editIsOpen,
    onClose: editClose,
  } = useDisclosure();
  const [reload, setReload] = useState(false);

  const [companys, setCompanys] = useState([]);
  const [company, setCompany] = useState({});

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, [reload]);

  return (
    <>
      <AddCompanyModal
        isOpen={isOpen}
        onClose={onClose}
        reload={reload}
        setReload={setReload}
      />

      <EditCompanyModal
        company={company}
        onClose={editClose}
        isOpen={editIsOpen}
        reload={reload}
        setReload={setReload}
      />

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Компании
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>Добавить kомпании</Button>
        </Flex>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ид</Th>
                <Th>Имя</Th>
                <Th>Статусы</Th>
                <Th>Активен</Th>
                <Th>Изменять</Th>
              </Tr>
            </Thead>

            <Tbody>
              {companys?.map((c, i) => {
                return (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{c.name}</Td>
                    <Td>{c.status}</Td>
                    <Td>
                      <Switch
                        size="lg"
                        colorScheme="green"
                        defaultChecked={c?.is_active}
                      />
                    </Td>
                    <Td>
                      <Button
                        onClick={() => {
                          setCompany(c);
                          editOpen();
                        }}
                        colorScheme="yellow"
                      >
                        Изменять
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

export default Companys;
