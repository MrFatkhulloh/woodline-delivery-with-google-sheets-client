import {
  Button,
  FormControl,
  FormLabel,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { instance } from "../../../config/axios.instance.config";
import { toast } from "react-toastify";
import accounting from "accounting";

const PayModal = ({ isOpen, onClose, id, reload, setReload }) => {
  const [companys, setCompanys] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    amount_sum: 0,
    amount_dollar: 0,
    kurs: 0,
    wallet_id: "",
    company_id: "",
    transaction_fee: 0,
  });

  useEffect(() => {
    instance.get("/company").then((res) => setCompanys(res.data));
    instance.get("/wallet").then((res) => setWallets(res.data));
  }, []);

  function checkObjectValues(obj) {
    let values = Object.values(obj);
    if (values.filter((v) => v === "").length === 0) {
      return true;
    }
    return false;
  }

  const handleCreatePayment = () => {
    if (checkObjectValues(data)) {
      setLoading(true);
      instance
        .post(`/approval/${id.id}`, { ...data })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Succeded");
          }
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            toast.warning("Internetni yoq uka");
          } else {
            toast.error("bolmadi qayta urinib kor uka !");
          }
        })
        .finally(() => {
          setLoading(false);
          setReload(!reload);
          onClose();
        });
    } else {
      toast.warning("inputlar bo'sh bolmasin uka !");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Платить заявки</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Сумма (сум)</FormLabel>
            <Input
              onChange={(e) => {
                e.target.value = accounting.formatNumber(
                  e.target.value,
                  0,
                  " "
                );
                setData({
                  ...data,
                  amount_sum: accounting.unformat(e.target.value),
                });
              }}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Сумма $</FormLabel>
            <Input
              onChange={(e) => {
                e.target.value = accounting.formatNumber(
                  e.target.value,
                  0,
                  " "
                );
                setData({
                  ...data,
                  amount_dollar: accounting.unformat(e.target.value),
                });
              }}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Курс $100</FormLabel>
            <Input
              onChange={(e) => {
                e.target.value = accounting.formatNumber(
                  e.target.value,
                  0,
                  " "
                );
                setData({
                  ...data,
                  kurs: accounting.unformat(e.target.value),
                });
              }}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>С какого кашелка</FormLabel>

            <Select
              onChange={(e) => setData({ ...data, wallet_id: e.target.value })}
              placeholder="выбрать кошелек"
            >
              {wallets?.map((w, i) => {
                return (
                  <option key={i} value={w.id}>
                    {w.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Комиссия %</FormLabel>
            <Input
              onChange={(e) => {
                e.target.value = accounting.formatNumber(
                  e.target.value,
                  0,
                  " "
                );
                setData({
                  ...data,
                  transaction_fee: accounting.unformat(e.target.value),
                });
              }}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Компания</FormLabel>

            <Select
              onChange={(e) => setData({ ...data, company_id: e.target.value })}
              placeholder="Выбрать компанию"
            >
              {companys?.map((c, i) => {
                return (
                  <option key={i} value={c.id}>
                    {c.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={loading ? true : false}
            colorScheme="blue"
            mr={3}
            onClick={handleCreatePayment}
          >
            Платить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PayModal;
