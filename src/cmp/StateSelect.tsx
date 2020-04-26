import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

import { data } from '../confirmed_by_state.json';

interface StateSelectProps {
  value: unknown;
  onChange: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => void;
}

export const StateSelect = ({ value, onChange }: StateSelectProps) => {
  return (
    <Select
      id="stateSelect"
      label="States"
      displayEmpty
      renderValue={(value: unknown): React.ReactNode => {
        const states: string[] = value as string[];
        if (states.length === 0) {
          return 'Select a state';
        } else {
          return states.join(', ');
        }
      }}
      multiple
      onChange={onChange}
      value={value}
    >
      {data.map((row) => (
        <MenuItem key={`mi-${row.provinceState}`} value={row.provinceState}>
          {row.provinceState}
        </MenuItem>
      ))}
    </Select>
  );
};
