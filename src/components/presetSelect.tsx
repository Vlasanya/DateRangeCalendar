import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import moment, { Moment } from "moment";

interface ShortcutsItem {
  label: string;
  adjustDays?: number;
  adjustMonths?: number;
}

interface ShortcutsItemsSelectProps {
  onPresetSelect: (preset: [Moment | null, Moment | null]) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  shortcutsItems: ShortcutsItem[];
}

const ShortcutsItemsSelect: React.FC<ShortcutsItemsSelectProps> = React.memo(({
  onPresetSelect,
  disableFuture = false,
  disablePast = false,
  shortcutsItems,
}) => {

  const handleShortcutSelect = useCallback((item: ShortcutsItem) => {
    const today = moment();
    let start: Moment | null = today.clone();
    let end: Moment | null = today.clone();

    if (item.label === "Current Month") {
      start = today.clone().startOf("month");
      end = today.clone().endOf("month");

      if (disablePast && start.isBefore(today, "day")) {
        start = today.clone();
      }

      if (disableFuture && end.isAfter(today, "day")) {
        end = today.clone();
      }

      if (disablePast && disableFuture) {
        start = today.clone();
        end = today.clone();
      }
    } else if (item.adjustDays !== undefined) {
      if (disableFuture) {
        start = today.clone().subtract(item.adjustDays, 'days');
        end = today.clone();
      } else if (disablePast) {
        start = today.clone();
        end = today.clone().add(item.adjustDays, 'days');
      } else {
        end = today.clone().add(item.adjustDays, 'days');
      }
    } else if (item.adjustMonths !== undefined) {
      if (disableFuture) {
        start = today.clone().subtract(item.adjustMonths, 'months');
        end = today.clone();
      } else if (disablePast) {
        start = today.clone();
        end = today.clone().add(item.adjustMonths, 'months');
      } else {
        end = today.clone().add(item.adjustMonths, 'months');
      }
    }

    onPresetSelect([start, end]);
  }, [disableFuture, disablePast, onPresetSelect]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      {shortcutsItems.map((item) => (
        <Button key={item.label} onClick={() => handleShortcutSelect(item)}>
          {item.label}
        </Button>
      ))}
    </Box>
  );
});

export default ShortcutsItemsSelect;
