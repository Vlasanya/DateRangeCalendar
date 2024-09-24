import React from "react";
import moment, { Moment } from "moment";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { useTheme } from "@mui/material";

interface DayCalendarForRangeProps {
  currentMonth: Moment;
  value: [Moment | null, Moment | null];
  onDaySelect: (day: Moment) => void;
  onDayHover: (day: Moment) => void;
  onDayMouseLeave: () => void;
  maxDate: Moment;
  disableFuture?: boolean;
  disablePast?: boolean;
  hoveredDay: Moment | null;
}

const DayCalendarForRange: React.FC<DayCalendarForRangeProps> = ({
  currentMonth,
  value,
  onDaySelect,
  onDayHover,
  onDayMouseLeave,
  maxDate,
  disableFuture = false,
  disablePast = false,
  hoveredDay,
}) => {
  const theme = useTheme();
  const today = moment();
  const startDate = value[0];
  const endDate = value[1];

  return (
    <DateCalendar
      value={currentMonth}
      onChange={(newDate) => onDaySelect(newDate as Moment)}
      showDaysOutsideCurrentMonth={false}
      data-testid="day-calendar"
      sx={{
        "& .MuiDayCalendar-weekDayLabel": {
          color: "primary.main",
        },
        "& .MuiPickersCalendarHeader-root": {
          marginBottom: "3rem",
        },
      }}
      slots={{
        day: (dayProps) => {
          const day = dayProps.day as Moment;
          const isStartDate = value[0] && day.isSame(value[0], "day");
          const isEndDate = value[1] && day.isSame(value[1], "day");
          const isSelected = !!(isStartDate || isEndDate);
          const isToday = day.isSame(today, "day");
          const isBetween =
            startDate &&
            endDate &&
            day.isBetween(startDate, endDate, null, "[]");
          const isHovered =
            hoveredDay && day.isBetween(startDate, hoveredDay, "day", "[]");

          return (
            <PickersDay
              {...dayProps}
              onMouseEnter={() => onDayHover(day)}
              onMouseLeave={onDayMouseLeave}
              selected={isSelected}
              data-testid={
                isSelected
                  ? "selected-day"
                  : isToday
                  ? "today-day"
                  : "day-button"
              }
              className={`custom-pickers-day ${isToday ? "today-day" : ""}`}
              sx={{
                ...(isHovered && {
                  borderTop: `1px dashed ${theme.palette.primary.main}  !important`,
                  borderBottom: `1px dashed ${theme.palette.primary.main}  !important`,
                  borderRadius: "50% !important",
                }),
                ...(isToday && {
                  border: `1px solid ${theme.palette.primary.main}  !important`,
                  borderRadius: "50% !important",
                }),
                ...(isStartDate && {
                  backgroundColor: "primary.main",
                  color: "text.secondary",
                }),
                ...(isEndDate && {
                  backgroundColor: "primary.main",
                  color: "text.secondary",
                }),
                ...(isBetween && {
                  backgroundColor: "background.paper",
                  color: "text.primary",
                }),
              }}
            />
          );
        },
      }}
      slotProps={{
        calendarHeader: {
          sx: {
            "& .MuiPickersCalendarHeader-label": {
              fontSize: "1.2rem",
              textAlign: "center",
            },
          },
        },
      }}
      maxDate={maxDate}
      disableFuture={disableFuture}
      disablePast={disablePast}
    />
  );
};

export default DayCalendarForRange;
