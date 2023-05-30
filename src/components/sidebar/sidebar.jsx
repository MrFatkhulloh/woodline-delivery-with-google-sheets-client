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
} from "@chakra-ui/react";
import { FiHome, FiMenu } from "react-icons/fi";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChairIcon from "@mui/icons-material/Chair";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import WalletIcon from "@mui/icons-material/Wallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

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
          Woodline
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <NavLink
        to="/"
        style={{ display: "inline-block", width: "100%", borderRadius: "0px" }}
      >
        <Flex alignItems="center" p="3" role="group" cursor="pointer" {...rest}>
          <Icon mr="4" fontSize="20">
            <HomeIcon />
          </Icon>
          Дом
        </Flex>
      </NavLink>

      <NavLink
        to="/my-orders"
        style={{ display: "inline-block", width: "100%", borderRadius: "0px" }}
      >
        <Flex alignItems="center" p="3" role="group" cursor="pointer" {...rest}>
          <Icon mr="4" fontSize="20">
            <LocalShippingIcon />
          </Icon>
          Рейсы
        </Flex>
      </NavLink>

      {role == "ADMIN" ? (
        <>
          <NavLink
            to="/admin/new-furniture-type"
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Модели
            </Flex>
          </NavLink>
        </>
      ) : role == "SUPER_ADMIN" ? (
        <>
          <NavLink
            to="/admin/new-furniture-type"
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <ChairIcon />
              </Icon>
              Модели
            </Flex>
          </NavLink>
          <NavLink
            to="/admin/users"
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <SupervisorAccountIcon />
              </Icon>
              Пользователи
            </Flex>
          </NavLink>
          <NavLink
            to={"/pay-salary"}
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <RequestQuoteIcon />
              </Icon>
              Заявки
            </Flex>
          </NavLink>
          <NavLink
            to={"/companys"}
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <HomeWorkIcon />
              </Icon>
              Компании
            </Flex>
          </NavLink>
          <NavLink
            to={"/wallets"}
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20">
                <WalletIcon />
              </Icon>
              Кошельки
            </Flex>
          </NavLink>
        </>
      ) : role == "ACCOUNTANT" ? (
        <>
          <NavLink
            to={"/pa-salary"}
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Заявки
            </Flex>
          </NavLink>
          <NavLink
            to={"/wallets"}
            style={{
              display: "inline-block",
              width: "100%",
              borderRadius: "0px",
            }}
          >
            <Flex
              alignItems="center"
              p="3"
              role="group"
              cursor="pointer"
              {...rest}
            >
              <Icon mr="4" fontSize="20" />
              Кошельки
            </Flex>
          </NavLink>
        </>
      ) : null}

      <NavLink
        to="/analytics"
        style={{ display: "inline-block", width: "100%", borderRadius: "0px" }}
      >
        <Flex alignItems="center" p="3" role="group" cursor="pointer" {...rest}>
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
        Woodline
      </Text>

      <Flex gap={"20px"} alignItems={"center"}>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>

        <Button onClick={logOut}>Log Out</Button>
      </Flex>
    </Flex>
  );
};
