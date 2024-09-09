import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DateRangeInput from './components/dateRangeInput';
import { Typography } from '@mui/material';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div>
        <Typography>Date Range Picker</Typography>
        <DateRangeInput />
        <Typography>Date Range Picker with showPresetSelect</Typography>
        <DateRangeInput showPresetSelect />
        <Typography>Date Range Picker with disablePast and showPresetSelect</Typography>
        <DateRangeInput showPresetSelect disablePast/>
        <Typography>Date Range Picker with disableFuture and showPresetSelect</Typography>
        <DateRangeInput showPresetSelect disableFuture />
      </div>
    </LocalizationProvider>
  );
}

export default App;
