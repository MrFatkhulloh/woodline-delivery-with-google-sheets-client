import axios from "axios";
import React, { useContext, useState } from "react"; // Set the app element for accessibility
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { OpenModalContext } from "../../Contexts/ModalContext/ModalContext";
import { routes } from "../sidebar/sidebar";

export default function LoginModal() {
  const { state, setState } = useContext(OpenModalContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [disable, setDisable] = useState(true);

  const handleSubmit = (e) => {
    if (name !== "" && password !== "") {
      setLoading(true);
      e.preventDefault();
      // Handle login logic here
      axios
        .post("/login", {
          name: name.trim(),
          password: password.trim(),
        })
        .then((response) => {
          if (response.data != "Error") {
            setLoading(false);
            window.localStorage.setItem("token", response.data?.token.token);
            window.localStorage.setItem("role", response.data?.token.role);
            window.localStorage.setItem("name", response.data?.token.name);

            let foundAccessRoute = routes?.find((fr) =>
              fr.access_roles.includes(response.data?.token.role)
            );

            // window.location.href = "/";
            navigate(foundAccessRoute?.path);
            setState(state + 1);
            // window.location.reload();
          } else {
            window.localStorage.removeItem("token");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Login</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="text">
              <FormLabel>Name</FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => setName(e.target.value)}
                type="text"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => setPassword(e.target.value)}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                isDisabled={name !== "" && password !== "" ? false : true}
                isLoading={loading}
                onClick={handleSubmit}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                {"Сохранять"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
