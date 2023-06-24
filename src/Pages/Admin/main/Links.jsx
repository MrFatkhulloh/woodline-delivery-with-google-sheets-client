import {
  Button,
  Flex,
  Heading,
  Switch,
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
import Layout from "../../../components/layout/layout";
import AddUserModal from "./AddUserModal";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { OpenModalContext } from "../../../Contexts/ModalContext/ModalContext";
import EditUserModal from "./EditUserModal";

const companies = [
  {
    id: 1,
    name: "Юнусабад",
    company_id: "1joMveTW7kRDxrENE4_3IErra9-2qVZasKYS2PE10Ees",
  },
  {
    id: 2,
    name: "Чиланзар",
    company_id: "1WD4_q3GUsiKocqzPzwXEESJdxbMUXPY4kgTKlHhQiH4",
  },
  {
    id: 3,
    name: "B to B 2023",
    company_id: "1lA6JYkdRyH8qFs_UYEpqzlCujAX0PIFtRQl9_6RI6MU",
  },
];

export default function AdminLinkList() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: editOpen,
    isOpen: editIsOpen,
    onClose: editClose,
  } = useDisclosure();
  const { token } = useContext(OpenModalContext);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [reload, setReload] = useState(false);

  const handleActive = (activeIndex) => {
    const newUsers = users.map((user, index) => {
      if (activeIndex == index) {
        return {
          ...user,
          is_active: !user.is_active,
        };
      }
      return user;
    });
    setUsers(newUsers);
  };

  const handleActivate = (activeIndex) => {
    const foundUser = users[activeIndex];
    axios
      .patch(
        "/seller",
        {
          user_id: foundUser.id,
          is_active: !foundUser.is_active,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      )
      .then((response) => {
        handleActive(activeIndex);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("/sellers", {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reload]);

  const { colorMode } = useColorMode();

  return (
    <>
      <AddUserModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} />

      <EditUserModal
        reload={reload}
        setReload={setReload}
        onOpen={editOpen}
        isOpen={editIsOpen}
        onClose={editClose}
        user={userId}
      />

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Пользователи
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Добавить пользователя
          </Button>
        </Flex>
        <TableContainer>
          <Table
            variant="simple"
            background={colorMode === "light" ? "#fff" : ""}
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Имя пользователя</Th>
                <Th>Пользовательский пароль</Th>
                <Th>Телефон пользователя</Th>
                <Th>Компания</Th>
                <Th>Роль</Th>
                <Th>Активен</Th>
                <Th>Изменять</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.length &&
                users.map((e, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{e.name}</Td>
                    <Td>{e.password}</Td>
                    <Td>{e?.phone}</Td>
                    <Td>
                      {
                        companies.find(
                          (comp) => comp.company_id == e.company_id
                        )?.name
                      }
                    </Td>
                    <Td>{e?.role}</Td>
                    <Td>
                      <Switch
                        size="lg"
                        colorScheme="green"
                        defaultChecked={e.is_active}
                        onChange={() => handleActivate(i)}
                      />
                    </Td>
                    <Td>
                      <Button
                        colorScheme="yellow"
                        onClick={() => {
                          setUserId(e);
                          editOpen();
                        }}
                      >
                        Изменять
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Layout>
    </>
  );
}
