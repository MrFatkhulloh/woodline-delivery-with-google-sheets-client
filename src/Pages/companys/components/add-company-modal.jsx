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
import React, { useState } from "react";
import { instance } from "../../../config/axios.instance.config";
import { toast } from "react-toastify";

const AddCompanyModal = ({ isOpen, onClose, reload, setReload }) => {
  const [companyData, setCompanyData] = useState({
    name: "",
    company_id: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  function trimObjectValues(obj) {
    let values = Object.values(obj);

    Object.keys(obj).forEach((key, index) => {
      obj[key] = values[index].trim();
    });

    return obj;
  }

  function checkObjectValues(obj) {
    let values = Object.values(obj);
    if (values.filter((v) => v === "").length === 0) {
      return true;
    }
    return false;
  }

  const handleCreateCompany = () => {
    if (checkObjectValues(companyData)) {
      setLoading(true);
      instance
        .post("/company", { ...trimObjectValues(companyData) })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Компания успешно создана !");
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
          setCompanyData({
            name: "",
            company_id: "",
            status: "",
          });
          onClose();
        });
    } else {
      toast.warning("Входные данные не должны быть пустыми");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Создать новую компанию</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Название компании</FormLabel>
            <Input
              onChange={(e) =>
                setCompanyData({ ...companyData, name: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Ид компании</FormLabel>
            <Input
              onChange={(e) =>
                setCompanyData({ ...companyData, company_id: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Статус компании</FormLabel>

            <Select
              onChange={(e) =>
                setCompanyData({ ...companyData, status: e.target.value })
              }
              placeholder="Выберите статус"
            >
              <option value="new">New</option>
              <option value="main">Main</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={loading ? true : false}
            colorScheme="blue"
            mr={3}
            onClick={handleCreateCompany}
          >
            Создать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCompanyModal;
