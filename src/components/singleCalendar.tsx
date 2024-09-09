import * as React from 'react';
import {
  StaticDatePicker,
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Moment } from 'moment';

interface CustomPickersDayProps extends PickersDayProps<Moment> {
  isBetween: boolean;
  isStart: boolean;
  isEnd: boolean;
}

function CustomPickersDay(props: CustomPickersDayProps) {
  const { isBetween, isStart, isEnd, ...other } = props;

  return (
    <PickersDay
      {...other}
      sx={{
        ...(isBetween && {
          borderRadius: 0,
          backgroundColor: '#9fa8da',
          color: '#000',
        }),
        ...(isStart && {
          backgroundColor: '#3f51b5',
          color: '#fff',
        }),
        ...(isEnd && {
          backgroundColor: '#3f51b5',
          color: '#fff',
        }),
      }}
    />
  );
}

interface SingleCalendarProps {
  value: Moment | null;
  onChange: (newDate: Moment | null) => void;
  minDate: Moment;
  maxDate: Moment;
  initialMonth: Moment;
  startDate: Moment | null;
  endDate: Moment | null;
}

const SingleCalendar: React.FC<SingleCalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  initialMonth,
  startDate,
  endDate,
}) => {
  const [viewDate, setViewDate] = React.useState<Moment | null>(initialMonth);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        openTo="day"
        renderLoading={() => <DayCalendarSkeleton />}
        views={['year', 'day']}
        onMonthChange={(date) => setViewDate(date)}
        view={viewDate ? 'day' : undefined}
        slots={{
          day: (props: PickersDayProps<Moment>) => {
            const { day } = props;

            const isBetween =
              Boolean(startDate && endDate && day.isAfter(startDate, 'day') && day.isBefore(endDate, 'day'));
            const isStart = Boolean(startDate && day.isSame(startDate, 'day'));
            const isEnd = Boolean(endDate && day.isSame(endDate, 'day'));

            return (
              <CustomPickersDay
                {...props}
                isBetween={isBetween}
                isStart={isStart}
                isEnd={isEnd}
              />
            );
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default SingleCalendar;
