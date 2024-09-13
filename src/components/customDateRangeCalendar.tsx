import * as React from "react";
import { Box, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import PickersRangeCalendarHeader from "./pickersRangeCalendarHeader";
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
  const selectedDaysCount = React.useMemo(() => {
    const [start, end] = value;
    if (start && end) {
      return end.diff(start, "days") + 1;
    }
    return 0;
  }, [value]);

  const handleDaySelect = React.useCallback(
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

  const renderCalendars = () => {
    const today = moment().startOf("month");

    return currentMonths.map((month, i) => (
      <Box key={i} mx={1}>
        <PickersRangeCalendarHeader
          month={month}
          onMonthChange={(newMonth) => onMonthChange(i, newMonth)}
          isNextMonthDisabled={
            disableFuture && month.isSameOrAfter(today, "month")
          }
          isPreviousMonthDisabled={
            disablePast && month.isSameOrBefore(today, "month")
          }
          selectedDate={value[i]}
          label={i === 0 ? "Start Date" : "End Date"}
        />
        <DayCalendarForRange
          currentMonth={month}
          value={value}
          onDaySelect={handleDaySelect}
          maxDate={maxDate}
          disableFuture={disableFuture}
          disablePast={disablePast}
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
        sx={{ position: "absolute", top: 30, m: 0, opacity: 0.5 }}
      >
        <ArrowRightAltIcon />
        {selectedDaysCount > 0 && (
          <Typography variant="subtitle1" ml={1}>
            {selectedDaysCount} days
          </Typography>
        )}
      </Box>
      <Box display="flex">{renderCalendars()}</Box>
    </Box>
  );
};

export default CustomDateRangeCalendar;
