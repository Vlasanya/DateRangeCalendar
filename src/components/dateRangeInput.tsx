import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Popover,
  DialogActions,
  DialogContent,
  useTheme,
} from "@mui/material";
import moment, { Moment } from "moment";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CustomDateRangeCalendar from "./customDateRangeCalendar";
import ShortcutsItemsSelect from "./presetSelect";

interface ShortcutsItem {
  label: string;
  getValue: () => [Moment | null, Moment | null];
}

interface DateRangeInputProps {
  value?: [Moment | null, Moment | null];
  onChange?: (newRange: [Moment | null, Moment | null]) => void;
  defaultValue?: [Moment | null, Moment | null];
  showPresetSelect?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  shortcutsItems?: ShortcutsItem[];
  dateFormat?: string;
}

const DateRangeInput = forwardRef<unknown, DateRangeInputProps>(({
  value,
  onChange,
  defaultValue = [null, null],
  showPresetSelect,
  disableFuture = false,
  disablePast = false,
  shortcutsItems = [],
  dateFormat = "MM/DD/YYYY",
}, ref) => {
  const theme = useTheme();
  const defaultRef = useRef(defaultValue);
  const [selectedDates, setSelectedDates] = useState<[Moment | null, Moment | null]>(
    defaultRef.current
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempSelectedDates, setTempSelectedDates] = useState<[Moment | null, Moment | null]>(
    defaultRef.current
  );

  const initialCalendarMonths = useMemo<[Moment, Moment]>(() => {
    const today = moment();
    if (disableFuture) {
      return [today.clone().subtract(1, 'month'), today];
    }
    return [today, today.clone().add(1, 'month')];
  }, [disableFuture]);

  const [currentMonths, setCurrentMonths] = useState<[Moment, Moment]>(initialCalendarMonths);

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

  const handleShortcutSelect = useCallback((preset: [Moment | null, Moment | null]) => {
    setTempSelectedDates(preset);
  }, []);

  const handleMonthChange = useCallback((index: number, newMonth: Moment) => {
    setCurrentMonths((prevMonths) => {
      const updatedMonths: [Moment, Moment] = [...prevMonths] as [Moment, Moment];
      updatedMonths[index] = newMonth;
      return updatedMonths;
    });
  }, []);

  const isApplyDisabled = !(tempSelectedDates[0] && tempSelectedDates[1]);

  useImperativeHandle(ref, () => ({
    getSelectedDates: () => selectedDates,
  }));

  const formattedDateRange = useMemo(() => {
    return selectedDates[0] && selectedDates[1]
      ? `${selectedDates[0]?.format(dateFormat)} - ${selectedDates[1]?.format(dateFormat)}`
      : "";
  }, [selectedDates, dateFormat]);

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
          borderBottom: `1px solid ${theme.palette.divider}`,
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
              currentMonths={currentMonths}
              onMonthChange={handleMonthChange}
            />

            {showPresetSelect && (
              <ShortcutsItemsSelect
                onPresetSelect={handleShortcutSelect}
                shortcutsItems={shortcutsItems}
                disableFuture={disableFuture}
                disablePast={disablePast}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
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
