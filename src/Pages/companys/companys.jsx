import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import AddCompanyModal from "./components/add-company-modal";
import { instance } from "../../config/axios.instance.config";
import EditCompanyModal from "./components/edit-company-modal";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";

const Companys = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: editOpen,
    isOpen: editIsOpen,
    onClose: editClose,
  } = useDisclosure();
  const [reload, setReload] = useState(false);

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [companys, setCompanys] = useState([]);
  const [company, setCompany] = useState({});

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, [reload]);

  const { colorMode } = useColorMode();

  const handleDeleteCompany = () => {
    setDeleteLoading(true);
    instance
      .delete(`/company/${company.id}`)
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
                handleDeleteCompany();
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
            Компании
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Добавить компания
          </Button>
        </Flex>

        <TableContainer>
          <Table
            variant="simple"
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>ид</Th>
                <Th>Имя</Th>
                <Th>Статусы</Th>
                <Th>Активен</Th>
                <Th>Действия</Th>
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
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Действия
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => {
                              editOpen();
                              setCompany(c);
                            }}
                          >
                            Изменять
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setCompany(c);
                              deleteOnOpen();
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
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Layout>
    </>
  );
};

export default Companys;
