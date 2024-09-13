import React, { useState, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DateRangeInput from "./components/dateRangeInput";
import { Typography, Button } from "@mui/material";
import moment, { Moment } from "moment";

const App: React.FC = React.memo(() => {
  const [selectedDates, setSelectedDates] = useState<
    [Moment | null, Moment | null]
  >([moment(), moment().add(7, "days")]);

  const dateRangeRef = useRef<{
    getSelectedDates: () => [Moment | null, Moment | null];
  } | null>(null);

  const handleGetSelectedDates = () => {
    if (dateRangeRef.current) {
      const dates = dateRangeRef.current.getSelectedDates();
      console.log("Selected Dates from DateRangeInput:", dates);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div>
        <Typography>Date Range Picker uncontrolled</Typography>
        <DateRangeInput dateFormat="DD MMM YYYY" />

        <Typography>Date Range Picker Controlled</Typography>
        <DateRangeInput value={selectedDates} onChange={setSelectedDates} />

        <Typography>Date Range Picker uncontrolled</Typography>
        <DateRangeInput defaultValue={[moment(), moment().add(7, "days")]} />

        <Typography>Date Range Picker with showPresetSelect</Typography>
        <DateRangeInput
          showPresetSelect
          shortcutsItems={[
            "One Week",
            "One Month",
            "Current Month",
            "Today",
            "One Year",
            "One Day",
          ]}
        />

        <Typography>
          Date Range Picker with disablePast and showPresetSelect
        </Typography>
        <DateRangeInput
          showPresetSelect
          disablePast
          shortcutsItems={[
            "One Week",
            "One Month",
            "Current Month",
            "Today",
            "One Year",
            "One Day",
          ]}
        />

        <Typography>
          Date Range Picker with disableFuture and showPresetSelect
        </Typography>
        <DateRangeInput
          showPresetSelect
          shortcutsItems={["One Week", "Current Month", "One Month"]}
          disableFuture
        />
      </div>
      <div>
        <Typography>Date Range Picker Controlled with Ref</Typography>
        <DateRangeInput
          ref={dateRangeRef}
          value={selectedDates}
          onChange={setSelectedDates}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetSelectedDates}
        >
          Get Selected Dates
        </Button>
      </div>
    </LocalizationProvider>
  );
});

export default App;
