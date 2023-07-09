import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";

const DynamicPagination = ({
  totalCount,
  pageSize,
  onPageChange,
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleClick = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handleClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handleClick(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];

    const maxVisiblePages = 4;
    const maxVisibleButtons = Math.min(maxVisiblePages, totalPages);

    const halfMaxVisibleButtons = Math.floor(maxVisibleButtons / 2);
    const startPage = Math.max(currentPage - halfMaxVisibleButtons, 1);
    const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    const showStartDots = startPage > 1;
    const showEndDots = endPage < totalPages;

    if (showStartDots) {
      buttons.push(
        <Button
          colorScheme={currentPage === 1 ? "blue" : "gray"}
          key="first"
          size="sm"
          variant={"solid"}
          onClick={() => handleClick(1)}
        >
          1
        </Button>
      );
    }

    if (showStartDots) {
      buttons.push(
        <Button
          variant={"solid"}
          colorScheme="gray"
          key="start-dots"
          size="sm"
          disabled
        >
          ...
        </Button>
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          colorScheme={currentPage === page ? "blue" : "gray"}
          key={page}
          size="sm"
          variant={"solid"}
          onClick={() => handleClick(page)}
        >
          {page}
        </Button>
      );
    }

    if (showEndDots) {
      buttons.push(
        <Button
          colorScheme="gray"
          key="end-dots"
          size="sm"
          variant={"solid"}
          disabled
        >
          ...
        </Button>
      );
    }

    if (showEndDots) {
      buttons.push(
        <Button
          colorScheme={currentPage === totalPages ? "blue" : "gray"}
          key="last"
          size="sm"
          variant={"solid"}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Flex align="center" justify="center" mt={4}>
      <ButtonGroup>
        <Button
          colorScheme="gray"
          size="sm"
          leftIcon={<ChevronLeftIcon />}
          onClick={handlePrevClick}
          isDisabled={currentPage === 1}
        >
          Prev
        </Button>
        {renderPageButtons()}
        <Button
          colorScheme="gray"
          size="sm"
          rightIcon={<ChevronRightIcon />}
          onClick={handleNextClick}
          isDisabled={currentPage === totalPages ? true : false}
        >
          Next
        </Button>
      </ButtonGroup>
      {children}
    </Flex>
  );
};

export default DynamicPagination;
