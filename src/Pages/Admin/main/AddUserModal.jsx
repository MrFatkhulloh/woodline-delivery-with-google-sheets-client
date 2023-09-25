import {
  Button,
  FormControl,
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
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { OpenModalContext } from "../../../Contexts/ModalContext/ModalContext";
import { instance } from "../../../config/axios.instance.config";

// export const companies = [
//   {
//     id: 1,
//     name: "Юнусабад",
//     company_id: "1joMveTW7kRDxrENE4_3IErra9-2qVZasKYS2PE10Ees",
//   },
//   {
//     id: 2,
//     name: "Чиланзар",
//     company_id: "1WD4_q3GUsiKocqzPzwXEESJdxbMUXPY4kgTKlHhQiH4",
//   },
//   {
//     id: 3,
//     name: "B to B 2023",
//     company_id: "1lA6JYkdRyH8qFs_UYEpqzlCujAX0PIFtRQl9_6RI6MU",
//   },
// ];

const AddUserModal = ({ onOpen, isOpen, onClose }) => {
  const { token } = useContext(OpenModalContext);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [companys, setCompanys] = useState([]);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    password: "",
    company_id: "1joMveTW7kRDxrENE4_3IErra9-2qVZasKYS2PE10Ees",
    role: "SELLER",
  });

  const handleChange = (key, value) => {
    const newUserData = {
      ...user,
      [key]: value,
    };
    setUser(newUserData);
  };

  const sendData = () => {
    axios
      .post(
        "/seller",
        { ...user },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);

        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, []);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Добавить пользователя</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Input
              ref={initialRef}
              placeholder="Введите имя пользователя"
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <Input
              placeholder="Введите пароль пользователя"
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <Input
              placeholder="Введите номер телефона пользователя"
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <Select
              placeholder="Выбрать компанию"
              onChange={(e) => handleChange("comp_id", e.target.value)}
            >
              {companys.length &&
                companys.map((company, comp_index) => (
                  <option key={comp_index} value={company.id}>
                    {company.name}
                  </option>
                ))}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <Select
              placeholder="Выберите роль"
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="ADMIN">Администратор</option>
              <option value="SELLER">Продавец</option>
              <option value="COURIER">Доставщик</option>
              <option value="DELIVERY_TELLER">Кассир отдел доставки</option>
              <option value="PRODUCER">Пред прениматель</option>
              <option value="STOREKEEPER">Кладовщик</option>
              <option value="MAIN_STOREKEEPER">Главный кладовщик</option>
              <option value="MATERIAL_ACCOUNTANT">
                Материальный бухгалтер
              </option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={sendData}>
            Добавить пользователя
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
