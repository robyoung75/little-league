import { axiosInstance } from "../axios";

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

export const adminTeamPost = async (dataObj) => {
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

export const authUserSignInPost = async (dataObj) => {
  console.log("authUserSignInPost dataObj", dataObj)
  try {
    const response = await axiosInstance.post("/api/signin", dataObj);
    if (response) {
      console.log("authUserSignInPost", response);
      return response;
    }
  } catch (error) {
    console.log({ authUserSignInPost: error });
    return error
  }
};

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

export const adminPlayersPost = async (dataObj) => {
  console.log({adminPlayersPost_dataObj: dataObj})
  try {
    const response = await axiosInstance.post("/api/admin/createPlayers", dataObj);
    if (response) {
      console.log("adminPlayersPost resposne", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
