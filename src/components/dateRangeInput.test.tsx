import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
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
    renderWithProviders(
      <DateRangeInput defaultValue={[moment(), moment().add(7, "days")]} />
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    fireEvent.click(input);
    const calendar = screen.getByTestId("selectedDaysCount");
    expect(calendar).toBeInTheDocument();
    expect(calendar).toHaveTextContent("8 days");
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
    const calendar = screen.getByTestId("ArrowRightAltIcon");
    expect(calendar).toBeInTheDocument();
  });

  test("renders with disableFuture and does not allow future date selection", () => {
    renderWithProviders(<DateRangeInput disableFuture />);
    const input = screen.getByTestId("CalendarTodayOutlinedIcon");
    fireEvent.click(input);
    const allDayButtons = screen.getAllByTestId("day-button");
    const disabledDayButtons = allDayButtons.filter((button) =>
      button.classList.contains("Mui-disabled")
    );
    expect(disabledDayButtons.length).toBeGreaterThan(0);
    const today = moment();
    const endOfMonth = today.clone().endOf("month");
    const remainingDaysInMonth = endOfMonth.diff(today, "days");
    expect(disabledDayButtons.length).toBe(remainingDaysInMonth);
    disabledDayButtons.forEach((button) => {
      expect(button).toHaveClass("Mui-disabled");
      expect(button).toBeDisabled();
    });
  });

  test("renders with disablePast and does not allow past date selection", () => {
    renderWithProviders(<DateRangeInput disablePast />);
    const input = screen.getByTestId("CalendarTodayOutlinedIcon");
    fireEvent.click(input);
    const allDayButtons = screen.getAllByTestId("day-button");
    const disabledDayButtons = allDayButtons.filter((button) =>
      button.classList.contains("Mui-disabled")
    );
    expect(disabledDayButtons.length).toBeGreaterThan(0);
    const today = moment();
    const startOfMonth = today.clone().startOf("month");
    const passedDaysInMonth = today.diff(startOfMonth, "days");
    expect(disabledDayButtons.length).toBe(passedDaysInMonth);
    disabledDayButtons.forEach((button) => {
      expect(button).toHaveClass("Mui-disabled");
      expect(button).toBeDisabled();
    });
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
    const currentMonthYear = moment().format("MMMM YYYY");
    const monthLabel = screen.getByText(currentMonthYear);

    expect(monthLabel).toBeInTheDocument();
    expect(monthLabel).toHaveClass("MuiPickersCalendarHeader-label");
    const arrowLeft = screen.getAllByTestId("ArrowLeftIcon")[0];
    expect(arrowLeft).toBeInTheDocument();
    fireEvent.click(arrowLeft);
    const previousMonthYear = moment().subtract(1, "month").format("MMMM YYYY");

    const previousMonthLabel = screen.getByText(previousMonthYear);
    expect(previousMonthLabel).toBeInTheDocument();
    expect(previousMonthLabel).toHaveClass("MuiPickersCalendarHeader-label");
  });

  test("does nothing if start or end is null", async () => {
    const shortcutItems = [
      {
        label: "One Week",
        id: "oneWeek",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          return [today, today.clone().add(7, "days")];
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
  //must check if this is working
  test("selects 'Current Month' correctly when 'disableFuture' is enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Month",
        id: "currentMonth",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          const startOfMonth = today.clone().startOf("month");
          const endOfMonth = today.clone().endOf("month");
          return [startOfMonth, endOfMonth];
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
    const firstDay = today.startOf("month").date().toString();
    const todayDate = today.date().toString();

    const selectedDayOfMonthButtons = screen.getAllByTestId("selected-day");

    expect(selectedDayOfMonthButtons.length).toBe(2);

    expect(selectedDayOfMonthButtons[0]).toHaveTextContent(`${firstDay}`);
    expect(selectedDayOfMonthButtons[0]).toHaveClass("Mui-selected");

    expect(selectedDayOfMonthButtons[1]).toHaveTextContent(`${todayDate}`);
    expect(selectedDayOfMonthButtons[1]).toHaveClass("Mui-selected");
  });

  test("selects 'Current Week' correctly when 'disablePast' is enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Week",
        id: "currentWeek",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          const startOfWeek = today.clone().startOf('week');
          const endOfWeek = today.clone().endOf('week');
          return [startOfWeek, endOfWeek];
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
    fireEvent.click(screen.getByText("Current Week"));
    const today = moment();
    const lastDayOfWeek = today.clone().endOf("week").date().toString();
    const todayDate = today.date().toString();
  
    const selectedDayOfWeekButtons = screen.getAllByTestId("selected-day");
  
    expect(selectedDayOfWeekButtons.length).toBe(2);
  
    expect(selectedDayOfWeekButtons[0]).toHaveTextContent(`${todayDate}`);
    expect(selectedDayOfWeekButtons[0]).toHaveClass("Mui-selected");
  
    expect(selectedDayOfWeekButtons[1]).toHaveTextContent(`${lastDayOfWeek}`);
    expect(selectedDayOfWeekButtons[1]).toHaveClass("Mui-selected");
  
  });

  test("selects only today when both 'disablePast' and 'disableFuture' are enabled", async () => {
    const shortcutItems = [
      {
        label: "Current Week",
        id: "currentWeek",
        getValue: (): [Moment | null, Moment | null] => {
          const today = moment();
          const startOfWeek = today.clone().startOf('week');
          const endOfWeek = today.clone().endOf('week');
          return [startOfWeek, endOfWeek];
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
    fireEvent.click(screen.getByText("Current Week"));
    const today = moment();
    const todayDate = today.date().toString();
    const selectedDayOfWeekButtons = screen.getAllByTestId("selected-day");
    expect(selectedDayOfWeekButtons.length).toBe(1);
    expect(selectedDayOfWeekButtons[0]).toHaveTextContent(`${todayDate}`);
    expect(selectedDayOfWeekButtons[0]).toHaveClass("Mui-selected");
  });
});
