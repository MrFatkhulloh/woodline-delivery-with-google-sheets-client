import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";


export default function Simple() {
  const { role } = useContext(OpenModalContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logOut = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Container maxW={"1400px"}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Heading variant="h5" size="md">
                Woodline
              </Heading>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                <NavLink to="/">Дом</NavLink>

                <NavLink to="/my-orders">Рейсы</NavLink>
                {role == "ADMIN" ? (
                  <>
                    <NavLink to="/admin/new-furniture-type">Модели</NavLink>
                  </>
                ) : role == "SUPER_ADMIN" ? (
                  <>
                    <NavLink to="/admin/new-furniture-type">Модели</NavLink>
                    <NavLink to="/admin/users">Пользователи</NavLink>
                    <NavLink to={"/pay-salary"}>Заявки</NavLink>
                    <NavLink to={"/companys"}>Компании</NavLink>
                    <NavLink to={"/wallets"}>Кошельки</NavLink>
                  </>
                ) : role == "ACCOUNTANT" ? (
                  <>
                    <NavLink to={"/pa-salary"}>Заявки</NavLink>
                    <NavLink to={"/wallets"}>Кошельки</NavLink>
                  </>
                ) : (
                  null
                )}
              </HStack>
            </HStack>
            <Flex gap={"20px"} alignItems={"center"}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Button onClick={logOut}>Log Out</Button>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                <NavLink to="/">Дом</NavLink>

                <NavLink to="/my-orders">Мои заказы</NavLink>

                {role == "ADMIN" ? (
                  <>
                    <NavLink to="/admin/new-furniture-type">Модели</NavLink>
                  </>
                ) : role == "SUPER_ADMIN" ? (
                  <>
                    <NavLink to="/admin/new-furniture-type">Модели</NavLink>
                    <NavLink to="/admin/users">Пользователи</NavLink>
                  </>
                ) : (
                  <div>"Вы пока не админ!"</div>
                )}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
}
