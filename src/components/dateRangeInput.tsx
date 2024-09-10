import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Popover,
  DialogActions,
  DialogContent,
} from "@mui/material";
import moment, { Moment } from "moment";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CustomDateRangeCalendar from "./customDateRangeCalendar";
import PresetSelect from "./presetSelect";

interface DateRangeInputProps {
  value?: [Moment | null, Moment | null];
  onChange?: (newRange: [Moment | null, Moment | null]) => void;
  defaultValue?: [Moment | null, Moment | null];
  showPresetSelect?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  value,
  onChange,
  defaultValue = [null, null],
  showPresetSelect,
  disableFuture = false,
  disablePast = false,
}) => {
  const isControlled = value !== undefined;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDates, setSelectedDates] = React.useState<[Moment | null, Moment | null]>(
    isControlled ? [null, null] : defaultValue
  );

  const [tempSelectedDates, setTempSelectedDates] = React.useState<[Moment | null, Moment | null]>(
    isControlled ? value || [null, null] : selectedDates
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempSelectedDates(isControlled ? value || [null, null] : selectedDates);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (isControlled && onChange) {
      onChange(tempSelectedDates);
    } else {
      setSelectedDates(tempSelectedDates);
    }
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setTempSelectedDates([null, null]);
    if (!isControlled) setSelectedDates([null, null]);
    setAnchorEl(null);
  };

  const handleDateChange = (newRange: [Moment | null, Moment | null]) => {
    setTempSelectedDates(newRange);
  };

  const handlePresetSelect = (preset: [Moment | null, Moment | null]) => {
    setTempSelectedDates(preset);
  };

  const formattedDateRange =
    (isControlled ? value : selectedDates)[0] && (isControlled ? value : selectedDates)[1]
      ? `${(isControlled ? value : selectedDates)[0]?.format("DD MMM YYYY")} - ${(isControlled ? value : selectedDates)[1]?.format("DD MMM YYYY")}`
      : "";

  const isApplyDisabled = !(tempSelectedDates[0] && tempSelectedDates[1]);

  return (
    <Box>
      <TextField
        value={formattedDateRange}
        onClick={handleOpen}
        InputProps={{
          readOnly: true,
          classes: {
            notchedOutline: "notchedOutline",
          },
          endAdornment: <CalendarTodayOutlinedIcon />,
        }}
        sx={{
          minWidth: 300,
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          borderBottom: "1px solid",
          borderRadius: 0,
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
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
      </Popover>
    </Box>
  );
};

export default DateRangeInput;
