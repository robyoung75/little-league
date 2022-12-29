import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";
import { handleDelete } from "../../assets/functions";

const AdminCreateUserFormPreview = ({ setPlayersData }) => {
  const [{ authTheme, authPlayers, authUsers }] = useStateValue();
  return (
    <div>
      <h3>User data</h3>
      <div className="adminCreateUserFormPreview previewContainer form">
        <table className="formPreview__table ">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th images">First name</th>
              <th className="formPreview__th">Last name</th>
              <th className="formPreview__th">Email</th>
              <th className="formPreview__th">Player First name</th>
              <th className="formPreview__th">Player Last name</th>
              {/* <th className="formPreview__th">Password</th> */}
            </tr>
          </thead>
          <tbody>
            {authUsers &&
              authUsers.users.map((user, i) => (
                <tr className="formPreview__tr" key={i}>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{user.firstName}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{user.lastName}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{user.email}</div>
                  </td>
                  {/* <td className="formPreview__td">
                    <div className="formPreview__content">{user.password}</div>
                  </td> */}
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {user.playerFirstName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {user.playerLastName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton
                        className="formDelete"
                        theme={authTheme}
                        onClick={(e) =>
                          handleDelete(user, setPlayersData, "players data")
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
};

export default AdminCreateUserFormPreview;
