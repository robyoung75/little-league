import React from "react";
import { handleDelete } from "../../assets/functions";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";

function CoachesFormPreview({ coachesData, setCoachesData }) {
  const [{ theme }] = useStateValue();
  return (
    <div className="coachesFormPreview formPreview form">
      <h3>Coach data</h3>
      <div className="coachesFormPreview previewContainer form">
        <table className="formPreview__table">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th">First name</th>
              <th className="formPreview__th">Last name</th>
              <th className="formPreview__th">Email</th>
              <th className="formPreview__th">Headshot</th>
            </tr>
          </thead>
          <tbody>
            {coachesData &&
              coachesData.map((coach, i) => (
                <tr className="formPreview__tr" key={i}>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {coach.firstName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{coach.lastName}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{coach.email}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {coach.coachImg ? (
                        <img
                          className="imgFileInput__img"
                          src={coach.coachImg}
                          alt="coach"
                        />
                      ) : (
                        "No image selected"
                      )}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton
                        className="formDelete"
                        theme={theme}
                        onClick={(e) =>
                          handleDelete(
                            coach,
                            coachesData,
                            setCoachesData,
                            "coaches data"
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

export default CoachesFormPreview;
