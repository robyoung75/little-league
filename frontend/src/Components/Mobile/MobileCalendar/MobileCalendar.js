import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../Context/stateProvider";

import { monthlySchedule } from "../../../assets/functions";
import "./MobileCalendar.css";

const GameDay = ({ date }) => {
  const [{ teamData }] = useStateValue();
  const [monthSchedule, setmonthSchedule] = useState();

  useEffect(() => {
    if (teamData && date) {
      let schedule = monthlySchedule(teamData.scheduleData, date);
      setmonthSchedule(schedule);
    }
  }, [teamData, date]);

  return (
    <>
      {monthSchedule
        ? monthSchedule.map((game) => (
            <tr key={game.id} className="gameDay__row">
              <td className="gameDay__cell">
                <div className="gameDay__date">{game.date}</div>
              </td>
              <td className="gameDay__cell">
                <div className="gameDay__opponent">{game.opponent}</div>
              </td>
              <td className="gameDay__cell">
                <div className="gameDay__time">{game.time}</div>
              </td>
              <td className="gameDay__cell">
                <div className="gameDay__address">{game.address}</div>
              </td>
              <td className="gameDay__cell">
                <div className="gameDay__uniform">{game.uniform}</div>
              </td>
            </tr>
          ))
        : null}
    </>
  );
};

function MobileCalendar({ date }) {
  return (
    <div className="mobileCalendar">
      <table className="mobileCalendar__table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Date</th>
            <th>Time</th>
            <th>Address</th>
            <th>Uniform</th>
          </tr>
        </thead>
        <tbody>
          <GameDay date={date} />
        </tbody>
      </table>
    </div>
  );
}

export default MobileCalendar;
