import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import moment, { Moment } from "moment";

interface ShortcutsItem {
  label: string;
  getValue: () => [Moment | null, Moment | null];
}

interface ShortcutsItemsSelectProps {
  onPresetSelect: (preset: [Moment | null, Moment | null]) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  shortcutsItems: ShortcutsItem[];
}

const ShortcutsItemsSelect: React.FC<ShortcutsItemsSelectProps> = React.memo(
  ({ onPresetSelect, disableFuture = false, disablePast = false, shortcutsItems }) => {
    const handleShortcutSelect = useCallback(
      (item: ShortcutsItem) => {
        let [start, end] = item.getValue();
        const today = moment();

        if (!start || !end) {
          return;
        }

        if (item.label === "Current Month") {
          start = today.clone().startOf("month");
          end = today.clone().endOf("month");

          if (disableFuture && !disablePast) {
            end = today.clone();
          } else if (disablePast && !disableFuture) {
            start = today.clone();
          } else if (disablePast && disableFuture) {
            start = today.clone();
            end = today.clone();
          }
        } else {
          const [defaultStart, defaultEnd] = item.getValue();

          if (defaultStart && defaultEnd) {
            if (disableFuture) {
              end = today.clone();
              const duration = moment.duration(defaultEnd.diff(defaultStart));
              start = end.clone().subtract(duration);
            } else if (disablePast) {
              start = today.clone();
              const duration = moment.duration(defaultEnd.diff(defaultStart));
              end = start.clone().add(duration);
            } else {
              [start, end] = [defaultStart, defaultEnd];
            }
          }
        }

        onPresetSelect([start, end]);
      },
      [onPresetSelect, disableFuture, disablePast]
    );

    const handleReset = useCallback(() => {
      const today = moment();
      onPresetSelect([today, today]);
    }, [onPresetSelect]);

    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {shortcutsItems.map((item) => (
          <Button key={item.label} onClick={() => handleShortcutSelect(item)}>
            {item.label}
          </Button>
        ))}
        <Button key="Reset" onClick={handleReset} color="secondary">
          Reset
        </Button>
      </Box>
    );
  }
);

export default ShortcutsItemsSelect;
