import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
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
      `${initialDates[0].format("DD MMM YYYY")} - ${initialDates[1].format(
        "DD MMM YYYY"
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
      (button) => button.textContent === futureDay && button.hasAttribute("disabled")
    );
    expect(futureDayButton).toBeDisabled();
  });
  
  
  test("renders with disablePast and does not allow past date selection", () => {
    renderWithProviders(<DateRangeInput disablePast />);
    const input = screen.getByRole("textbox");
    fireEvent.click(input);
    const allDays = screen.getAllByRole("button", { name: /\d+/ });
    const pastDay = moment().subtract(1, "month").date(1).format("D");
    const pastDayButton = allDays.find(button => button.textContent === pastDay);
    expect(pastDayButton).toBeDisabled();
  });  

  test("renders with showPresetSelect and allows preset selection", () => {
    renderWithProviders(<DateRangeInput showPresetSelect />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("One Week"));
    const week = screen.getByText('Selected Days: 8');
    expect(week).toBeInTheDocument();
  });

  test('closes the popover when "Cancel" is clicked', async () => {
    renderWithProviders(<DateRangeInput />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText("Start Date")).not.toBeInTheDocument();
    });
  });
});
