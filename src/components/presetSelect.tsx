import React, { useCallback, useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import moment, { Moment } from "moment";

interface ShortcutsItem {
  label: string;
  getValue: () => [Moment | null, Moment | null];
}

interface ShortcutsItemsSelectProps {
  onPresetSelect: (
    preset: [Moment | null, Moment | null],
    newMonths: [Moment, Moment]
  ) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  shortcutsItems: ShortcutsItem[];
  selectedDates: [Moment | null, Moment | null];
}

const ShortcutsItemsSelect: React.FC<ShortcutsItemsSelectProps> = React.memo(
  ({
    onPresetSelect,
    disableFuture = false,
    disablePast = false,
    shortcutsItems,
    selectedDates,
  }) => {
    const [activeShortcutIndex, setActiveShortcutIndex] = useState<
      number | null
    >(null);
    const areDatesEqual = (
      range1: [Moment | null, Moment | null],
      range2: [Moment | null, Moment | null]
    ) => {
      const [start1, end1] = range1;
      const [start2, end2] = range2;
      return start1?.isSame(start2, "day") && end1?.isSame(end2, "day");
    };

    useEffect(() => {
      let foundShortcut = false;

      for (let index = 0; index < shortcutsItems.length; index++) {
        const item = shortcutsItems[index];
        let [start, end] = item.getValue();
        const today = moment();

        if (!start || !end) {
          continue;
        }
        if (disablePast && start.isBefore(today, "day")) {
          start = today.clone();
        }
        if (disableFuture && end.isAfter(today, "day")) {
          end = today.clone();
        }
        if (areDatesEqual([start, end], selectedDates)) {
          setActiveShortcutIndex(index);
          foundShortcut = true;
          break;
        }
      }

      if (!foundShortcut) {
        setActiveShortcutIndex(null);
      }
    }, [selectedDates, shortcutsItems, disableFuture, disablePast]);

    const handleShortcutSelect = useCallback(
      (item: ShortcutsItem, index: number) => {
        let [start, end] = item.getValue();
        const today = moment();

        if (!start || !end) {
          return;
        }
        if (disableFuture && end.isAfter(today, "day")) {
          end = today.clone();
        }
        if (disablePast && start.isBefore(today, "day")) {
          start = today.clone();
        }
        if (start.isAfter(end)) {
          start = end.clone();
        }

        let newMonths: [Moment, Moment];
        if (disableFuture && end.isSame(today, "day")) {
          newMonths = [
            end.clone().subtract(1, "month").startOf("month"),
            end.clone().startOf("month"),
          ];
        } else {
          if (start.isSame(end, "month")) {
            newMonths = [
              start.clone().startOf("month"),
              start.clone().add(1, "month").startOf("month"),
            ];
          } else {
            newMonths = [
              start.clone().startOf("month"),
              end.clone().startOf("month"),
            ];
          }
        }

        setActiveShortcutIndex(index);
        onPresetSelect([start, end], newMonths);
      },
      [onPresetSelect, disableFuture, disablePast]
    );

    const handleReset = useCallback(() => {
      const today = moment();
      let newMonths: [Moment, Moment];

      if (disableFuture) {
        newMonths = [
          today.clone().subtract(1, "month").startOf("month"),
          today.clone().startOf("month"),
        ];
      } else {
        newMonths = [
          today.clone().startOf("month"),
          today.clone().add(1, "month").startOf("month"),
        ];
      }
      onPresetSelect([null, null], newMonths);
      setActiveShortcutIndex(null);
    }, [onPresetSelect, disableFuture]);

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {shortcutsItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => handleShortcutSelect(item, index)}
            sx={{
              textTransform: 'none',
              ...(index === activeShortcutIndex && {
                backgroundColor: "primary.main",
                color: "text.secondary",
              }),
            }}
          >
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
