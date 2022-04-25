import React from "react";
import "./SocialScheduleList.css";
import { useStateValue } from "../../Context/stateProvider";

import SocialSchedule from "../SocialSchedule/SocialSchedule";

import { ThemedDiv, ThemedHeader } from "../../utils/ThemedComponents";
function ScheduleList() {
  const [{ theme, teamData }] = useStateValue();
  return (
    <ThemedDiv theme={theme} className="scheduleList">
      <div className="scheduleList__headerContainer">
        <ThemedHeader title="2022 Schedule" theme={theme} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Date</th>
            <th>Time</th>
            <th>Address</th>
            <th>Uniform</th>
          </tr>
        </thead>

        {teamData
          ? teamData.scheduleData.map((game) => (
              <SocialSchedule
                key={game.id}
                address={game.address}
                arrival={game.arrival}
                city={game.city}
                date={game.date}
                id={game.id}
                opponent={game.opponent}
                team={game.team}
                time={game.time}
                uniform={game.uniform}
              />
            ))
          : null}
      </table>
    </ThemedDiv>
  );
}

export default ScheduleList;
