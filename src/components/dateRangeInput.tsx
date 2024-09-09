import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import moment, { Moment } from "moment";
import CustomDateRangeCalendar from "./dateRangeCalendar";
import PresetSelect from "./presetSelect";

interface DateRangeInputProps {
  showPresetSelect?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  showPresetSelect,
  disableFuture = false,
  disablePast = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDates, setSelectedDates] = React.useState<[Moment | null, Moment | null]>([null, null]);
  const [tempSelectedDates, setTempSelectedDates] = React.useState<[Moment | null, Moment | null]>([null, null]);

  const handleOpen = () => {
    setTempSelectedDates(selectedDates);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    setSelectedDates(tempSelectedDates);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedDates([null, null]);
    setSelectedDates([null, null]);
    setOpen(false);
  };

  const handleDateChange = (newRange: [Moment | null, Moment | null]) => {
    setTempSelectedDates(newRange);
  };

  const handlePresetSelect = (preset: [Moment | null, Moment | null]) => {
    setTempSelectedDates(preset);
  };

  const formattedDateRange =
    selectedDates[0] && selectedDates[1]
      ? `${selectedDates[0].format("DD MMM YYYY")} - ${selectedDates[1].format("DD MMM YYYY")}`
      : "";

  const isApplyDisabled = !(tempSelectedDates[0] && tempSelectedDates[1]);

  return (
    <Box>
      <TextField
        value={formattedDateRange}
        placeholder="Select date range"
        onClick={handleOpen}
        InputProps={{ readOnly: true }}
        sx={{ minWidth: 300 }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <Box display="flex">
            <CustomDateRangeCalendar
              value={tempSelectedDates}
              onChange={handleDateChange}
              calendars={2}
              minDate={moment().subtract(1, "year")}
              maxDate={moment().add(1, "year")}
              disableFuture={disableFuture}
              disablePast={disablePast}
            />

            {showPresetSelect && (
              <PresetSelect 
                onPresetSelect={handlePresetSelect} 
                selectedDate={tempSelectedDates[0] || null}
                disableFuture={disableFuture} 
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleApply}
            color="primary"
            variant="contained"
            disabled={isApplyDisabled}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DateRangeInput;
