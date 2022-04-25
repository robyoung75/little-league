import React from "react";

function TeamFormPreview({ teamData }) {
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
                  {teamData && teamData.teamName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {teamData && teamData.primaryColor}
                  <div
                    style={{
                      background: teamData && teamData.primaryColor,
                      height: "2rem",
                      width: "100%",
                    }}
                  ></div>
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {teamData && teamData.secondaryColor}
                  <div
                    style={{
                      background: teamData && teamData.secondaryColor,
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
            className="imgFileInput__img"
            src={teamData && teamData.teamLogo}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamFormPreview;
