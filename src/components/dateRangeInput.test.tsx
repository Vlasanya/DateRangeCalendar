import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import moment, { Moment } from "moment";
import DateRangeInput from "./dateRangeInput";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {ui}
    </LocalizationProvider>
  );
};

describe("DateRangeInput Component", () => {
  test("renders the uncontrolled component correctly", () => {
    renderWithProviders(<DateRangeInput />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    fireEvent.click(input);
    const calendar = screen.getByText("Start Date");
    expect(calendar).toBeInTheDocument();
  });

  test("renders the controlled component and updates value correctly", async () => {
    const initialDates: [Moment, Moment] = [moment(), moment().add(7, "days")];
    const onChangeMock = jest.fn();
    renderWithProviders(
      <DateRangeInput value={initialDates} onChange={onChangeMock} />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(
      `${initialDates[0].format("MM/DD/YYYY")} - ${initialDates[1].format(
        "MM/DD/YYYY"
      )}`
    );
    fireEvent.click(input);
    const firstDay = screen.getAllByText("15")[0];
    fireEvent.click(firstDay);
    const secondDay = screen.getAllByText("20")[0];
    fireEvent.click(secondDay);
    fireEvent.click(screen.getByText("Apply"));
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  test("opens calendar on input click", () => {
    renderWithProviders(<DateRangeInput />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    expect(screen.getByText("Start Date")).toBeInTheDocument();
  });

  test("renders with disableFuture and does not allow future date selection", () => {
    renderWithProviders(<DateRangeInput disableFuture />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    const allDays = screen.getAllByRole("button", { name: /\d+/ });
    const futureDay = moment().add(1, "month").date(28).format("D");
    const futureDayButton = allDays.find(
      (button) =>
        button.textContent === futureDay && button.hasAttribute("disabled")
    );
    expect(futureDayButton).toBeDisabled();
  });

  test("renders with disablePast and does not allow past date selection", () => {
    renderWithProviders(<DateRangeInput disablePast />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    const allDays = screen.getAllByRole("button", { name: /\d+/ });
    const pastDay = moment().subtract(1, "month").date(1).format("D");
    const pastDayButton = allDays.find(
      (button) => button.textContent === pastDay
    );
    expect(pastDayButton).toBeDisabled();
  });

  test("renders with showPresetSelect and allows preset selection", async () => {
    const shortcutItems = [
      {
        label: "One Week",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today, today.clone().add(7, "days")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput showPresetSelect shortcutsItems={shortcutItems} />
    );
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText(/One Week/i));
    await waitFor(() => {
      expect(screen.getByText(/8 days/i)).toBeInTheDocument();
    });
  });

  test('closes the popover when "Cancel" is clicked', async () => {
    renderWithProviders(<DateRangeInput />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText("Start Date")).not.toBeInTheDocument();
    });
  });
  test("updates the month correctly when handleMonthChange is called", () => {
    renderWithProviders(<DateRangeInput showPresetSelect />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    const monthLabel = screen.getByText(moment().format("MMMM YYYY"));
    expect(monthLabel).toBeInTheDocument();
    const nextButton = screen.getAllByRole("button", { name: ">" })[0];
    fireEvent.click(nextButton);
    const updatedMonthLabel = screen.getAllByText(
      moment().add(1, "month").format("MMMM YYYY")
    );
    expect(updatedMonthLabel.length).toBeGreaterThan(0);
    expect(updatedMonthLabel[0]).toBeInTheDocument();
    const prevButton = screen.getAllByRole("button", { name: "<" })[0];
    fireEvent.click(prevButton);

    const resetMonthLabel = screen.getByText(moment().format("MMMM YYYY"));
    expect(resetMonthLabel).toBeInTheDocument();
  });

  test("does nothing if start or end is null", async () => {
    const shortcutItems = [
      {
        label: "One Week",
        getValue: (): [Moment | null, Moment | null] => {
          return [null, null];
        },
      },
    ];
    const onChangeMock = jest.fn();
    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        onChange={onChangeMock}
      />
    );
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("One Week"));
    await waitFor(() => expect(onChangeMock).not.toHaveBeenCalled());
  });

  test("selects 'Current Month' correctly when 'disableFuture' is enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Month",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today.startOf("month"), today.endOf("month")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        disableFuture
      />
    );

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Current Month"));
    const today = moment();
    const daysInMonth = today.diff(today.clone().startOf("month"), "days") + 1;
    await waitFor(() => {
      const selectedDaysText = screen.getByText(
        new RegExp(`${daysInMonth} days`, "i")
      );
      expect(selectedDaysText).toBeInTheDocument();
    });
  });

  test("selects 'Current Month' correctly when 'disablePast' is enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Month",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today.startOf("month"), today.endOf("month")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        disablePast
      />
    );

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Current Month"));
    const today = moment();
    const daysToEndOfMonth =
      today.clone().endOf("month").diff(today, "days") + 1;
    await waitFor(() => {
      const selectedDaysText = screen.getByText(
        new RegExp(`${daysToEndOfMonth} days`, "i")
      );
      expect(selectedDaysText).toBeInTheDocument();
    });
  });

  test("selects only today when both 'disablePast' and 'disableFuture' are enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Month",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today.startOf("month"), today.endOf("month")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        disablePast
        disableFuture
      />
    );

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Current Month"));

    const today = moment();
    const allSelectedDays = screen.getAllByText(today.format("DD MMMM YYYY"));
    expect(allSelectedDays.length).toBe(2);
  });

  test("calculates reverse duration when 'disableFuture' is enabled for other shortcuts", async () => {
    const shortcutItems = [
      {
        label: "One Week",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today, today.clone().add(7, "days")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        disableFuture
      />
    );

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("One Week"));
    const today = moment();
    const startDate = today.clone().subtract(7, "days");
    const displayedStartDate = screen.getByText(
      startDate.format("DD MMMM YYYY")
    );
    const displayedEndDate = screen.getByText(today.format("DD MMMM YYYY"));

    expect(displayedStartDate).toBeInTheDocument();
    expect(displayedEndDate).toBeInTheDocument();
  });

  test("calculates forward duration when 'disablePast' is enabled for other shortcuts", async () => {
    const shortcutItems = [
      {
        label: "One Week",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today, today.clone().add(7, "days")];
        },
      },
    ];

    renderWithProviders(
      <DateRangeInput
        showPresetSelect
        shortcutsItems={shortcutItems}
        disablePast
      />
    );

    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("One Week"));
    const today = moment();
    const endDate = today.clone().add(7, "days");
    const displayedStartDate = screen.getByText(today.format("DD MMMM YYYY"));
    const displayedEndDate = screen.getByText(endDate.format("DD MMMM YYYY"));
    expect(displayedStartDate).toBeInTheDocument();
    expect(displayedEndDate).toBeInTheDocument();
  });
});
