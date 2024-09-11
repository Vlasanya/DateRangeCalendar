import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from "react";
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

const DateRangeInput = forwardRef<unknown, DateRangeInputProps>(({
  value,
  onChange,
  defaultValue = [null, null],
  showPresetSelect,
  disableFuture = false,
  disablePast = false,
}, ref) => {
  const defaultRef = useRef(defaultValue);
  const [selectedDates, setSelectedDates] = useState<[Moment | null, Moment | null]>(
    defaultRef.current
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempSelectedDates, setTempSelectedDates] = useState<[Moment | null, Moment | null]>(
    defaultRef.current
  );

  useEffect(() => {
    if (value) {
      setSelectedDates(value);
    }
  }, [value]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempSelectedDates(value || selectedDates);
  }, [value, selectedDates]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleApply = useCallback(() => {
    if (onChange) {
      onChange(tempSelectedDates);
    } else {
      setSelectedDates(tempSelectedDates);
    }
    setAnchorEl(null);
  }, [onChange, tempSelectedDates]);

  const handleCancel = useCallback(() => {
    setTempSelectedDates([null, null]);
    setSelectedDates([null, null]);
    setAnchorEl(null);
  }, []);

  const handleDateChange = useCallback((newRange: [Moment | null, Moment | null]) => {
    setTempSelectedDates(newRange);
  }, []);

  const handlePresetSelect = useCallback((preset: [Moment | null, Moment | null]) => {
    setTempSelectedDates(preset);
  }, []);

  const isApplyDisabled = !(tempSelectedDates[0] && tempSelectedDates[1]);

  useImperativeHandle(ref, () => ({
    getSelectedDates: () => selectedDates,
  }));

  const formattedDateRange = useMemo(() => {
    return selectedDates[0] && selectedDates[1]
      ? `${selectedDates[0]?.format("DD MMM YYYY")} - ${selectedDates[1]?.format("DD MMM YYYY")}`
      : "";
  }, [selectedDates]);

  return (
    <Box>
      <TextField
        value={formattedDateRange}
        onClick={handleOpen}
        slotProps={{
          input: {
            readOnly: true,
            classes: {
              notchedOutline: "notchedOutline",
            },
            endAdornment: <CalendarTodayOutlinedIcon />,
          },
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
});

export default React.memo(DateRangeInput);
