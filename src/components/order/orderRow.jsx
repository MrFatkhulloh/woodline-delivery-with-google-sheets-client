import { Button, Input, Select, Td, Text, Tr, Box } from "@chakra-ui/react";
import accounting from "accounting";
import { useContext, useEffect, useState } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";

function OrderRow({
  i,
  e,
  handleChange,
  deliveryRow,
  cathegoryOptions,
  typeOptions,
  modelOptions,
  allModels,
  handleMinus,
  handleDeliveryChange,
}) {
  const [models, setModels] = useState(modelOptions);
  const filterModels = (selectType) => {
    const filteredModels = allModels.filter((e) => e.type == selectType);
    setModels(filteredModels);
  };
  return (
    <Tr>
      <Td>
        {e.cathegory == "заказ" ? (
          <Input
            type="text"
            placeholder={"авто"}
            value={e.orderId}
            disabled={true}
            id={e.id}
            onChange={(event) =>
              handleChange(event, event.target.id, "orderId")
            }
            onBlur={(event) => {
              handleChange(event, event.target.id, "orderId");
            }}
          />
        ) : (
          <Input
            maxLength={7}
            w={"200px"}
            type="text"
            placeholder={e.cathegory == "заказ" ? "авто" : "id"}
            value={e.orderId}
            id={e.id}
            onChange={(event) =>
              handleChange(event, event.target.id, "orderId")
            }
            onBlur={(event) => {
              handleChange(event, event.target.id, "orderId");
            }}
          />
        )}
      </Td>
      <Td>
        {" "}
        <Select
          w={"200px"}
          placeholder="Выберите вид..."
          name="type"
          value={e.type}
          id={e.id}
          onChange={(event) => {
            handleChange(event, event.target.id, "type");
            filterModels(event.target.value);
          }}
          onBlur={(event) => {
            handleChange(event, event.target.id, "type");
            filterModels(event.target.value);
          }}
        >
          {typeOptions.map((el, ind) => (
            <option key={ind} value={el.name}>
              {el.name}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        <Select
          w={"200px"}
          placeholder="Выберите модель..."
          name="model"
          id={e.id}
          value={e.model}
          onChange={(event) => handleChange(event, event.target.id, "model")}
          onBlur={(event) => handleChange(event, event.target.id, "model")}
        >
          {models.map((el, ind) => (
            <option key={ind} value={el.id}>
              {el.name}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        <Input
          w={"200px"}
          placeholder="ТКАНЬ..."
          type="text"
          id={e.id}
          value={e.tissue}
          onChange={(event) => handleChange(event, event.target.id, "tissue")}
          onBlur={(event) => handleChange(event, event.target.id, "tissue")}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          type="text"
          id={e.id}
          value={e.title}
          onChange={(event) => handleChange(event, event.target.id, "title")}
          onBlur={(event) => handleChange(event, event.target.id, "title")}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          type="number"
          id={e.id}
          value={accounting.unformat(e.qty)}
          onChange={(event) => handleChange(event, event.target.id, "qty")}
          onBlur={(event) => handleChange(event, event.target.id, "qty")}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          type="text"
          id={e.id}
          value={accounting.formatNumber(deliveryRow[i]?.price, 0, " ")}
          onChange={(event) =>
            handleDeliveryChange(event, event.target.id, "price")
          }
        />
      </Td>
      <Td>
        <Button onClick={() => handleMinus(i)}>-</Button>
      </Td>
    </Tr>
  );
}

function D2COrderRow({
  i,
  e,
  handleChange,
  d2cDeliveryRow,
  modelOptions,
  allModels,
  handleMinus,
  handleDeliveryChange,
  handleSelectModel,
  setFoundOrders,
  handleSelectPayment,
}) {
  const { paymentRow, setPaymentRow } = useContext(OpenModalContext);
  const [models, setModels] = useState(modelOptions);
  const filterModels = (selectType) => {
    const filteredModels = allModels.filter((e) => e.type == selectType);
    setModels(filteredModels);
  };

  const [rest, setRest] = useState(
    e?.order?.deal?.rest * 1 -
      paymentRow
        .filter((payment) => payment.deal_id == e?.order?.deal?.id)
        .reduce((a, b) => a + b?.total_sum, 0)
  );
  const [payment_sum, setPaynent_sum] = useState(
    paymentRow
      .filter((payment) => payment.order_id == e?.order?.id)
      .reduce((a, b) => a + b?.total_sum * 1, 0)
  );

  useEffect(() => {
    const newPaymentSum = paymentRow
      .filter((payment) => payment.order_id == e?.order?.id)
      .reduce((a, b) => a + b?.total_sum, 0);

    const newRestSum =
      e?.order?.deal?.rest * 1 -
      paymentRow
        .filter((payment) => payment.deal_id == e?.order?.deal?.id)
        .reduce((a, b) => a + b?.total_sum, 0) *
        1 +
      newPaymentSum * 1;
    setPaynent_sum(newPaymentSum);
    setRest(newRestSum);
  }, [paymentRow]);

  return (
    <Tr>
      <Td>
        <Box
          cursor={"pointer"}
          onClick={() => {
            handleSelectModel(i);
            if (e?.order?.id) {
              setFoundOrders([e?.order]);
            }
          }}
        >
          {e?.order?.id ? e?.order?.order_id : "Выберите ID"}
          <Text>
            {e?.order?.id
              ? "\n" + e?.order?.model?.name + " - " + e?.order?.tissue
              : ""}
          </Text>
        </Box>
      </Td>
      <Td>
        <Text cursor={"pointer"}>
          {e?.order?.id
            ? accounting.formatNumber(e?.order?.deal?.rest, 0, " ") + " sum"
            : "Выберите ID"}
        </Text>
      </Td>
      <Td>
        <Text
          onClick={() => handleSelectPayment(i)}
          w={"200px"}
          type="text"
          id={e.id}
          cursor={"pointer"}
        >
          {accounting.formatNumber(payment_sum, 0, " ") + " sum"}
        </Text>
      </Td>
      <Td>
        <Input
          w={"200px"}
          type="text"
          id={e.id}
          value={e.title}
          onChange={(event) => handleChange(event, event.target.id, "title")}
          onBlur={(event) => handleChange(event, event.target.id, "title")}
        />
      </Td>
      <Td>
        <Input
          w={"200px"}
          type="text"
          id={e.id}
          value={accounting.formatNumber(d2cDeliveryRow[i]?.price, 0, " ")}
          onChange={(event) =>
            handleDeliveryChange(event, event.target.id, "price")
          }
        />
      </Td>
      <Td>
        <Button
          onClick={() => {
            const filteredPayment = paymentRow.filter(
              (pay) => pay.order_id != e?.order?.id
            );
            setPaymentRow(filteredPayment);
            handleMinus(i);
          }}
        >
          -
        </Button>
      </Td>
    </Tr>
  );
}

export { OrderRow, D2COrderRow };
