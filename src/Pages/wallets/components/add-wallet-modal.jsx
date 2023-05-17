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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { instance } from "../../../config/axios.instance.config";
import { toast } from "react-toastify";

const AddWalletModal = ({ isOpen, onClose, reload, setReload }) => {
  const [walletData, setWalletData] = useState({
    name: "",
    type: "",
    amount_sum: 0,
    amount_dollar: 0,
  });
  const [loading, setLoading] = useState(false);

  function checkObjectValues(obj) {
    let values = Object.values(obj);
    if (values.filter((v) => v === "").length === 0) {
      return true;
    }
    return false;
  }

  const handleCreateWallet = () => {
    if (checkObjectValues(walletData)) {
      setLoading(true);
      instance
        .post("/wallet", { ...walletData })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Wallet qoshildi");
          }
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            toast.warning("Вы не подключены к Интернету !");
          } else {
            toast.error("Без изменений, попробуйте еще раз !");
          }
        })
        .finally(() => {
          setLoading(false);
          setReload(!reload);
          onClose();
        });
    } else {
      toast.warning("Inputlar bo'sh bo'lmasligi kerak");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Wallet qo'shish</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Wallet name</FormLabel>
            <Input
              onChange={(e) =>
                setWalletData({ ...walletData, name: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Type</FormLabel>
            <Input
              onChange={(e) =>
                setWalletData({ ...walletData, type: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Summa (sum)</FormLabel>
            <Input
              onChange={(e) =>
                setWalletData({ ...walletData, amount_sum: e.target.value })
              }
              type="number"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Summa $</FormLabel>
            <Input
              onChange={(e) =>
                setWalletData({ ...walletData, amount_dollar: e.target.value })
              }
              type="number"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={loading ? true : false}
            colorScheme="blue"
            mr={3}
            onClick={handleCreateWallet}
          >
            Qo'shish
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWalletModal;
