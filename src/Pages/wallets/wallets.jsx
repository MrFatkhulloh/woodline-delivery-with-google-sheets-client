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
import AddWalletModal from "./components/add-wallet-modal";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";

const Wallets = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [reload, setReload] = useState(false);

  const [wallets, setWallets] = useState([]);
  const [wallet, setWallet] = useState();

  useEffect(() => {
    instance.get("wallet").then((res) => setWallets(res.data));
  }, [reload]);

  const { colorMode } = useColorMode();

  const handleDeleteWallet = () => {
    setDeleteLoading(true);
    instance
      .delete(`/wallet/${wallet.id}`)
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
      <AddWalletModal
        isOpen={isOpen}
        onClose={onClose}
        reload={reload}
        setReload={setReload}
      />

      {/* Delete wallet */}

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
                handleDeleteWallet();
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
                <Th>ИМЯ</Th>
                <Th>ТИП</Th>
                <Th>СУММА (СУМ)</Th>
                <Th>СУММА (ДОЛЛОР)</Th>
                <Th>АКТИВЕН</Th>
                <Th>Действия</Th>
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
                    <Td>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Действия
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => {
                              setWallet(w);
                            }}
                          >
                            Изменять
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setWallet(w);
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

export default Wallets;
