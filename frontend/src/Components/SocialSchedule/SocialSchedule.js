import React from "react";
import "./SocialSchedule.css";


function SocialSchedule({
  address,
  arrival,
  city,
  date,
  id,
  opponent,
  team,
  time,
  uniform,
}) {

  return (
    <tbody className="socialSchedule">
      <tr className="socialSchedule__row">
        <td className="socialSchedule__cell">
          <div className="socialSchedule__opponent">{opponent}</div>
        </td>
        <td className="socialSchedule__cell">
          <div className="socialSchedule__date">{date}</div>
        </td>
        <td className="socialSchedule__cell">
          <div className="socialSchedule__time">{time}</div>
        </td>
        <td className="socialSchedule__cell">
          <div className="socialSchedule__address">{address}</div>
        </td>
        <td className="socialSchedule__cell">
          <div className="socialSchedule__uniform">{uniform}</div>
        </td>
      </tr>
    </tbody>
  );
}

export default SocialSchedule;
