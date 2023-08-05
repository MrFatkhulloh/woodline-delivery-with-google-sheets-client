import React, { useContext, useState } from "react";
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
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { instance } from "../../config/axios.instance.config";
import { toast } from "react-toastify";

const Category = () => {
  const { colorMode } = useColorMode();
  const { types, reload, setReload } = useContext(OpenModalContext);
  const {
    isOpen: updateIsOpen,
    onOpen: updateOpen,
    onClose: updateClose,
  } = useDisclosure();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [furnitureType, setFurnitureType] = useState();
  const [newName, setNewName] = useState("");

  const handleUpdateSubmit = () => {
    setUpdateLoading(true);
    instance
      .put(`/furniture-type/${furnitureType?.id}`, {
        name: newName,
      })
      .then((res) => {
        if (res.status === 200) {
          setReload(!reload);
          toast.success("Updated");
          updateClose();
        }
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const handleDeleteFrunitureType = () => {
    setDeleteLoading(true);
    instance
      .delete(`/delete-category/${furnitureType.id}`)
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
    <Layout>
      {/* UPDATE MODAL */}

      <Modal mx={{ base: "20px" }} isOpen={updateIsOpen} onClose={updateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменить</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Изменить имя</FormLabel>

              <Input
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                defaultValue={furnitureType?.name}
                type="text"
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

      {/* DELETE MODAL */}

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
                handleDeleteFrunitureType();
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

      <Flex justifyContent="space-between" alignItems="center">
        <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
          Вид мебели
        </Heading>
      </Flex>

      <TableContainer>
        <Table
          variant={"simple"}
          background={colorMode === "light" ? "#fff" : ""}
        >
          <Thead>
            <Tr>
              <Th>№</Th>
              <Th>Вид_мебели</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>

          <Tbody>
            {types?.map((t, i) => (
              <Tr key={t.id}>
                <Td>{i + 1}</Td>
                <Td>{t.name}</Td>
                <Td>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Действия
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => {
                          updateOpen();
                          setFurnitureType(t);
                        }}
                      >
                        Изменять
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFurnitureType(t);
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
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Category;
