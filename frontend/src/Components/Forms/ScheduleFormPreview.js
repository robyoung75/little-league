import React from "react";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { handleDelete } from "../../assets/functions";

function ScheduleFormPreview({ setScheduleData }) {
  const [{ authSchedule, authTheme }] = useStateValue();
  return (
    <div className="scheduleFormPreview formPreview form">
      <h3>Schedule data</h3>
      <div className="scheduleFormPreview previewContainer form">
        <table className="formPreview__table">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th">Opponent</th>
              <th className="formPreview__th">Date</th>
              <th className="formPreview__th">Game time</th>
              <th className="formPreview__th">Arrival time</th>
              <th className="formPreview__th">Address</th>
              <th className="formPreview__th">City</th>
              <th className="formPreview__th">State</th>
              <th className="formPreview__th">Zip code</th>
              <th className="formPreview__th">Home or away</th>
              <th className="formPreview__th">Uniform color</th>
            </tr>
          </thead>
          <tbody>
            {authSchedule &&
              authSchedule.schedule.map((game) => (
                <tr className="formPreview__tr" key={Math.random()}>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.opponent}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {new Date(game.date).toString()}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.gameTime}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {game.arrivalTime}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.address}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.city}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.state}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.zipCode}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.homeAway}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{game.uniform}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton
                        className="formDelete"
                        theme={authTheme}
                        onClick={(e) =>
                          handleDelete(
                            game,                         
                            setScheduleData,
                            "schedule data"
                          )
                        }
                      >
                        Delete
                      </ThemedButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleFormPreview;
