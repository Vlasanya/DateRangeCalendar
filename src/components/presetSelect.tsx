import React, { useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import moment, { Moment } from "moment";

interface PresetSelectProps {
  onPresetSelect: (preset: [Moment | null, Moment | null]) => void;
  selectedDate: Moment | null;
  disableFuture?: boolean;
}

const PresetSelect: React.FC<PresetSelectProps> = React.memo(({
  onPresetSelect,
  selectedDate,
  disableFuture = false,
}) => {
  const handlePresetSelect = useCallback((preset: string) => {
    const baseDate = selectedDate ? selectedDate.clone() : moment();
    let start: Moment | null = null;
    let end: Moment | null = baseDate.clone();

    if (disableFuture) {
      switch (preset) {
        case "Today":
          start = baseDate.clone();
          end = baseDate.clone();
          break;
        case "One Day":
          start = baseDate.clone();
          end = baseDate.clone();
          break;
        case "One Week":
          start = baseDate.clone().subtract(1, "week");
          end = baseDate.clone();
          break;
        case "One Month":
          start = baseDate.clone().subtract(1, "month");
          end = baseDate.clone();
          break;
        case "One Year":
          start = baseDate.clone().subtract(1, "year");
          end = baseDate.clone();
          break;
        default:
          break;
      }
    } else {
      switch (preset) {
        case "Today":
          start = baseDate.clone();
          end = baseDate.clone();
          break;
        case "One Day":
          start = baseDate.clone();
          end = baseDate.clone();
          break;
        case "One Week":
          start = baseDate.clone();
          end = baseDate.clone().add(1, "week");
          break;
        case "One Month":
          start = baseDate.clone();
          end = baseDate.clone().add(1, "month");
          break;
        case "One Year":
          start = baseDate.clone();
          end = baseDate.clone().add(1, "year");
          break;
        default:
          break;
      }
    }

    onPresetSelect([start, end]);
  }, [selectedDate, disableFuture, onPresetSelect]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="subtitle1" gutterBottom>
        Select Preset
      </Typography>
      <Button onClick={() => handlePresetSelect("Today")}>Today</Button>
      <Button onClick={() => handlePresetSelect("One Day")}>One Day</Button>
      <Button onClick={() => handlePresetSelect("One Week")}>One Week</Button>
      <Button onClick={() => handlePresetSelect("One Month")}>One Month</Button>
      <Button onClick={() => handlePresetSelect("One Year")}>One Year</Button>
    </Box>
  );
});

export default PresetSelect;
