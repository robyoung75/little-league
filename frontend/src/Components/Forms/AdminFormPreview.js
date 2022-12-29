import React, { useEffect, useState } from "react";
import {
  adminDeleteAdminUser,
  adminUserGetAdminUsers,
} from "../../assets/requests";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";
import "./Forms.css";
import { DeleteWarningModal } from "../DeleteWarningModal/DeleteWarningModal";

function AdminFormPreview() {
  const [{ authUser, authAdminUsers, authTheme }, dispatch] = useStateValue();
  const [dataUpdate, setDataUpdate] = useState(false);
  const [deleteObj, setDeleteObj] = useState(null);
  const [deleteModalActive, setDeleteModalActive] = useState(false);

  const handleDelete = (e, key, userObj) => {
    e.preventDefault();
    console.log("hello from handleDelete function >>>>> ", { key, userObj });
    let test = [];
    authAdminUsers.admin.forEach((adminUser) => {
      if (adminUser._id === userObj._id) {
        test.push(adminUser);
      }
    });
    setDeleteObj(test[0]);

    !deleteModalActive
      ? setDeleteModalActive(true)
      : setDeleteModalActive(false);

      window.scrollTo(0,0)
  };

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      console.log("Getting admin users");
      let authUsers = await adminUserGetAdminUsers();

      dispatch({
        type: "SET_AUTH_ADMIN_USERS",
        authAdminUsers: authUsers.data,
      });
    };

    fetchData().catch(console.error);

    return () => {
      isSubscribed = false;
    };
  }, [dataUpdate]);

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
            {authAdminUsers &&
              authAdminUsers.admin.map((user, i) => (
                <tr className="formPreview__tr" key={i}>
                  <td className="formPreview__td">
                    <div className="formPreview__content" id={user.firstName}>
                      {user.firstName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content" id={user.lastName}>
                      {user.lastName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content" id={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div
                      className="formPreview__content"
                      id={user.teamUserName}
                    >
                      {user.teamUserName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {"password is set"}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton className={"formDelete"} theme={authTheme}>
                        Edit
                      </ThemedButton>
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton
                        className={"formDelete"}
                        theme={authTheme}
                        onClick={(e) => handleDelete(e, i, user)}
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
      {deleteModalActive ? (
        <DeleteWarningModal
          deleteObj={deleteObj}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
          deleteModalActive={deleteModalActive}
          setDeleteModalActive={setDeleteModalActive}
        />
      ) : null}
    </div>
  );
}

export default AdminFormPreview;
