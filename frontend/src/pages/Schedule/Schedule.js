import React, { useEffect, useState } from "react";
import "./Schedule.css";
import Calendar from "../../Components/Calendar/Calendar";
import MobileCalendar from "../../Components/Mobile/MobileCalendar/MobileCalendar";

import {
  loadYears,
  currentMonthAndYear,
  months,
  currentYear,
} from "../../assets/functions";

import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";

function Schedule({ mobile, isActive }) {
  const [{ theme }] = useStateValue();
  const [date, setDate] = useState("");
  const [startYear, setStartYear] = useState();
  const [endYear, setEndYear] = useState();
  const [btnsActive, setBtnsActive] = useState(false);
  const [monthDropdownActive, setMonthDropdownActive] = useState(false);
  const [yearDropdownActive, setYearDropdownActive] = useState(false);
  const [mobileSize, setMobileSize] = useState();

  const handleDateIncrement = (e) => {
    e.preventDefault();
    months.map((month, index) => {
      if (month === date.month) {
        setDate({ month: months[index + 1], year: date.year });
      }

      if (date.month === "December") {
        setDate({ month: months[0], year: date.year + 1 });
      }
      return month;
    });
  };

  const handleDateDecrement = (e) => {
    e.preventDefault();
    months.map((month, index) => {
      if (month === date.month) {
        setDate({ month: months[index - 1], year: date.year });
      }
      if (date.month === "January") {
        setDate({ month: months[11], year: date.year - 1 });
      }
      return month;
    });
  };

  const handleBtnsActive = (e) => {
    e.preventDefault();
    btnsActive === true ? setBtnsActive(false) : setBtnsActive(true);
    setYearDropdownActive(false);
    setMonthDropdownActive(false);
  };

  const handleMonthDropdownActive = (e) => {
    e.preventDefault();
    monthDropdownActive === true
      ? setMonthDropdownActive(false)
      : setMonthDropdownActive(true);
    setYearDropdownActive(false);
  };

  const handleYearDropdownActive = (e) => {
    e.preventDefault();
    yearDropdownActive === true
      ? setYearDropdownActive(false)
      : setYearDropdownActive(true);
    setMonthDropdownActive(false);
  };

  const handleSetMonth = (e) => {
    e.preventDefault();
    setDate({ month: e.target.innerHTML, year: date.year });
    setMonthDropdownActive(false);
    setBtnsActive(false);
  };

  const handleSetYear = (e) => {
    e.preventDefault();
    setDate({ month: date.month, year: e.target.innerHTML });
    setYearDropdownActive(false);
    setBtnsActive(false);
  };

  useEffect(() => {
    let date = currentMonthAndYear(months);
    setDate(date);
    setStartYear(currentYear());
    let endYear = currentYear() + 3;
    setEndYear(endYear);
  }, []);

  useEffect(() => {
    console.log("useEffect schedule window size", window.innerWidth);
    let handleResize = () => {
      window.innerWidth >= mobile ? setMobileSize(false) : setMobileSize(true);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobile, setMobileSize]);

  return (
    <div className={isActive ? "schedule__active" : 'schedule'}>
      <h1>{currentYear()} Schedule</h1>

      <div className="schedule__flexContainer dateBar">
        <div className="schedule__flexContainer dateBarInput">
          <ThemedButton
            theme={theme}
            onClick={handleDateDecrement}
            className="schedule__buttonIncDec"
          >
            -
          </ThemedButton>
          <button onClick={handleBtnsActive} className="schedule__inputBtn">
            <input
              className="schedule__input"
              value={date ? `${date.month} ${date.year}` : ""}
              readOnly
            ></input>
          </button>
          <ThemedButton
            theme={theme}
            onClick={handleDateIncrement}
            className="schedule__buttonIncDec"
          >
            +
          </ThemedButton>
        </div>
        <div
          className={
            btnsActive
              ? "schedule__flexContainer"
              : " schedule__dateBtnsContainer"
          }
        >
          <div className="schedule__flexContainer schedule__dateBtnCol">
            <ThemedButton
              theme={theme}
              className="schedule__dateBtn"
              onClick={handleMonthDropdownActive}
            >
              {date ? date.month : null}
            </ThemedButton>
            <div
              className={
                monthDropdownActive
                  ? "schedule__flexContainer monthPicker__active"
                  : "monthPicker"
              }
            >
              {months.map((month) => (
                <span key={month} onClick={handleSetMonth}>
                  {month}
                </span>
              ))}
            </div>
          </div>
          <div className="schedule__flexContainer schedule__dateBtnCol">
            <ThemedButton
              theme={theme}
              className="schedule__dateBtn"
              onClick={handleYearDropdownActive}
            >
              {date ? date.year : null}
            </ThemedButton>
            <div
              className={
                yearDropdownActive
                  ? "schedule__flexContainer yearPicker__active"
                  : "yearPicker"
              }
            >
              {startYear && endYear
                ? loadYears(startYear, endYear).map((year) => (
                    <span key={year} onClick={handleSetYear}>
                      {year}
                    </span>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>

      <Calendar date={date} />

      <MobileCalendar date={date} />
    </div>
  );
}

export default Schedule;
