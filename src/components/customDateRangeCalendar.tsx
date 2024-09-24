import React, { useState, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Moment } from "moment";
import DayCalendarForRange from "./DayCalendarForRange";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface CustomDateRangeCalendarProps {
  value: [Moment | null, Moment | null];
  onChange: (newRange: [Moment | null, Moment | null]) => void;
  calendars: number;
  minDate: Moment;
  maxDate: Moment;
  disableFuture?: boolean;
  disablePast?: boolean;
  currentMonths: [Moment, Moment];
  onMonthChange: (index: number, newMonth: Moment) => void;
}

const CustomDateRangeCalendar: React.FC<CustomDateRangeCalendarProps> = ({
  value,
  onChange,
  calendars,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
  currentMonths,
  onMonthChange,
}) => {
  const [hoveredDay, setHoveredDay] = useState<Moment | null>(null);

  const selectedDaysCount = useMemo(() => {
    const [start, end] = value;
    if (start && end) {
      return end.diff(start, "days") + 1;
    }
    return 0;
  }, [value]);

  const handleDaySelect = useCallback(
    (selectedDay: Moment) => {
      const [start, end] = value;
      if (!start || (start && end)) {
        onChange([selectedDay, null]);
      } else if (selectedDay.isBefore(start)) {
        onChange([selectedDay, end]);
      } else {
        onChange([start, selectedDay]);
      }
    },
    [value, onChange]
  );

  const handleDayHover = useCallback((day: Moment) => {
    setHoveredDay(day);
  }, []);

  const handleDayMouseLeave = useCallback(() => {
    setHoveredDay(null);
  }, []);

  const renderCalendars = () => {
    return currentMonths.map((month, i) => (
      <Box key={i} mx={1}>
        <DayCalendarForRange
          currentMonth={month}
          value={value}
          onDaySelect={handleDaySelect}
          onDayHover={handleDayHover}
          onDayMouseLeave={handleDayMouseLeave}
          maxDate={maxDate}
          disableFuture={disableFuture}
          disablePast={disablePast}
          hoveredDay={hoveredDay}
        />
      </Box>
    ));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        mb={2}
        p={1}
        border={"none"}
        textAlign="center"
        sx={{ position: "absolute", top: 50, m: 0, opacity: 0.5, lineHeight: 0 }}
      >
        <ArrowRightAltIcon />
        {selectedDaysCount > 0 && (
          <Typography variant="subtitle1" ml={1} data-testid="selectedDaysCount">
            {selectedDaysCount} {selectedDaysCount === 1 ? "day" : "days"}
          </Typography>
        )}
      </Box>
      <Box display="flex">{renderCalendars()}</Box>
    </Box>
  );
};

export default CustomDateRangeCalendar;
