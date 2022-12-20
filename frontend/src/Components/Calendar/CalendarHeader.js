import React from "react";
import "./Calendar.css";
import { useStateValue } from "../../Context/stateProvider";
import { days } from "../../assets/functions";
import { ThemedDiv } from "../../utils/ThemedComponents";

function CalendarHeader() {
  const [{ authTheme }] = useStateValue();

  return (
    <>
      {days.map((day) => (
        <ThemedDiv theme={authTheme} className="calendar__header" key={day}>
          {day}
        </ThemedDiv>
      ))}
    </>
  );
}

export default CalendarHeader;
