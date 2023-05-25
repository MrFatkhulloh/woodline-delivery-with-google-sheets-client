import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const showDots = totalPages > 5;
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const rangeStart = Math.max(1, currentPage - 2);
    const rangeEnd = Math.min(currentPage + 2, totalPages);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
  }

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    onPageChange(page);
  };

  return (
    <Box>
      {pages.map((page) => (
        <Button
          key={page}
          colorScheme={page === currentPage ? 'blue' : 'gray'}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      {showDots && (
        <Text display="inline-block" px={2}>
          ...
        </Text>
      )}
    </Box>
  );
};

export default Pagination;