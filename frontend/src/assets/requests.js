import { axiosInstance } from "../axios";

// create an admin user
export const adminUserPost = async (dataObj) => {
  try {
    const response = await axiosInstance.post("/api/createAdminUser", dataObj);
    if (response) {
      console.log("adminUserPost response", response);
      return response;
    }
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

// create by admin user only new team, logo and colors
export const adminTeamPost = async (dataObj) => {
  console.log('adminTeamPost_dataObj', dataObj)
  try {
    const response = await axiosInstance.post("/api/admin/team", dataObj);
    if (response) {
      console.log("adminTeamPost response", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// user sign in
export const authUserSignInPost = async (dataObj) => {
  console.log("authUserSignInPost dataObj", dataObj);
  try {
    const response = await axiosInstance.post("/api/signin", dataObj);
    if (response) {
      console.log("authUserSignInPost", response);
      return response;
    }
  } catch (error) {
    console.log({ authUserSignInPost: error });
    return error;
  }
};

// user sign out
export const authUserSignOut = async () => {
  try {
    const response = await axiosInstance.get("/api/signout");
    if (response) {
      console.log("you are now signed out", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// create by admin user only players, images, positions...
export const adminPlayersPost = async (dataObj) => {
  console.log({ adminPlayersPost_dataObj: dataObj });
  try {
    const response = await axiosInstance.post(
      "/api/admin/createPlayers",
      dataObj
    );
    if (response) {
      console.log("adminPlayersPost response", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const adminCoachesPost = async (dataObj) => {
  console.log({ adminCoachesPost_dataObj: dataObj });

  try {
    const response = await axiosInstance.post(
      "/api/admin/createCoaches",
      dataObj
    );
    if (response) {
      console.log({ adminCoachesPost: response });
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
