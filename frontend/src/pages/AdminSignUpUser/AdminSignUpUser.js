import React from "react";
import AdminCreateUser from "../../Components/Forms/AdminCreateUser";
import AdminCreateUserFormPreview from "../../Components/Forms/AdminCreateUserFormPreview";
import "./AdminSignUpUser.css"

const AdminSignUpUser = () => {
  return (
    <div className="adminSignUpUser">
      <div className="adminSignUpUser__left">
        <AdminCreateUser />
      </div>
      <div className="adminSignUpUser__right">
        <AdminCreateUserFormPreview />
      </div>
    </div>
  );
};

export default AdminSignUpUser;
