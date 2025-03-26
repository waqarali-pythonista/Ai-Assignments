import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface SortOption {
  value: string;
  label: string;
}

interface SortProps {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
  options: SortOption[];
  onChange: (value: string, direction: 'asc' | 'desc') => void;
}

export const Sort: React.FC<SortProps> = ({
  label,
  value,
  direction,
  options,
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value, direction);
  };

  const handleDirectionChange = () => {
    onChange(value, direction === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
        onClick={handleDirectionChange}
      >
        {direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
      </Box>
    </Box>
  );
}; 