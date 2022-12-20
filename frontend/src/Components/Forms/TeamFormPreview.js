import React from "react";
import { useStateValue } from "../../Context/stateProvider";

function TeamFormPreview() {
  const [{ authTeam }] = useStateValue();
  return (
    <div className="teamFormPreview formPreview form">
      <h3>Team data</h3>
      <div className="teamFormPreview previewContainer form">
        <table className="formPreview__table">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th">Team name</th>
              <th className="formPreview__th">Primary color</th>
              <th className="formPreview__th">Secondary color</th>
            </tr>
          </thead>
          <tbody>
            <tr className="formPreview__tr">
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authTeam && authTeam.teamName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authTeam && authTeam.primaryColor}
                  <div
                    style={{
                      background: authTeam && authTeam.primaryColor,
                      height: "2rem",
                      width: "100%",
                    }}
                  ></div>
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authTeam && authTeam.secondaryColor}
                  <div
                    style={{
                      background: authTeam && authTeam.secondaryColor,
                      height: "2rem",
                      width: "100%",
                    }}
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="formPreview__contentImg">
          <h3>Team logo</h3>
          <img
            className="formPreview__img"
            src={authTeam && authTeam.teamLogo}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamFormPreview;
