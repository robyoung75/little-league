import React from "react";
import "./Calendar.css";
import { useStateValue } from "../../Context/stateProvider";

import { ThemedDiv } from "../../utils/ThemedComponents";
import CalendarHeader from "./CalendarHeader";
import CalendarDays from "./CalendarDays";
import CalendarModal from "./CalendarModal";

function Calendar({ date }) {
  const [{authTheme, gameData }] = useStateValue();

  return (
    <div className="calendar">
      <div>
        <div className="calendar__gameLocation">
          <ThemedDiv
            theme={authTheme}
            className="calendar__gameLocationContent"
          ></ThemedDiv>
          <span>Home</span>
          <div className="calendar__gameLocationContent"></div>
          <span>Away</span>
        </div>
      </div>

      <h1>
        {date.month} {date.year}
      </h1>
      <CalendarHeader />
      <CalendarDays date={date} />
      {gameData !== null ? <CalendarModal /> : null}
    </div>
  );
}

export default Calendar;
