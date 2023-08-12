import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
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
import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { accounting } from "accounting";

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

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [addFTypeLoading, setAddFTypeLoading] = useState(false);
  const [companys, setCompanys] = useState([]);
  const [compId, setCompId] = useState("");

  const [modelPrice, setModelPrice] = useState(0);
  const [modelSale, setModelSale] = useState(0);
  const [modelCode, setModelCode] = useState("");

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    searchValue.trim() !== ""
      ? instance.get(`/search-model?name=${searchValue}`).then((res) => {
          setModels(res.data);
        })
      : axios
          .get(`/models?page=${page}&limit=${limit}`, {
            headers: {
              token,
              "Content-Typmodele": "application/json",
            },
          })
          .then((response) => {
            // console.log(response.data.models);
            setModels(response.data.models);
            setTotalPages(response.data.totalAmount);
          })
          .catch((error) => {
            console.error(error);
          });
  }, [page, limit, updateLoading, reload, searchValue]);

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, []);

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
    setAddFTypeLoading(true);
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
        if (response.status === 200) {
          setReload(!reload);

          toast.success("Добавлен новый тип мебели");
        }
      })
      .finally(() => {
        setReady(true);
        setAddFTypeLoading(false);
        onClose();
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

          setReload(!reload);
        }
      });
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  const handleUpdateSubmit = () => {
    setUpdateLoading(true);
    instance
      .put(`/model/${model.id}`, {
        name: newModelName,
        company_id: compId,
        price: modelPrice,
        sale: modelSale,
        code: modelCode,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Updated model name");

          setReload(!reload);
        }
      })
      .finally(() => {
        setUpdateLoading(false);
        updateClose();
      });
  };

  const handleDeleteModel = () => {
    setDeleteLoading(true);
    instance
      .delete(`/models/${model.id}`)
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
      <Layout>
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
              <Button
                isLoading={addFTypeLoading}
                colorScheme="blue"
                mr={3}
                onClick={handleSubmit}
              >
                {"Создать"}
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
          reload={reload}
          setReload={setReload}
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

              <FormControl mt={4}>
                <FormLabel>изменить компанию</FormLabel>

                <Select
                  defaultValue={model?.company_id}
                  onChange={(e) => setCompId(e.target.value)}
                  placeholder="выбрать компанию"
                >
                  {companys?.map((company) => (
                    <option value={company?.id}>{company.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>изменить цена</FormLabel>

                <Input
                  onChange={(e) => {
                    e.target.value = accounting.formatNumber(
                      e.target.value,
                      0,
                      " "
                    );
                    setModelPrice(accounting.unformat(+e.target.value));
                    console.log(accounting.unformat(e.target.value));
                  }}
                  defaultValue={model?.price}
                  type="text"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>изменить распродажа</FormLabel>

                <Input
                  defaultValue={model?.sale}
                  onChange={(e) => setModelSale(e.target.value)}
                  type="number"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>код </FormLabel>

                <Input
                  defaultValue={model?.code}
                  onChange={(e) => setModelCode(e.target.value)}
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

        {/* Delete model */}

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
                  handleDeleteModel();
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

        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Модели
          </Heading>

          <Menu>
            <MenuButton
              colorScheme="blue"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Действия
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen} icon={<AddIcon />}>
                Добавить Вид мебели
              </MenuItem>
              <MenuItem onClick={myOnOpen} icon={<AddIcon />}>
                Добавить модель
              </MenuItem>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Поиск по имени"
                />
              </InputGroup>
            </MenuList>
          </Menu>
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
                <Th>Модель</Th>
                <Th>Статус</Th>
                <Th>Действия</Th>
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
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Действия
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => {
                              updateOpen();
                              setModel(model);
                            }}
                          >
                            Изменять
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setModel(model);
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

          {searchValue.trim() === "" ? (
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
          ) : null}
        </TableContainer>
      </Layout>
    </>
  );
}
