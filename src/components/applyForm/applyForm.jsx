import { useContext, useEffect, useState } from "react";
import accounting from "accounting";
import axios from "axios";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import { Spinner } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

function ModalForm() {
  const [state, setState] = useState(1);
  const { openApply, setOpenApply, setOrderShow, token } =
    useContext(OpenModalContext);
  const [cathegory, setCathegory] = useState("Аванс");
  const [receiverDepartment, setReceiverDepartment] = useState("Юнусабад");
  const [receiverFinish, setReceiverFinish] = useState("");
  const [amountInSum, setAmountInSum] = useState(0);
  const [amountInDollars, setAmountInDollars] = useState(0);
  const [load, setLoad] = useState(false);

  const onClose = () => {
    setOpenApply(false);
    setOrderShow(true);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    // Submit the form data
    setLoad(true);
    axios
      .post(
        "/apply",
        {
          cathegory,
          receiver_department: receiverDepartment,
          receiver_finish: receiverFinish,
          amount_in_sum: amountInSum,
          amount_in_dollar: accounting.unformat(amountInDollars),
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        onClose();
      })
      .finally(() => {
        setLoad(false);
      })
      .catch((error) => {
        console.error(error);
      });
    setCathegory("");
    setReceiverDepartment("");
    setReceiverFinish("");
    setAmountInSum("");
    setAmountInDollars("");
  };

  if (!openApply) {
    return null;
  }

  return (
    <Modal isOpen={openApply} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Подача заявки</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Подача заявки</FormLabel>
            <Select
              name="cathegory"
              id="cathegory"
              onChange={(e) => setCathegory(e.target.value)}
              onBlur={(e) => setCathegory(e.target.value)}
              placeholder="Категория"
            >
              <option value="Аванс">Аванс</option>
              <option value="З.П.">З.П.</option>
              <option value="Строительство">Строительство</option>
              <option value="Канцелярия">Канцелярия</option>
              <option value="Закуп сыря">Закуп сыря</option>
              <option value="Прочие расходы">Прочие расходы</option>
              <option value="Оплата поставщику готовых товаров">
                Оплата поставщику готовых товаров
              </option>
              <option value="Личный расход">Личный расход</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Отдел получатель</FormLabel>

            <Select
              name="receiver_department"
              id="receiver_department"
              onChange={(e) => setReceiverDepartment(e.target.value)}
              onBlur={(e) => setReceiverDepartment(e.target.value)}
              placeholder="Отдел получатель"
            >
              <option value="Юнусабад">Юнусабад</option>
              <option value="Чиланзар">Чиланзар</option>
              <option value="Урта">Урта</option>
              <option value="Кола">Кола</option>
              <option value="Снабжение">Снабжение</option>
              <option value="Логистика">Логистика</option>
              <option value="Отдел продаж">Отдел продаж</option>
              <option value="Отдел маркетинга">Отдел маркетинга</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Фин. отдел">Фин. отдел</option>
              <option value="Тех. отдел">Тех. отдел</option>
              <option value="Учредители">Учредители</option>
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Конечный получатель</FormLabel>
            <Input
              type="text"
              value={receiverFinish}
              onChange={(event) => {
                setReceiverFinish(event.target.value);
                setState(state + 1);
              }}
              required={true}
              placeholder="Конечный получатель"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Сумма (сум)</FormLabel>
            <Input
              placeholder="Сумма (сум)"
              type="text"
              value={accounting.formatNumber(amountInSum, 0, " ")}
              onChange={(event) =>
                setAmountInSum(accounting.unformat(event.target.value))
              }
              onBlur={(event) =>
                setAmountInSum(accounting.unformat(event.target.value))
              }
              required
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Сумма ($)</FormLabel>
            <Input
              placeholder="Сумма ($)"
              type="text"
              value={accounting.formatNumber(amountInDollars, 0, " ")}
              onChange={(event) =>
                setAmountInDollars(
                  accounting.formatNumber(event.target.value, 0, " ")
                )
              }
              onBlur={(event) =>
                setAmountInDollars(
                  accounting.formatNumber(event.target.value, 0, " ")
                )
              }
              required
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
            {load ? "loading..." : "Подать"}
            <Spinner display={load ? "block" : "none"} />
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalForm;
