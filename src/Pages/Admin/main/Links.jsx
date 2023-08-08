import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { instance } from "../../../config/axios.instance.config";
import DynamicPagination from "../../../components/pagin/pagin";

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

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteClose,
  } = useDisclosure();

  const { token } = useContext(OpenModalContext);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [reload, setReload] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

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
      .get(`/seller/pagination?page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.sellers);
        setCount(response.data.totalAmount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reload, page, limit]);

  useEffect(() => {
    searchValue !== "" &&
      instance.get(`/search-seller?search=${searchValue}`).then((res) => {
        setSearchedUsers(res.data);
      });
  }, [searchValue]);

  const { colorMode } = useColorMode();

  const handleDeleteUser = () => {
    setDeleteLoading(true);
    instance
      .delete(`/user/${userId}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${res.data}`);

          setReload(!reload);
        }
      })
      .finally(() => {
        setDeleteLoading(false);
        deleteClose();
      });
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

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

      <Modal
        closeOnOverlayClick={false}
        isOpen={deleteIsOpen}
        onClose={deleteClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вы уверены, что хотите удалить?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button
              isLoading={deleteLoading}
              onClick={() => {
                handleDeleteUser();
              }}
              colorScheme="blue"
              mr={3}
            >
              Да
            </Button>
            <Button onClick={onClose}>Нет</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Пользователи
          </Heading>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Действия
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen} icon={<AddIcon />}>
                Добавить пользователя
              </MenuItem>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Поиск"
                />
              </InputGroup>
            </MenuList>
          </Menu>
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
              {users?.map((e, i) => (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{e.name}</Td>
                  <Td>{e.password}</Td>
                  <Td>{e?.phone}</Td>
                  <Td>
                    {
                      companies.find((comp) => comp.company_id == e.company_id)
                        ?.name
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
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Действия
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            setUserId(e);
                            editOpen();
                          }}
                          icon={<EditIcon />}
                        >
                          Изменять
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setUserId(e.id);
                            deleteOnOpen();
                          }}
                          icon={<DeleteIcon />}
                        >
                          Удалить
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <DynamicPagination
          totalCount={count}
          itemsPerPage={5}
          pageSize={limit}
          currentPage={page}
          onPageChange={handlePageChange}
        >
          <Select
            defaultValue={limit}
            ml={4}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Choose"
            w={100}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </Select>
        </DynamicPagination>
      </Layout>
    </>
  );
}
