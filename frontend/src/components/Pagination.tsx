import React from 'react';
import {
  Box,
  Pagination,
  PaginationItem,
  Stack,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';

interface PaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
  pageSize?: number;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  count,
  onChange,
  pageSize = 10,
}) => {
  const totalPages = Math.ceil(count / pageSize);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onChange(value)}
          color="primary"
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              components={{
                first: FirstPageIcon,
                last: LastPageIcon,
                next: NavigateNextIcon,
                previous: NavigateBeforeIcon,
              }}
              {...item}
            />
          )}
        />
      </Stack>
    </Box>
  );
}; 