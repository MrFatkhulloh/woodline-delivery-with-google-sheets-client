import {
  Button,
  Flex,
  Heading,
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
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import { toast } from "react-toastify";
import { instance } from "../../config/axios.instance.config";
import { accounting } from "accounting";

const ModelRow = ({
  element,
  handleChange,
  setReady,
  ready,
  i,
  types,
  setRequireData,
}) => {
  const [isNew, setIsNew] = useState(true);
  const [companys, setCompanys] = useState([]);

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, []);

  const handleCheck = (name, index) => {
    axios
      .get(`/has-model/${name}`)
      .then((response) => {
        // window.location.reload();
        if (response.data) {
          const newReady = ready.map((ele, ind) => {
            if (ind == index - 1) return false;
            return ele;
          });
          setReady(newReady);
          setIsNew(false);
        } else {
          const newReady = ready.map((ele, ind) => {
            if (ind == index - 1) return true;
            return ele;
          });
          setReady(newReady);
          setIsNew(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (
    element?.type_id?.length &&
    element?.name?.length &&
    element?.code?.length &&
    element?.price > 0 &&
    element?.company_id?.length
  ) {
    setRequireData(true);
  }
  return (
    <>
      <Tr key={i} id={element.id}>
        <Td>{element.id}</Td>
        <Td>
          <Select
            placeholder="Выберите вид..."
            name="type"
            id={element.id}
            onChange={(event) => {
              handleChange(event.target.id, "type_id", event.target.value);
            }}
            onBlur={(event) =>
              handleChange(event.target.id, "type_id", event.target.value)
            }
          >
            {types.length &&
              types.map((element, index) => (
                <option key={index} value={element.id}>
                  {element.name}
                </option>
              ))}
          </Select>
        </Td>
        <Td>
          <Input
            variant={"filled"}
            id={element.id}
            onChange={(e) => {
              handleChange(e.target.id, "name", e.target.value);
            }}
            onBlur={(e) => {
              handleChange(e.target.id, "name", e.target.value);
              handleCheck(e.target.value, e.target.id);
            }}
            type="text"
            defaultValue={element.name}
          />
        </Td>
        <Td>
          <Input
            variant={"filled"}
            id={element.id}
            onChange={(e) => {
              handleChange(e.target.id, "code", e.target.value);
            }}
            onBlur={(e) => {
              handleChange(e.target.id, "code", e.target.value);
              handleCheck(e.target.value, e.target.id);
            }}
            type="text"
            defaultValue={element.code}
          />
        </Td>
        <Td>
          <Input
            variant={"filled"}
            id={element.id}
            onChange={(e) => {
              e.target.value = accounting.formatNumber(e.target.value, 0, " ");
              accounting.unformat(e.target.value, 0, " ");
              handleChange(
                e.target.id,
                "price",
                accounting.unformat(e.target.value, 0, " ")
              );
              handleCheck(e.target.value, e.target.id);
            }}
            onBlur={(e) => {
              e.target.value = accounting.formatNumber(e.target.value, 0, " ");
              accounting.unformat(e.target.value, 0, " ");
              handleChange(
                e.target.id,
                "price",
                accounting.unformat(e.target.value, 0, " ")
              );
              handleCheck(e.target.value, e.target.id);
            }}
            type="text"
            defaultValue={element.price}
          />
        </Td>

        <Td>
          <Select
            placeholder="Выберите компанию"
            name="type"
            id={element.id}
            onChange={(event) => {
              handleChange(event.target.id, "company_id", event.target.value);
            }}
            onBlur={(event) =>
              handleChange(event.target.id, "company_id", event.target.value)
            }
          >
            {companys.length &&
              companys.map((element, index) => (
                <option key={index} value={element.id}>
                  {element.name}
                </option>
              ))}
          </Select>
        </Td>
      </Tr>
    </>
  );
};

export default function NewModelModal({
  myOpen,
  myOnOpen,
  myOnClose,
  reload,
  setReload,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, types } = useContext(OpenModalContext);
  const [models, setModels] = useState([
    { id: 1, name: "", code: "", price: "", company_id: "", type_id: "" },
  ]);
  const [model_names, setModel_names] = useState([{ id: 1, name: "" }]);
  const [ready, setReady] = useState(true);
  const [addModelLoading, setAddModelLoading] = useState(false);
  const [requireData, setRequireData] = useState(false);
  const { colorMode } = useColorMode();

  const handleChange = (rowId, name, value) => {
    const updatedRows = models.map((row) => {
      if (row.id == rowId) {
        return {
          ...row,
          [name]: value,
        };
      } else {
        return row;
      }
    });
    setModels(updatedRows);
  };

  const handlePlus = () => {
    setModels([
      ...models,
      {
        id: models.length + 1,
        name: "",
        code: "",
        price: "",
        company_id: "",
        type_id: "",
      },
    ]);
    setModel_names([...model_names, { id: model_names.length + 1, name: "" }]);
  };

  const handleSubmit = () => {
    setAddModelLoading(true);
    setReady(false);
    axios
      .post(
        "/models",
        {
          data: models,
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
console.log(models)
          myOnClose();
          setModels([
            {
              id: 1,
              name: "",
              code: "",
              price: "",
              company_id: "",
              type_id: "",
            },
          ]);
          setRequireData(false);
          toast.success("Добавлена новая модель");
        }
      })
      .finally(() => {
        setReady(true);
        setAddModelLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // console.log(models);
  return (
    <>
      <Modal
        mx={{ base: "20px" }}
        isOpen={myOpen}
        onClose={myOnClose}
        size={"7xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить модель</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setModels([
                {
                  id: 1,
                  name: "",
                  code: "",
                  price: "",
                  company_id: "",
                  type_id: "",
                },
              ]);
              setRequireData(false);
            }}
          />
          <ModalBody>
            <TableContainer>
              <Table
                variant="simple"
                background={colorMode === "light" ? "#fff" : ""}
              >
                <Thead>
                  <Tr>
                    <Th>№</Th>
                    <Th>Вид мебели</Th>
                    <Th>Модель</Th>
                    <Th>Артикул</Th>
                    <Th>Цена</Th>
                    <Th>Компания</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {models.length &&
                    models.map((e, i) => (
                      <ModelRow
                        key={i}
                        ready={ready}
                        element={e}
                        setReady={setReady}
                        handleChange={handleChange}
                        i={i}
                        types={types}
                        setRequireData={setRequireData}
                      />
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mx={3}
              my={5}
            >
              <Button onClick={handlePlus}>+</Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!requireData ? true : false}
              isLoading={addModelLoading}
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              {"Создать"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                myOnClose();
                setModels([
                  {
                    id: 1,
                    name: "",
                    code: "",
                    price: "",
                    company_id: "",
                    type_id: "",
                  },
                ]);
                setRequireData(false);
              }}
            >
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
