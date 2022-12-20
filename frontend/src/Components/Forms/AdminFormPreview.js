import React, { useEffect, useState } from "react";
import { useStateValue } from "../../Context/stateProvider";
import "./Forms.css";

function AdminFormPreview() {
  const [{ authUser }] = useStateValue();

  return (
    <div className="adminFormPreview formPreview form">
      <h3>Admin data</h3>
      <div className="adminFormPreview previewContainer form">
        <table className="formPreview__table">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th">First name</th>
              <th className="formPreview__th">Last name</th>
              <th className="formPreview__th">Email</th>
              <th className="formPreview__th">Team user name</th>
              <th className="formPreview__th">Password</th>
            </tr>
          </thead>
          <tbody>
            <tr className="formPreview__tr">
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authUser && authUser.firstName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authUser && authUser.lastName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authUser && authUser.email}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authUser && authUser.teamUserName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {authUser && "password is set"}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFormPreview;
