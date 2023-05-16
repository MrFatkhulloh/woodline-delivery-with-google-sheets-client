import { Flex, Heading, Text } from "@chakra-ui/react";

const NotFoundPage = () => {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading as="h1" fontSize="6xl" mb={4}>
        404 Page Not Found
      </Heading>
      <Text fontSize="xl" textAlign="center">
        Sorry, we couldn't find the page you were looking for.
      </Text>
    </Flex>
  );
};

export default NotFoundPage;
