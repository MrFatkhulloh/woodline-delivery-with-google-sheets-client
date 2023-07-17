import React, { useState } from "react";
import {
  Box,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  List,
  ListItem,
  ListIcon,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const programmingLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Ruby",
  "Go",
  "TypeScript",
  "Swift",
  "Kotlin",
  "Rust",
  "PHP",
  "C#",
];

const Autocomplete = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    onOpen();
  };

  const handleTagClose = (language) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
  };

  const handleLanguageClick = (language) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
    setSearchValue("");
    onClose();
  };

  const filteredLanguages = programmingLanguages.filter((language) =>
    language.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box>
      <Input
        placeholder="Search programming languages"
        value={searchValue}
        onChange={handleInputChange}
      />
      {selectedLanguages.map((language) => (
        <Tag
          key={language}
          colorScheme="blue"
          size="md"
          borderRadius="full"
          variant="solid"
          mt={2}
          mr={2}
        >
          <TagLabel>{language}</TagLabel>
          <TagCloseButton onClick={() => handleTagClose(language)} />
        </Tag>
      ))}
      {isOpen && (
        <List
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          p={2}
          position="absolute"
          mt={2}
          zIndex="dropdown"
          bg="white"
          width="100%"
        >
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <ListItem
                key={language}
                onClick={() => handleLanguageClick(language)}
                cursor="pointer"
                _hover={{ backgroundColor: "gray.100" }}
              >
                <ListIcon as={FaCheckCircle} color="green.500" />
                {language}
              </ListItem>
            ))
          ) : (
            <ListItem>No matches found.</ListItem>
          )}
        </List>
      )}
    </Box>
  );
};

export default Autocomplete;
