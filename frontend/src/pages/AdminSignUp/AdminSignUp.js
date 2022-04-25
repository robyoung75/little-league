import React, { useState, useEffect } from "react";
import "./AdminSignUp.css";
import AdminForm from "../../Components/Forms/AdminForm";
import AdminFormPreview from "../../Components/Forms/AdminFormPreview";
import { checkLocalData } from "../../assets/functions";

function AdminSignUp() {
  const [adminData, setAdminData] = useState();
  const [newAdminData, setNewAdminData] = useState(false);

  useEffect(() => {
    checkLocalData("admin data", setAdminData);

    window.addEventListener("localAdmin", checkLocalData);
    return () => {
      window.removeEventListener("localAdmin", checkLocalData);
    };
  }, [newAdminData]);
  return (
    <div className="adminSignUp">
      <div className="adminSignUp__left">     
        <AdminForm
          setNewAdminData={setNewAdminData}
          newAdminData={newAdminData}
        />
      </div>
      <div className="adminSignUp__right">      
        <AdminFormPreview adminData={adminData} />
      </div>
    </div>
  );
}

export default AdminSignUp;
