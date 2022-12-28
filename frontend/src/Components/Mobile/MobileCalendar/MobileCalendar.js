import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../Context/stateProvider";

import {
  monthlySchedule,
  ISO_DateStringToShortString,
} from "../../../assets/functions";
import "./MobileCalendar.css";

const GameDay = ({ date }) => {
  const [{ teamData, authSchedule }] = useStateValue();
  const [monthSchedule, setmonthSchedule] = useState();

  useEffect(() => {
    if (teamData && date) {
      let schedule = monthlySchedule(teamData.scheduleData, date);
      setmonthSchedule(schedule);
    }
  }, [teamData, date]);

  return (
    <>
      {authSchedule
        ? authSchedule.schedule.map(
            (game) => (
              <tr key={game._id} className="gameDay__row">
                <td className="gameDay__cell">
                  <div className="gameDay__date">{game.opponent}</div>
                </td>
                <td className="gameDay__cell">
                  <div className="gameDay__opponent">
                    {ISO_DateStringToShortString(game.date)}
                  </div>
                </td>
                <td className="gameDay__cell">
                  <div className="gameDay__time">{game.gameTime}</div>
                </td>
                <td className="gameDay__cell">
                  <div className="gameDay__address">{game.address}</div>
                </td>
                <td className="gameDay__cell">
                  <div className="gameDay__uniform">{game.homeAway}</div>
                </td>
              </tr>
            ),
            console.log(
              authSchedule.schedule.map((item) =>
                console.log(new Date(item.date))
              )
            )
          )
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
