import React, { useState } from "react";
import "./DeleteWarningModal.css";

import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton, ThemedHeader } from "../../utils/ThemedComponents";
import { adminDeleteAdminUser } from "../../assets/requests";

export const DeleteWarningModal = ({
  deleteObj,
  dataUpdate,
  setDataUpdate,
  deleteModalActive,
  setDeleteModalActive,
}) => {
  const [{ authAdminUsers, authTheme }, dispatch] = useStateValue();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleConfirmDelete = (e) => {
    // e.preventDefault();
    !confirmDelete ? setConfirmDelete(true) : setConfirmDelete(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();

    const fetchData = async (userObj) => {
      try {
        let adminUserDelete = await adminDeleteAdminUser(userObj);
        dispatch({
          type: "SET_AUTH_ADMIN_USERS",
          authAdminUsers: adminUserDelete.data,
        });
        !dataUpdate ? setDataUpdate(true) : setDataUpdate(false);
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    fetchData(deleteObj).catch(console.error);
  };

  const handleCancel = (e) => {
    e.preventDefault();

    !deleteModalActive
      ? setDeleteModalActive(true)
      : setDeleteModalActive(false);
  };

  return (
    <div className="deleteWarningModal">
      <div className="deleteWarningModal__container">
        <div className="deleteWarningModal__container__header">
          <ThemedHeader
            className="deleteWarningModal__header"
            theme={authTheme}
            title="Delete Modal"
          ></ThemedHeader>
        </div>
        <div className="deleteWarningModal__container__content">
          <div className="deleteWarningModal__content">
            <span>
              Please click confirm delete to continue deleting admin user:
            </span>
            <br />
            <span>
              {deleteObj ? deleteObj.firstName : ""}{" "}
              {deleteObj ? deleteObj.lastName : ""}
            </span>
          </div>
          <label>
            Confirm Delete
            <input type="checkbox" onChange={handleConfirmDelete} />
          </label>
          <div className="deleteWarningModal__btns">
            <ThemedButton
              theme={authTheme}
              className="deleteWarningModal__btn"
              onClick={handleCancel}
            >
              Cancel
            </ThemedButton>
            {confirmDelete ? (
              <ThemedButton
                theme={authTheme}
                className="deleteWarningModal__btn"
                onClick={handleDelete}
                purpose="delete"
              >
                Delete
              </ThemedButton>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
