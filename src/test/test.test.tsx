import React from "react";
import DatePicker from "../index";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { safeQuerySelector } from "./test_utils";
import { newDate } from "../date_utils";

describe("Refocus Input", () => {
  it("should refocus the date input when a date is selected", async () => {
    const selectedDate = newDate("2025-11-01");
    const onChangeSpy = jest.fn();
    const { container } = render(
      <DatePicker
        selected={selectedDate}
        dateFormat="yyyy-MM-dd"
        onChange={onChangeSpy}
      />,
    );

    const input = safeQuerySelector<HTMLInputElement>(container, "input");
    fireEvent.focus(input);

    expect(container.querySelector(".react-datepicker")).toBeTruthy();

    const newSelectedDateEl = safeQuerySelector(
      container,
      ".react-datepicker__day--002",
    );
    fireEvent.click(newSelectedDateEl);

    await waitFor(() => {
      expect(document.activeElement).not.toBe(newSelectedDateEl);
      expect(document.activeElement).toBe(input);
    });
  });

  describe("Date Range", () => {
    it("should not refocus the input when the endDate is not selected in the Date Range", async () => {
      const selectedDate = newDate("2025-11-01");
      let startDate, endDate;
      const onChangeSpy = jest.fn((dates) => {
        [startDate, endDate] = dates;
      });

      const { container } = render(
        <DatePicker
          selectsRange
          selected={selectedDate}
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          onChange={onChangeSpy}
        />,
      );
      const input = safeQuerySelector<HTMLInputElement>(container, "input");
      fireEvent.focus(input);

      expect(container.querySelector(".react-datepicker")).toBeTruthy();
      const newStartDateEl = safeQuerySelector(
        container,
        ".react-datepicker__day--002",
      );
      fireEvent.click(newStartDateEl);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(document.activeElement).not.toBe(input);
        expect(document.activeElement).toBe(newStartDateEl);
      });
    });

    it("should refocus the input when the endDate is selected in the Date Range (if the end date is after the start date)", async () => {
      const selectedDate = newDate("2025-11-01");
      let startDate = selectedDate,
        endDate;
      const onChangeSpy = jest.fn((dates) => {
        [startDate, endDate] = dates;
      });

      const { container } = render(
        <DatePicker
          selectsRange
          selected={selectedDate}
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          onChange={onChangeSpy}
        />,
      );
      const input = safeQuerySelector<HTMLInputElement>(container, "input");
      fireEvent.focus(input);

      expect(container.querySelector(".react-datepicker")).toBeTruthy();
      const endDateEl = safeQuerySelector(
        container,
        ".react-datepicker__day--005",
      );
      fireEvent.click(endDateEl);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });

    it("should not refocus the input when the selected endDate is before the startDate", async () => {
      const selectedDate = newDate("2025-11-05");
      let startDate = selectedDate,
        endDate;
      const onChangeSpy = jest.fn((dates) => {
        [startDate, endDate] = dates;
      });

      const { container } = render(
        <DatePicker
          selectsRange
          selected={selectedDate}
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          onChange={onChangeSpy}
        />,
      );
      const input = safeQuerySelector<HTMLInputElement>(container, "input");
      fireEvent.focus(input);

      expect(container.querySelector(".react-datepicker")).toBeTruthy();
      const endDateEl = safeQuerySelector(
        container,
        ".react-datepicker__day--002",
      );
      fireEvent.click(endDateEl);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(document.activeElement).not.toBe(input);
        expect(document.activeElement).toBe(endDateEl);
      });
    });

    it('should refocus the input when the selected endDate is before the startDate when the "swapRange" prop is set', async () => {
      const selectedDate = newDate("2025-11-05");
      let startDate = selectedDate,
        endDate;
      const onChangeSpy = jest.fn((dates) => {
        [startDate, endDate] = dates;
      });

      const { container } = render(
        <DatePicker
          selectsRange
          swapRange
          selected={selectedDate}
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          onChange={onChangeSpy}
        />,
      );
      const input = safeQuerySelector<HTMLInputElement>(container, "input");
      fireEvent.focus(input);

      expect(container.querySelector(".react-datepicker")).toBeTruthy();
      const endDateEl = safeQuerySelector(
        container,
        ".react-datepicker__day--002",
      );
      fireEvent.click(endDateEl);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(document.activeElement).not.toBe(endDateEl);
        expect(document.activeElement).toBe(input);
      });
    });
  });

  it('should not close the datepicker on selecting a date when "inline" mode is enabled', async () => {
    let selectedDate = newDate("2025-11-05");
    const onChangeSpy = jest.fn((newDate) => {
      selectedDate = newDate;
    });

    const { container } = render(
      <DatePicker
        selected={selectedDate}
        dateFormat="yyyy-MM-dd"
        onChange={onChangeSpy}
      />,
    );

    expect(container.querySelector(".react-datepicker")).toBeTruthy();
    const newSelectedDateEl = safeQuerySelector(
      container,
      ".react-datepicker__day--002",
    );
    fireEvent.click(newSelectedDateEl);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(container.querySelector(".react-datepicker")).toBeTruthy();
    });
  });
  //   it('should not close the datepicker on selecting a date when "inline" mode is enabled', async () => {
  //     const selectedDate = newDate("2025-11-01");
  //     let startDate = selectedDate
  //     let endDate = null;
  //     const onChangeSpy = jest.fn((dates) => {
  //       [startDate, endDate] = dates;
  //     });

  //     const { container } = render(
  //       <DatePicker
  //         selectsRange
  //         selected={selectedDate}
  //         startDate={startDate}
  //         endDate={endDate}
  //         dateFormat="yyyy-MM-dd"
  //         onChange={onChangeSpy}
  //         inline
  //       />,
  //     );

  //     expect(container.querySelector(".react-datepicker")).toBeTruthy();
  //     const endDateEl = safeQuerySelector(
  //       container,
  //       ".react-datepicker__day--005",
  //     );
  //     fireEvent.click(endDateEl);

  //     expect(onChangeSpy).toHaveBeenCalledTimes(1);

  //     await waitFor(() => {
  //       expect(container.querySelector(".react-datepicker")).toBeTruthy();
  //     });
  //   });
});
