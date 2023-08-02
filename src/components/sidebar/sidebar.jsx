import React, { useContext } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  useColorMode,
  Button,
  Menu,
  MenuButton,
  HStack,
  Avatar,
  VStack,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiDollarSign,
  FiHome,
  FiLayout,
  FiMenu,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";

import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export const routes = [
  {
    path: "/",
    name: "Дом",
    icon: <FiHome />,
    access_roles: ["SUPER_ADMIN", "DELIVERY_TELLER", "TELLER"],
  },
  {
    path: "/my-orders",
    name: "Рейсы",
    icon: <FiTruck />,
    access_roles: ["SUPER_ADMIN", "DELIVERY_TELLER", "TELLER", "ACCOUNTANT"],
  },
  {
    path: "/admin/new-furniture-type",
    name: "Модели",
    icon: <FiLayout />,
    access_roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    path: "/admin/category",
    name: "Вид мебели",
    icon: <FiLayout />,
    access_roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    path: "/admin/users",
    name: "Пользователи",
    icon: <FiUsers />,
    access_roles: ["SUPER_ADMIN"],
  },
  {
    path: "/pay-salary",
    name: "Заявки",
    icon: <FiDollarSign />,
    access_roles: ["SUPER_ADMIN", "ACCOUNTANT"],
  },
  {
    path: "/companys",
    name: "Компании",
    icon: null,
    access_roles: ["SUPER_ADMIN"],
  },
  {
    path: "/wallets",
    name: "Кошельки",
    icon: null,
    access_roles: ["ACCOUNTANT"],
  },
  {
    path: "/debts",
    name: "Долги",
    icon: <CurrencyExchangeIcon />,
    access_roles: ["SUPER_ADMIN", "ACCOUNTANT"],
  },
  {
    path: "/producer",
    name: "Продюсер",
    icon: null,
    access_roles: ["SUPER_ADMIN", "PRODUCER"],
  },
  {
    path: "/warehouse",
    name: "Склад",
    icon: null,
    access_roles: ["SUPER_ADMIN", "STOREKEEPER"],
  },
  {
    path: "/main-warehouse",
    name: "Главный склад",
    icon: null,
    access_roles: ["SUPER_ADMIN", "MAIN_STOREKEEPER"],
  },
  {
    path: "/analytics",
    name: "Аналитика",
    icon: <AutoGraphIcon />,
    access_roles: ["SUPER_ADMIN", "ACCOUNTANT"],
  },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const { role } = useContext(OpenModalContext);
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      overflow={"auto"}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          woodline
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {routes
        ?.filter((froute) => froute?.access_roles?.includes(role))
        ?.map((route) => (
          <NavLink to={route?.path}>
            <Flex
              className={pathname === route.path ? "active" : ""}
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === route.path
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === route.path
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                {route?.icon}
              </Icon>
              {route?.name}
            </Flex>
          </NavLink>
        ))}
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const { setOrderShow, setOpenApply, role, name } =
    useContext(OpenModalContext);

  const logOut = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontWeight="bold"
      >
        woodline
      </Text>

      <Flex gap={"20px"} alignItems={"center"}>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={""} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {role}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Профиль</MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenApply(true);
                  setOrderShow(false);
                }}
              >
                Подача заявки на оплату
              </MenuItem>
              <MenuItem onClick={logOut}>Выйти</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Flex>
  );
};
