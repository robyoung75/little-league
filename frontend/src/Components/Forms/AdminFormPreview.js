import React, { useEffect, useState } from "react";
import "./Forms.css";

function AdminFormPreview({ adminData }) {
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
              <th className="formPreview__th">Password</th>
            </tr>
          </thead>
          <tbody>
            <tr className="formPreview__tr">
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {adminData && adminData.firstName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {adminData && adminData.lastName}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {adminData && adminData.email}
                </div>
              </td>
              <td className="formPreview__td">
                <div className="formPreview__content">
                  {adminData && adminData.password}
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
