import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DateRangeInput from "./components/dateRangeInput";
import { Typography } from "@mui/material";
import moment, { Moment } from "moment";

function App() {
  const [selectedDates, setSelectedDates] = useState<
    [Moment | null, Moment | null]
  >([moment(), moment().add(7, "days")]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div>
        <Typography>Date Range Picker uncontrolled</Typography>
        <DateRangeInput />

        <Typography>Date Range Picker Controlled</Typography>
        <DateRangeInput value={selectedDates} onChange={setSelectedDates} />

        <Typography>Date Range Picker with showPresetSelect</Typography>
        <DateRangeInput showPresetSelect />

        <Typography>
          Date Range Picker with disablePast and showPresetSelect
        </Typography>
        <DateRangeInput showPresetSelect disablePast />

        <Typography>
          Date Range Picker with disableFuture and showPresetSelect
        </Typography>
        <DateRangeInput showPresetSelect disableFuture />
      </div>
    </LocalizationProvider>
  );
}

export default App;
