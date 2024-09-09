import * as React from 'react';
import { Box } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

interface DayCalendarForRangeProps {
  currentMonth: Moment;
  value: [Moment | null, Moment | null];
  onDaySelect: (day: Moment) => void;
  maxDate: Moment;
  disableFuture?: boolean;
  disablePast?: boolean;
}

const DayCalendarForRange: React.FC<DayCalendarForRangeProps> = ({
  currentMonth,
  value,
  onDaySelect,
  maxDate,
  disableFuture = false,
  disablePast = false,
}) => {
  const startDate = value[0];
  const endDate = value[1];
  const today = moment();

  const firstDayOfMonth = currentMonth.clone().startOf('month');
  const firstDayWeekday = (firstDayOfMonth.day() + 6) % 7; 

  const daysInMonth = currentMonth.daysInMonth();

  const daysArray: Moment[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    daysArray.push(firstDayOfMonth.clone().subtract(firstDayWeekday - i, 'day'));
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(currentMonth.clone().date(i));
  }

  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)">
      {daysArray.map((day) => (
        <PickersDay
          key={day.toString()}
          day={day}
          outsideCurrentMonth={day.month() !== currentMonth.month()}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
          disabled={
            (disableFuture && day.isAfter(today, 'day')) ||
            (disablePast && day.isBefore(today, 'day')) ||
            day.isAfter(maxDate, 'day')
          }
          selected={
            (!!(startDate && day.isSame(startDate, 'day')) || !!(endDate && day.isSame(endDate, 'day'))) || false
          }
          onDaySelect={() => 
            !day.isAfter(maxDate, 'day') &&
            !(disableFuture && day.isAfter(today, 'day')) &&
            !(disablePast && day.isBefore(today, 'day')) &&
            onDaySelect(day)
          }
          sx={{
            ...(startDate &&
              endDate &&
              day.isBetween(startDate, endDate, 'day') && { backgroundColor: '#9fa8da', color: '#000' }),
            ...(startDate && day.isSame(startDate, 'day') && { backgroundColor: '#3f51b5', color: '#fff' }),
            ...(endDate && day.isSame(endDate, 'day') && { backgroundColor: '#3f51b5', color: '#fff' }),
            ...(day.isSame(today, 'day') && { border: '1px solid #3f51b5' }),
          }}
        />
      ))}
    </Box>
  );
};

export default DayCalendarForRange;
