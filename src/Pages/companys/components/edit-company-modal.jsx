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

const EditCompanyModal = ({ isOpen, onClose, reload, setReload, company }) => {
  const [companyData, setCompanyData] = useState({
    name: "",
    company_id: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  function removeNullKeys(obj) {
    Object.keys(obj).forEach(function (key) {
      if (obj[key] === "") {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        removeNullKeys(obj[key]);
      }
    });
    return obj;
  }

  const handleEditCompany = () => {
    setLoading(true);
    instance
      .put(`/company/${company.id}`, { ...removeNullKeys(companyData) })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Компания успешно преобразована !");
        }
      })
      .catch((err) => {
        console.log(err);
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Изменить компанию</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Изменить компании</FormLabel>
            <Input
              defaultValue={company.name}
              onChange={(e) =>
                setCompanyData({ ...companyData, name: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Изменить компании ид</FormLabel>
            <Input
              defaultValue={company.company_id}
              onChange={(e) =>
                setCompanyData({ ...companyData, company_id: e.target.value })
              }
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Изменить Статус</FormLabel>

            <Select
              defaultValue={company.status}
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
            onClick={handleEditCompany}
          >
            Изменить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCompanyModal;
