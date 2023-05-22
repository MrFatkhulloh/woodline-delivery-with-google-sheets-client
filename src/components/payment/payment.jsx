import { useContext, useEffect, useState } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import accounting from "accounting";
import {
  Button,
  Flex,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";

function PaymentRow({ e, handleChange, typeOptions, handleMinus, i }) {
  const [payment_type, setPayment_type] = useState(e.payment_type);
  const [paymentSum, setPaymentSum] = useState(e.payment_sum);
  const [paymentDollar, setPaymentDollar] = useState(e.payment_$);
  const [kurs, setKurs] = useState(e.kurs);
  const [change, setChange] = useState(e.change);

  useEffect(() => {
    setPaymentSum(e.payment_sum);
    setPaymentDollar(e.payment_$);
    setKurs(e.kurs);
    setChange(e.change);
    setPayment_type(payment_type);
  }, [paymentSum, paymentDollar, kurs, change, payment_type]);

  return (
    <Tr>
      <Td>
        {" "}
        <Select
          w="200px"
          variant="outline"
          placeholder="select payment type..."
          name="payment_type"
          id={e.id}
          defaultValue={payment_type}
          onChange={(event) =>
            handleChange(event, event.target.id, "payment_type")
          }
          onBlur={(event) =>
            handleChange(event, event.target.id, "payment_type")
          }
        >
          {typeOptions.map((el, ind) => (
            <option key={ind} value={el?.name}>
              {el?.name}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        {" "}
        <Input
          w={"200px"}
          variant="filled"
          type="text"
          name="payment_sum"
          id={e.id}
          value={accounting.formatNumber(paymentSum, 0, " ")} //{e.payment_sum}
          onChange={(event) => {
            handleChange(event, event.target.id, "payment_sum");
            setPaymentSum(accounting.unformat(event.target.value));
          }}
          onBlur={(event) => {
            handleChange(event, event.target.id, "payment_sum");
            setPaymentSum(accounting.unformat(event.target.value));
          }}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          variant="filled"
          type="text"
          name="payment_$"
          id={e.id}
          value={accounting.formatNumber(paymentDollar, 0, " ")}
          onChange={(event) => {
            handleChange(event, event.target.id, "payment_$");
            setPaymentDollar(accounting.unformat(event.target.value));
          }}
          onBlur={(event) => {
            handleChange(event, event.target.id, "payment_$");
            setPaymentDollar(accounting.unformat(event.target.value));
          }}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          variant="filled"
          type="text"
          name="kurs"
          id={e.id}
          value={accounting.formatNumber(kurs, 0, " ")}
          onChange={(event) => {
            handleChange(event, event.target.id, "kurs");
            setKurs(accounting.unformat(event.target.value));
          }}
          onBlur={(event) => {
            handleChange(event, event.target.id, "kurs");
            setKurs(accounting.unformat(event.target.value));
          }}
        />
      </Td>
      <Td>{accounting.formatNumber(e.amount_by_kurs, 0, " ")}</Td>
      <Td>
        <Input
          w={"200px"}
          variant="filled"
          type="text"
          name="change"
          id={e.id}
          value={accounting.formatNumber(change, 0, " ")}
          onChange={(event) => {
            handleChange(event, event.target.id, "change");
            setChange(accounting.unformat(event.target.value));
          }}
          onBlur={(event) => {
            handleChange(event, event.target.id, "change");
            setChange(accounting.unformat(event.target.value));
          }}
        />
      </Td>
      <Td>{accounting.formatNumber(e.total_sum, 0, " ")}</Td>
      <Td>
        <IconButton onClick={() => handleMinus(i)} icon={<MinusIcon />} />
      </Td>
    </Tr>
  );
}

function PaymentTable({
  isOpen,
  onClose,
  onOpen,
  temporaryPaymentRow,
  setTemporaryPaymentRow,
  selectedOrder,
  rowIndex,
}) {
  const { paymentRow, setPaymentRow, openFinal, wallets, d2cDeliveryRow } =
    useContext(OpenModalContext);
  const [uuid, setUuid] = useState("");
  const [state, setState] = useState(1);

  const typeOptions = wallets?.length
    ? wallets
    : [
        "нал. касса",
        "нал. другой",
        "перечисление ( терминал)",
        "карта узкарт(Мадина8379)",
        "карта узкарт(Умид8142)",
        "карта узкарт(Дамир7762)",
        "карта узкарт(Толиб3824)",
        "хумо(Интизор2863)",
        "рассрочка(анорБанк)",
      ];

  useEffect(() => {
    const newUuid = d2cDeliveryRow[rowIndex]?.delivery_uuid;
    console.log("new_uuid - ", newUuid);
    const payRow = temporaryPaymentRow?.map((pay) => {
      return {
        ...pay,
        delivery_uuid: newUuid,
      };
    });

    setTemporaryPaymentRow(payRow);
    setUuid(newUuid);
  }, [rowIndex]);

  const handleMinus = (index) => {
    temporaryPaymentRow.splice(index, 1);
    const newRow = temporaryPaymentRow.map((row, i) => {
      return {
        ...row,
        id: i + 1,
      };
    });
    setTemporaryPaymentRow(newRow);
  };

  const handleSubmit = () => {
    const filteredRow = temporaryPaymentRow.filter((e) => e.total_sum != 0);
    const filteredPayment = paymentRow.filter(
      (e) => e?.order_id != selectedOrder?.id && e?.order_id != ""
    );
    const newRow = [...filteredPayment, ...filteredRow].map(
      (row, row_index) => {
        return {
          ...row,
          id: row_index + 1,
        };
      }
    );
    setPaymentRow(newRow);
    onClose();
  };

  const handlePlus = () => {
    temporaryPaymentRow.push({
      id: temporaryPaymentRow?.length + 1,
      payment_type: "",
      payment_sum: 0,
      payment_$: 0,
      kurs: 0,
      amount_by_kurs: 0,
      change: 0,
      total_sum: 0,
      rest_money: 0,
      deal_id: selectedOrder?.deal?.id,
      order_id: selectedOrder?.id,
      wallet_id: "",
      delivery_uuid: d2cDeliveryRow[rowIndex]?.delivery_uuid,
    });
    setTemporaryPaymentRow(temporaryPaymentRow);
    setState(state + 1);
  };

  function handleChange(event, rowId, fieldName) {
    const updatedRows = temporaryPaymentRow.map((row) => {
      if (row.id == rowId) {
        if (fieldName == "payment_type") {
          return {
            ...row,
            [fieldName]: event.target.value,
            wallet_id: wallets.find(
              (wallet) => wallet.name == event.target.value
            )?.id
              ? wallets.find((wallet) => wallet.name == event.target.value)?.id
              : "",
          };
        }
        if (fieldName == "payment_sum") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["total_sum"]:
              accounting.unformat(event.target.value) * 1 +
              (row.payment_$ * row.kurs) / 100 -
              row.change,
          };
        }
        if (fieldName == "payment_$") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["total_sum"]:
              row.payment_sum * 1 +
              (accounting.unformat(event.target.value) * row.kurs) / 100 -
              row.change,
            ["amount_by_kurs"]:
              (accounting.unformat(event.target.value) * row.kurs) / 100,
          };
        }
        if (fieldName == "kurs") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["total_sum"]:
              (row.payment_$ * accounting.unformat(event.target.value)) / 100 +
              row.payment_sum * 1 -
              row.change,
            ["amount_by_kurs"]:
              (accounting.unformat(event.target.value) * row.payment_$) / 100,
          };
        }
        if (fieldName == "change") {
          return {
            ...row,
            [fieldName]: accounting.unformat(event.target.value),
            ["total_sum"]:
              (row.payment_$ * row.kurs) / 100 +
              row.payment_sum * 1 -
              accounting.unformat(event.target.value),
          };
        }
        return {
          ...row,
          [fieldName]: event.target.value,
        };
      } else {
        return row;
      }
    });
    setTemporaryPaymentRow(updatedRows);
  }

  return (
    <>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mx={5}>Modal Title</ModalHeader>
          <ModalCloseButton mx={5} />
          <ModalBody>
            <Heading ml={5} my={5} variant="h2" size="lg">
              Оплата
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Вид оплаты</Th>
                    <Th>Оплата (сум)</Th>
                    <Th>Оплата ($)</Th>
                    <Th>курс-$100</Th>
                    <Th>Сумма по курсу</Th>
                    <Th>здачи</Th>
                    <Th>Итого (сум)</Th>
                    <Th>Удалить строка</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {temporaryPaymentRow &&
                    temporaryPaymentRow.map((e, i) => {
                      return (
                        <PaymentRow
                          key={i}
                          e={e}
                          handleChange={handleChange}
                          typeOptions={typeOptions}
                          handleMinus={handleMinus}
                          i={i}
                        />
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              my={5}
              mx={5}
              className="footer_buttons"
            >
              <Button onClick={handlePlus}>+</Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleSubmit();
              }}
            >
              Сохранить
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PaymentTable;
