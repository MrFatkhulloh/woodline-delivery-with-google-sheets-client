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
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import NewModelModal from "./AddNewModelModal";

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
  const { token, types } = useContext(OpenModalContext);
  const [isNew, setIsNew] = useState(true);
  const [type_name, setType_name] = useState("");
  const [model_names, setModel_names] = useState([{ id: 1, name: "" }]);
  const [ready, setReady] = useState(true);
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios
      .get("/models", {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setModels(response.data);
      })
      .catch((error) => {
        console.error(error);
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
        console.log("nothing");
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
    console.log({ type_name, model_names });
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
        console.log(response.data);
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
            <Button w={{ base: "100%" }} onClick={onOpen}>
              Добавить Вид мебели
            </Button>
            <Button w={{ base: "100%" }} onClick={myOnOpen}>
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
                <Table variant="simple">
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

        <TableContainer>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>№</Th>
                <Th>Вид_мебели</Th>
                <Th>Модель</Th>
              </Tr>
            </Thead>

            <Tbody>
              {models.length > 0 ? (
                models.map((model, modelIndex) => (
                  <Tr>
                    <Td>{modelIndex + 1}</Td>
                    <Td>{model?.furniture_type?.name}</Td>
                    <Td>{model.name}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
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
