import * as React from 'react';
import { Box, Typography } from '@mui/material';
import moment, { Moment } from 'moment';
import PickersRangeCalendarHeader from './pickersRangeCalendarHeader';
import DayCalendarForRange from './DayCalendarForRange';

interface CustomDateRangeCalendarProps {
  value: [Moment | null, Moment | null];
  onChange: (newRange: [Moment | null, Moment | null]) => void;
  calendars: number;
  minDate: Moment;
  maxDate: Moment;
  disableFuture?: boolean;
  disablePast?: boolean;
}

const CustomDateRangeCalendar: React.FC<CustomDateRangeCalendarProps> = ({
  value,
  onChange,
  calendars,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
}) => {
  const [currentMonths, setCurrentMonths] = React.useState<Moment[]>(
    Array.from({ length: calendars }, (_, index) => 
      index === 0 ? moment().startOf('month').subtract(1, 'month') : moment().startOf('month')
    )
  );

  const selectedDaysCount = React.useMemo(() => {
    const [start, end] = value;
    if (start && end) {
      return end.diff(start, 'days') + 1;
    }
    return 0;
  }, [value]);

  const handleDaySelect = React.useCallback((selectedDay: Moment) => {
    const [start, end] = value;
    if (!start || (start && end)) {
      onChange([selectedDay, null]);
    } else if (selectedDay.isBefore(start)) {
      onChange([selectedDay, end]);
    } else {
      onChange([start, selectedDay]);
    }
  }, [value, onChange]);

  const handleMonthChange = React.useCallback((index: number, newMonth: Moment) => {
    setCurrentMonths((prevMonths) => {
      const updatedMonths = [...prevMonths];
      updatedMonths[index] = newMonth;
      return updatedMonths;
    });
  }, []);

  const renderCalendars = () => {
    const today = moment().startOf('month');
    return currentMonths.map((month, i) => (
      <Box key={i} mx={1}>
        <PickersRangeCalendarHeader
          month={month}
          onMonthChange={(newMonth) => handleMonthChange(i, newMonth)}
          isNextMonthDisabled={disableFuture && month.isSameOrAfter(today, 'month')}
          isPreviousMonthDisabled={disablePast && month.isSameOrBefore(today, 'month')}
          selectedDate={value[i]}
          label={i === 0 ? 'Start Date' : 'End Date'}
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
      <Box mb={2} p={1} border={1} borderRadius={1}>
        <Typography variant="subtitle1">
          Selected Days: {selectedDaysCount}
        </Typography>
      </Box>
      <Box display="flex">{renderCalendars()}</Box>
    </Box>
  );
};

export default CustomDateRangeCalendar;
