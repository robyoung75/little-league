import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { useStateValue } from "../../Context/stateProvider";
import {
  daysInMonth,
  monthlySchedule,
  findIndex,
  months,
  days,
  startOfMonthDay,
} from "../../assets/functions";
import { ThemedDiv } from "../../utils/ThemedComponents";

function CalendarDays({ date }) {
  const [{ authTheme, teamData }, dispatch] = useStateValue();
  const [daysInTheMonth, setDaysInTheMonth] = useState();
  const [firstDayOfMonth, setFirstDayOfMonth] = useState();
  const [monthSchedule, setmonthSchedule] = useState();
  const [element, setElement] = useState(null);

  const handleClick = (e, index) => {
    e.preventDefault();

    let opponentClass = document.getElementsByClassName(index + "_opponent");
    let opponent = opponentClass[0].innerHTML;

    let gameTimeClass = document.getElementsByClassName(index + "_gameTime");
    let gameTime = gameTimeClass[0].innerHTML;

    let arrivalTimeClass = document.getElementsByClassName(
      index + "_arrivalTime"
    );
    let arrivalTime = arrivalTimeClass[0].innerHTML;

    let addressClass = document.getElementsByClassName(index + "_address");
    let address = addressClass[0].innerHTML;

    let homeAwayClass = document.getElementsByClassName(index + "_homeAway");
    let homeAway = homeAwayClass[0].innerHTML;

    setElement({ opponent, gameTime, arrivalTime, address, homeAway });
  };

  function calendarDayContent(item, calNumIndex, firstDayOfMonthIndex) {
    if (monthSchedule) {
      let dates = monthSchedule.map((game, index) => {
        let gameDayDateString = game.date.split(" ");
        let date = Number(gameDayDateString[2]);

        if (
          date === item &&
          calNumIndex > firstDayOfMonthIndex &&
          game.team === "home"
        ) {
          let content = (
            <ThemedDiv
              theme={authTheme}
              className="calendarDay__content"
              key={game.id}
              onClick={(e) => handleClick(e, index)}
            >
              <div className={index}>
                <p className={index + "_opponent"}>{game.opponent}</p>
                <p className={index + "_gameTime"}>{game.time}</p>
                <p
                  className={index + "_arrivalTime"}
                  style={{ display: "none" }}
                >
                  {game.arrival}
                </p>
                <p className={index + "_address"} style={{ display: "none" }}>
                  {game.address}
                </p>
                <p className={index + "_homeAway"} style={{ display: "none" }}>
                  {game.team}
                </p>
              </div>
            </ThemedDiv>
          );
          return content;
        }

        if (
          date === item &&
          calNumIndex > firstDayOfMonthIndex &&
          game.team === "away"
        ) {
          let content = (
            <div
              className="calendarDay__content"
              key={game.id}
              onClick={(e) => handleClick(e, index)}
            >
              <div className={index}>
                <p className={index + "_opponent"}>{game.opponent}</p>
                <p className={index + "_gameTime"}>{game.time}</p>
                <p
                  className={index + "_arrivalTime"}
                  style={{ display: "none" }}
                >
                  {game.arrival}
                </p>
                <p className={index + "_address"} style={{ display: "none" }}>
                  {game.address}
                </p>
                <p className={index + "_homeAway"} style={{ display: "none" }}>
                  {game.team}
                </p>
              </div>
            </div>
          );
          return content;
        }
        return "";
      });
      return dates;
    }
  }

  const calendarDay = () => {
    let calNums = [];
    let calDays = [];
    let prevDays = [];

    // index of first day of the month
    let firstDayOfMonthIndex = findIndex(days, firstDayOfMonth);

    const prevMonthsDays = daysInMonth(
      findIndex(months, date.month) - 1,
      date.year
    );

    for (let i = 0; i <= daysInTheMonth + firstDayOfMonthIndex; i++) {
      calNums.push(i);
    }

    for (let i = 0; i <= prevMonthsDays; i++) {
      prevDays.push(i);
    }
    prevDays.reverse();

    calNums.map((item, calNumIndex) => {
      if (item < calNums.length - 1) {
        return calDays.push(
          <div
            className={
              item - firstDayOfMonthIndex < 0
                ? "calendarDay nextMonth"
                : "calendarDay"
            }
            key={Math.random()}
          >
            <div className="calendarDay__num">
              {item === firstDayOfMonthIndex
                ? (item = 1)
                : item - firstDayOfMonthIndex < 1
                ? (item = item - firstDayOfMonthIndex + prevDays.length)
                : item - firstDayOfMonthIndex > daysInTheMonth
                ? null
                : item - firstDayOfMonthIndex + 1}
              {calendarDayContent(
                item - firstDayOfMonthIndex + 1,
                calNumIndex,
                firstDayOfMonthIndex
              )}
            </div>
          </div>
        );
      }
      return item;
    });

    let i = 1;
    while (calDays.length % 7 !== 0)
      calDays.push(
        <div className="calendarDay nextMonth" key={i}>
          {i++}
        </div>
      );

    return calDays;
  };

  useEffect(() => {
    if (teamData && date) {
      let schedule = monthlySchedule(teamData.scheduleData, date);
      setmonthSchedule(schedule);
      setDaysInTheMonth(daysInMonth(findIndex(months, date.month), date.year));
      setFirstDayOfMonth(
        days[startOfMonthDay(2022, findIndex(months, date.month))]
      );
    }
  }, [teamData, date, element]);

  useEffect(() => {
    dispatch({
      type: "SET_GAME_DATA",
      gameData: element,
    });
  }, [element, dispatch]);

  return <>{calendarDay()}</>;
}

export default CalendarDays;
