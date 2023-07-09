import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import NewModelModal from "./AddNewModelModal";
import DynamicPagination from "../../components/pagin/pagin";
import { instance } from "../../config/axios.instance.config";
import { toast } from "react-toastify";
import { EditIcon } from "@chakra-ui/icons";

const ModelRow = ({ element, handleChange, setReady }) => {
  const [modelHas, setModelHas] = useState(false);
  return (
    <>
      <Tr id={element.id}>
        <Td>{element.id}</Td>
        <Td>
          <Input
            variant={"filled"}
            id={element.id}
            onChange={(e) => {
              handleChange(e.target.id, e.target.value);
            }}
            onBlur={(e) => handleChange(e.target.id, e.target.value)}
            type="text"
            defaultValue={element.name}
          />
        </Td>
      </Tr>
    </>
  );
};

export default function NewFurnitureType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: myOpen,
    onOpen: myOnOpen,
    onClose: myOnClose,
  } = useDisclosure();

  const {
    isOpen: updateIsOpen,
    onOpen: updateOpen,
    onClose: updateClose,
  } = useDisclosure();

  const { token, types } = useContext(OpenModalContext);
  const [isNew, setIsNew] = useState(true);
  const [type_name, setType_name] = useState("");
  const [model_names, setModel_names] = useState([{ id: 1, name: "" }]);
  const [ready, setReady] = useState(true);
  const [models, setModels] = useState([]);
  const { colorMode } = useColorMode();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState();
  const [model, setModel] = useState();
  const [newModelName, setNewModelName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`/models?page=${page}&limit=${limit}`, {
        headers: {
          token,
          "Content-Typmodele": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.totalAmount);
        setModels(response.data.models);
        setTotalPages(response.data.totalAmount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page, limit, updateLoading]);

  const checkType = (name) => {
    const foundType = types.find((e) => e.name == name);
    if (foundType) {
      setIsNew(false);
      setReady(false);
    } else {
      setIsNew(true);
      setReady(true);
    }
  };

  const handleChange = (rowId, name) => {
    const updatedRows = model_names.map((row) => {
      if (row.id == rowId) {
        return {
          ...row,
          name,
        };
      } else {
        return row;
      }
    });
    setModel_names(updatedRows);
  };

  const handlePlus = () => {
    setModel_names([...model_names, { id: model_names.length + 1, name: "" }]);
  };

  const handleSubmit = () => {
    if (!ready) return;
    setReady(false);
    axios
      .post(
        "/new-type-with-models",
        {
          data: { type_name, model_names },
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        window.location.reload();
        // setReady(true);
      })
      .finally(() => {
        setReady(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangeStatusModel = (model) => {
    instance
      .put(`/model/${model.id}`, { is_active: !model.is_active })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Updated model status");
        }
      });
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleUpdateSubmit = () => {
    setUpdateLoading(true);
    instance
      .put(`/model/${model.id}`, { name: newModelName })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Updated model name");
        }
      })
      .finally(() => {
        setUpdateLoading(false);
        updateClose();
      });
  };


  return (
    <>
      <Layout>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Вид мебели
          </Heading>
          <Flex
            mt={{ base: "10px" }}
            mb={{ base: "20px" }}
            fontSize={{ base: "5px", md: "15px", lg: "20px" }}
            alignItems={"center"}
            gap={{ base: "5px", md: "10px", lg: "20px" }}
            flexDirection={{ base: "column", md: "row", lg: "row" }}
          >
            <Button colorScheme="blue" w={{ base: "100%" }} onClick={onOpen}>
              Добавить Вид мебели
            </Button>
            <Button colorScheme="blue" w={{ base: "100%" }} onClick={myOnOpen}>
              Добавить модель
            </Button>
          </Flex>
        </Flex>

        {/* ADD new furn type Model of modal */}

        <Modal
          mx={{ base: "20px" }}
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Добавить Вид мебели</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex alignItems={"center"} gap={4}>
                <Text isTruncated>Новый вид мебели:</Text>
                <Input
                  placeholder="Новый вид мебели..."
                  onChange={(e) => setType_name(e.target.value)}
                  onBlur={(e) => {
                    setType_name(e.target.value);
                    checkType(e.target.value);
                  }}
                  type="text"
                />
              </Flex>
              <TableContainer my={5}>
                <Table
                  variant="simple"
                  background={colorMode === "light" ? "#fff" : ""}
                >
                  <Thead>
                    <Tr>
                      <Th>№</Th>
                      <Th>Модель</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {model_names.length &&
                      model_names.map((e, i) => (
                        <ModelRow
                          key={i}
                          element={e}
                          handleChange={handleChange}
                          setReady={setReady}
                        />
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mx={3}
                my={5}
              >
                <Button onClick={handlePlus}>+</Button>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                {ready ? "Создать" : "loading..."}
                <Spinner display={ready ? "none" : "block"} />
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Закрывать
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* ADD new model of modal */}

        <NewModelModal
          myOpen={myOpen}
          myOnOpen={myOnOpen}
          myOnClose={myOnClose}
        />

        {/* UPDATE model name */}

        <Modal
          mx={{ base: "20px" }}
          isOpen={updateIsOpen}
          onClose={updateClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Изменить название модели</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Изменить имя</FormLabel>

                <Input
                  onChange={(e) => {
                    setNewModelName(e.target.value);
                  }}
                  defaultValue={model?.name}
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

        <TableContainer>
          <Table
            variant={"simple"}
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>№</Th>
                <Th>Вид_мебели</Th>
                <Th>Модель</Th>
                <Th>Статус</Th>
                <Th>Изменять</Th>
              </Tr>
            </Thead>

            <Tbody>
              {models.length > 0 ? (
                models.map((model, modelIndex) => (
                  <Tr>
                    <Td>{modelIndex + 1}</Td>
                    <Td>{model?.furniture_type?.name}</Td>
                    <Td>{model.name}</Td>
                    <Td>
                      <Switch
                        defaultChecked={model.is_active}
                        onChange={() => handleChangeStatusModel(model)}
                        colorScheme="green"
                        size="lg"
                      />
                    </Td>
                    <Td>
                      <IconButton
                        onClick={() => {
                          updateOpen();
                          setModel(model);
                        }}
                        colorScheme="yellow"
                        icon={<EditIcon />}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                  <Td>ПОКА ПУСТО!</Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          <DynamicPagination
            totalCount={totalPages}
            itemsPerPage={5}
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
        </TableContainer>
      </Layout>
    </>
  );
}
