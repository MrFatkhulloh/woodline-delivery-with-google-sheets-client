import React, { ReactNode, useContext } from "react";
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
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChairIcon from "@mui/icons-material/Chair";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import WalletIcon from "@mui/icons-material/Wallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import "./sidebar.css";

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
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          woodline
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <NavLink to="/">
        <Flex
          alignItems="center"
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={
            pathname === "/"
              ? colorMode === "light"
                ? "blue.500"
                : "blue.200"
              : ""
          }
          color={
            pathname === "/"
              ? colorMode === "light"
                ? "#fff"
                : "gray.800"
              : ""
          }
          {...rest}
        >
          <Icon mr="4" fontSize="20">
            <FiHome />
          </Icon>
          Дом
        </Flex>
      </NavLink>

      <NavLink to="/my-orders">
        <Flex
          alignItems="center"
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={
            pathname === "/my-orders"
              ? colorMode === "light"
                ? "blue.500"
                : "blue.200"
              : ""
          }
          color={
            pathname === "/my-orders"
              ? colorMode === "light"
                ? "#fff"
                : "gray.800"
              : ""
          }
          {...rest}
        >
          <Icon mr="4" fontSize="20">
            <FiTruck />
          </Icon>
          Рейсы
        </Flex>
      </NavLink>

      {role == "ADMIN" ? (
        <>
          <NavLink to="/admin/new-furniture-type">
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/admin/new-furniture-type"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/admin/new-furniture-type"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Модели
            </Flex>
          </NavLink>
        </>
      ) : role == "SUPER_ADMIN" ? (
        <>
          <NavLink to="/admin/new-furniture-type">
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/admin/new-furniture-type"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/admin/new-furniture-type"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <FiLayout />
              </Icon>
              Модели
            </Flex>
          </NavLink>
          <NavLink to="/admin/category">
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/admin/category"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/admin/category"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <FiLayout />
              </Icon>
              Вид мебели
            </Flex>
          </NavLink>
          <NavLink to="/admin/users">
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/admin/users"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/admin/users"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <FiUsers />
              </Icon>
              Пользователи
            </Flex>
          </NavLink>
          <NavLink to={"/pay-salary"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/pay-salary"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/pay-salary"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <FiDollarSign />
              </Icon>
              Заявки
            </Flex>
          </NavLink>
          <NavLink to={"/companys"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/companys"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/companys"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20"></Icon>
              Компании
            </Flex>
          </NavLink>
          <NavLink to={"/wallets"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/wallets"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/wallets"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20"></Icon>
              Кошельки
            </Flex>
          </NavLink>
          <NavLink to={"/debts"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/debts"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/debts"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <CurrencyExchangeIcon />
              </Icon>
              Долги
            </Flex>
          </NavLink>
          <NavLink to={"/producer"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/producer"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/producer"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Продюсер
            </Flex>
          </NavLink>
          <NavLink to={"/warehouse"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/warehouse"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/warehouse"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Склад
            </Flex>
          </NavLink>
          <NavLink to={"/main-warehouse"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/main-warehouse"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/main-warehouse"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Главный склад
            </Flex>
          </NavLink>
        </>
      ) : role == "ACCOUNTANT" ? (
        <>
          <NavLink to={"/pay-salary"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/pay-salary"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/pay-salary"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Заявки
            </Flex>
          </NavLink>
          <NavLink to={"/wallets"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/wallets"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/wallets"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Кошельки
            </Flex>
          </NavLink>
          <NavLink to={"/debts"}>
            <Flex
              alignItems="center"
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={
                pathname === "/debts"
                  ? colorMode === "light"
                    ? "blue.500"
                    : "blue.200"
                  : ""
              }
              color={
                pathname === "/debts"
                  ? colorMode === "light"
                    ? "#fff"
                    : "gray.800"
                  : ""
              }
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <CurrencyExchangeIcon />
              </Icon>
              Долги
            </Flex>
          </NavLink>
        </>
      ) : role == "PRODUCER" ? (
        <NavLink to={"/producer"}>
          <Flex
            alignItems="center"
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={
              pathname === "/producer"
                ? colorMode === "light"
                  ? "blue.500"
                  : "blue.200"
                : ""
            }
            color={
              pathname === "/producer"
                ? colorMode === "light"
                  ? "#fff"
                  : "gray.800"
                : ""
            }
            {...rest}
          >
            <Icon mr="4" fontSize="20" />
            Продюсер
          </Flex>
        </NavLink>
      ) : role == "STOREKEEPER" ? (
        <NavLink to={"/warehouse"}>
          <Flex
            alignItems="center"
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={
              pathname === "/warehouse"
                ? colorMode === "light"
                  ? "blue.500"
                  : "blue.200"
                : ""
            }
            color={
              pathname === "/warehouse"
                ? colorMode === "light"
                  ? "#fff"
                  : "gray.800"
                : ""
            }
            {...rest}
          >
            <Icon mr="4" fontSize="20" />
            Склад
          </Flex>
        </NavLink>
      ) : role == "MAIN_STOREKEEPER" ? (
        <NavLink to={"/main-warehouse"}>
          <Flex
            alignItems="center"
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={
              pathname === "/main-warehouse"
                ? colorMode === "light"
                  ? "blue.500"
                  : "blue.200"
                : ""
            }
            color={
              pathname === "/main-warehouse"
                ? colorMode === "light"
                  ? "#fff"
                  : "gray.800"
                : ""
            }
            {...rest}
          >
            <Icon mr="4" fontSize="20" />
            Главный склад
          </Flex>
        </NavLink>
      ) : null}

      <NavLink to="/analytics">
        <Flex
          alignItems="center"
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          bg={
            pathname === "/analytics"
              ? colorMode === "light"
                ? "blue.500"
                : "blue.200"
              : ""
          }
          color={
            pathname === "/analytics"
              ? colorMode === "light"
                ? "#fff"
                : "gray.800"
              : ""
          }
          cursor="pointer"
          {...rest}
        >
          <Icon mr="4" fontSize="20">
            <AutoGraphIcon />
          </Icon>
          Аналитика
        </Flex>
      </NavLink>
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
