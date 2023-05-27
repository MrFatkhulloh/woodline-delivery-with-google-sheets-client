import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

const DynamicPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const MAX_VISIBLE_PAGES = 5; // Maximum number of visible page buttons
  const MAX_DOTS_THRESHOLD = MAX_VISIBLE_PAGES - 1; // Number of buttons required to display dots

  const [pageButtons, setPageButtons] = []

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
  };

  const renderPageButtons = () => {
    let pageButtons = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let page = 1; page <= totalPages; page++) {
        pageButtons.push(
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            variant={page === currentPage ? "solid" : "ghost"}
            colorScheme={page === currentPage ? "blue" : "gray"}
            size="sm"
            mx={1}
          >
            {page}
          </Button>
        );
      }
    } else {
      const pageDots = (
        <Button key="dots" disabled variant="ghost" size="sm" mx={1}>
          ...
        </Button>
      );

      const firstButton = (
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          variant={1 === currentPage ? "solid" : "ghost"}
          colorScheme={1 === currentPage ? "blue" : "gray"}
          size="sm"
          mx={1}
        >
          1
        </Button>
      );

      const lastButton = (
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant={totalPages === currentPage ? "solid" : "ghost"}
          colorScheme={totalPages === currentPage ? "blue" : "gray"}
          size="sm"
          mx={1}
        >
          {totalPages}
        </Button>
      );

      if (currentPage <= MAX_DOTS_THRESHOLD) {
        // Display buttons from 1 to MAX_VISIBLE_PAGES
        for (let page = 1; page <= MAX_VISIBLE_PAGES; page++) {
          const button = (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={page === currentPage ? "solid" : "ghost"}
              colorScheme={page === currentPage ? "blue" : "gray"}
              size="sm"
              mx={1}
            >
              {page}
            </Button>
          );
          pageButtons.push(button);
        }
        pageButtons.push(pageDots, lastButton);
      } else if (currentPage > totalPages - MAX_DOTS_THRESHOLD) {
        // Display buttons from totalPages - MAX_VISIBLE_PAGES + 1 to totalPages
        for (
          let page = totalPages - MAX_VISIBLE_PAGES + 1;
          page <= totalPages;
          page++
        ) {
          const button = (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={page === currentPage ? "solid" : "ghost"}
              colorScheme={page === currentPage ? "blue" : "gray"}
              size="sm"
              mx={1}
            >
              {page}
            </Button>
          );
          pageButtons.push(button);
        }
      } else {
        // Display buttons around the current page with dots
        pageButtons.push(firstButton, pageDots);
        const pagesBeforeCurrent = Math.floor(MAX_VISIBLE_PAGES / 2) - 1;
        const pagesAfterCurrent = MAX_VISIBLE_PAGES - pagesBeforeCurrent - 3;
        const startPage = currentPage - pagesBeforeCurrent;
        const endPage = currentPage + pagesAfterCurrent;

        for (let page = startPage; page <= endPage; page++) {
          const button = (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={page === currentPage ? "solid" : "ghost"}
              colorScheme={page === currentPage ? "blue" : "gray"}
              size="sm"
              mx={1}
            >
              {page}
            </Button>
          );
          pageButtons.push(button);
        }
        pageButtons.push(pageDots, lastButton);
      }
    }

    return pageButtons;
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
      <Button
        onClick={() => {
          console.log(renderPageButtons());
          handlePageChange(currentPage - 1);
        }}
        isDisabled={currentPage === 1 ? true : false}
        mr={2}
      >
        Previous
      </Button>

      {renderPageButtons()}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages ? true : false}
        ml={2}
      >
        Next
      </Button>

      <Text ml={4}>
        Page {currentPage} of {totalPages}
      </Text>
    </Box>
  );
};

export default DynamicPagination;
