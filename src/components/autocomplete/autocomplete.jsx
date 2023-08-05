import React from "react";
import Select from "react-select";
import { useColorMode, useColorModeValue, useTheme } from "@chakra-ui/react";



const MultipleAutocomplete = ({ options, onChange, value, placeholder }) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue(
    theme.colors.gray[200],
    theme.colors.whiteAlpha[300]
  );
  const backgroundColor = useColorModeValue(
    "transparent",
    theme.colors.gray[900]
  );

  const optionBackgroundColor = useColorModeValue(
    "white",
    theme.colors.gray[700]
  );

  const optionColor = useColorModeValue("black", "white");

  const customStyles = {
    container: (provided) => ({
      ...provided,
      backgroundColor,
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor, // Set the background color for the control
      border: state.isFocused
        ? `1px solid ${theme.colors.blue[500]}`
        : `1px solid ${borderColor}`,
      boxShadow: state.isFocused
        ? `0 0 0 1px ${theme.colors.blue[500]}`
        : "none",
      "&:hover": {
        borderColor:
          colorMode === "dark"
            ? theme.colors.whiteAlpha[400]
            : theme.colors.gray[300],
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor, // Set the background color for the menu
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme.colors.blue[100],
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: theme.colors.blue[500],
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: theme.colors.blue[500],
      ":hover": {
        backgroundColor: theme.colors.blue[500],
        color: "white",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.colors.blue[500]
        : optionBackgroundColor,
      color: state.isSelected ? "white" : optionColor,
    }),
  };

  return (
    <Select
      isMulti
      placeholder={placeholder}
      options={options}
      onChange={onChange}
      value={value}
      styles={customStyles}
    />
  );
};

export default MultipleAutocomplete;
