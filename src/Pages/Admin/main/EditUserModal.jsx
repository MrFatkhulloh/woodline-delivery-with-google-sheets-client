import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { companies } from "./AddUserModal";
import { toast } from "react-toastify";
import { instance } from "../../../config/axios.instance.config";

const EditUserModal = ({
  onOpen,
  isOpen,
  onClose,
  user,
  reload,
  setReload,
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    password: "",
    phone: "",
    company_id: "",
    role: "",
  });
  const [companys, setCompanys] = useState([]);

  function removeNullKeys(obj) {
    Object.keys(obj)?.forEach(function (key) {
      if (obj[key] === "") {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        removeNullKeys(obj[key]);
      }
    });
    return obj;
  }

  const handleEdit = () => {
    const copyData = { ...editData };
    delete copyData.company_id;

    setLoading(true);
    instance
      .put(`/user/${user.id}`, {
        ...removeNullKeys({ ...copyData, comp_id: editData.company_id }),
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Пользователь успешно изменен !");
        }
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          toast.warning("Вы не подключены к Интернету !");
        } else {
          toast.error("Без изменений, попробуйте еще раз");
        }
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
        onClose();
      });
  };

  useEffect(() => {
    instance.get("/company").then((res) => {
      setCompanys(res.data);
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Изменить пользователя</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Изменить имя</FormLabel>
            <Input
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              defaultValue={user.name}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Изменить пароль</FormLabel>
            <InputGroup size="md">
              <Input
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
                defaultValue={user.password}
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  variant="unstyled"
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  as={show ? ViewOffIcon : ViewIcon}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Изменить телефон</FormLabel>
            <Input
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              defaultValue={user.phone}
              type="text"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Изменить компания</FormLabel>

            <Select
              onChange={(e) =>
                setEditData({ ...editData, comp_id: e.target.value })
              }
              defaultValue={user.id}
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

          <FormControl mt={4}>
            <FormLabel>Изменить роль</FormLabel>
            <Select
              onChange={(e) =>
                setEditData({ ...editData, role: e.target.value })
              }
              defaultValue={user.role}
              placeholder="Выберите роль"
            >
              <option value="ADMIN">Администратор</option>
              <option value="SELLER">Продавец</option>
              <option value="COURIER">Доставщик</option>
              <option value="DELIVERY_TELLER">Кассир отдел доставки</option>
              <option value="PRODUCER">Предпрениматель</option>
              <option value="STOREKEEPER">Кладовщик</option>
              <option value="MAIN_STOREKEEPER">Главный кладовщик</option>
              <option value="MATERIAL_ACCOUNTANT">
                Материальный бухгалтер
              </option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={loading ? true : false}
            colorScheme="blue"
            mr={3}
            onClick={handleEdit}
          >
            Изменить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
