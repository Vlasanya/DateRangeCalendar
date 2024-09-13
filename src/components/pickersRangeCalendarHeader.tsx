import * as React from "react";
import { Button, Box, Typography } from "@mui/material";
import { Moment } from "moment";

interface PickersRangeCalendarHeaderProps {
  month: Moment;
  onMonthChange: (newMonth: Moment) => void;
  isNextMonthDisabled: boolean;
  isPreviousMonthDisabled: boolean;
  selectedDate: Moment | null;
  label: string;
}

const PickersRangeCalendarHeader: React.FC<PickersRangeCalendarHeaderProps> = ({
  month,
  onMonthChange,
  isNextMonthDisabled,
  isPreviousMonthDisabled,
  selectedDate,
  label,
}) => {
  const handlePreviousMonth = () => {
    if (!isPreviousMonthDisabled) {
      onMonthChange(month.clone().subtract(1, "month"));
    }
  };

  const handleNextMonth = () => {
    if (!isNextMonthDisabled) {
      onMonthChange(month.clone().add(1, "month"));
    }
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          position: "relative",
          pb: '60px',
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "calc(100% + 16px)",
            borderBottom: "1px solid",
            opacity: 0.5,
          },
        }}
      >
        {selectedDate ? selectedDate.format("DD MMMM YYYY") : label}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={handlePreviousMonth}
          disabled={isPreviousMonthDisabled}
        >
          {"<"}
        </Button>
        <Typography variant="h6">{month.format("MMMM YYYY")}</Typography>
        <Button onClick={handleNextMonth} disabled={isNextMonthDisabled}>
          {">"}
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mt={1}>
        {daysOfWeek.map((day) => (
          <Typography key={day} variant="body2" align="center">
            {day}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PickersRangeCalendarHeader;
