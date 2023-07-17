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
import { useContext, useState } from "react";
import Layout from "../../components/layout/layout";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import { toast } from "react-toastify";

const ModelRow = ({ element, handleChange, setReady, ready, i, types }) => {
  const [isNew, setIsNew] = useState(true);

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

  return (
    <>
      <Tr key={i} id={element.id}>
        <Td>{element.id}</Td>
        <Td>
          <Select
            placeholder="Выберите вид..."
            name="type"
            id={element.id}
            onChange={(event) =>
              handleChange(event.target.id, "type_id", event.target.value)
            }
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
  const [models, setModels] = useState([{ id: 1, name: "", type_id: "" }]);
  const [model_names, setModel_names] = useState([{ id: 1, name: "" }]);
  const [ready, setReady] = useState(true);
  const [addModelLoading, setAddModelLoading] = useState(false);
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
    setModels([...models, { id: models.length + 1, name: "", type_id: "" }]);
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

          myOnClose();

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
  return (
    <>
      <Modal
        mx={{ base: "20px" }}
        isOpen={myOpen}
        onClose={myOnClose}
        size={"6xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить модель</ModalHeader>
          <ModalCloseButton />
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
              isLoading={addModelLoading}
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              {"Создать"}
            </Button>
            <Button variant="ghost" onClick={myOnClose}>
              Закрывать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
