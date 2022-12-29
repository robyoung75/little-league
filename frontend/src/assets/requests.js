import { axiosInstanceFormData, axiosInstance } from "../axios";

// USER SIGN IN / SIGN OUT REQUESTS.
// admin user sign in
export const adminUserSignIn = async (dataObj) => {
  console.log("adminUserSignIn dataObj", dataObj);
  try {
    const response = await axiosInstance.post("/api/admin/signin", dataObj);
    if (response) {
      console.log("adminUserSignIn", response);
      return response;
    }
  } catch (error) {
    console.log(error);

    let errorResponse = {};

    if (error.response) {
      // axios error handling
      console.log({
        responseData: error.response.data,
        responseStatus: error.response.status,
        responseHeaders: error.response.headers,
      });

      errorResponse.message = error.response.data;
      errorResponse.status = error.response.status;
      errorResponse.headers = error.response.headers;
    } else if (error.request) {
      console.log({ requestError: error.request });
      errorResponse.request = error.request;
    } else {
      console.log({ Error: error.message });
      errorResponse.ErrorMessage = error.message;
    }
    return errorResponse;
  }
};

// user sign in
export const userSignIn = async (dataObj) => {
  console.log("userSignIn dataObj >>>>> ", dataObj);
  try {
    const response = await axiosInstance.post("/api/user/signin", dataObj);
    if (response) {
      console.log("userSignInResponse >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);

    let errorResponse = {};

    if (error.response) {
      console.log({
        responseData: error.response.data,
        responseStatus: error.response.status,
        responseHeaders: error.response.headers,
      });

      errorResponse.message = error.response.data.message;
      errorResponse.status = error.response.status;
      errorResponse.headers = error.response.headers;
    } else if (error.request) {
      console.log({ requestError: error.request });
      errorResponse.request = error.request;
    } else {
      console.log({ Error: error.message });
      errorResponse.ErrorMessage = error.message;
    }
    return errorResponse;
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

// CREATE REQUESTS
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

// create USER by admin user, usersForm
export const adminCreateNewUser = async (dataObj) => {
  try {
    const response = await axiosInstance.post("api/admin/createUser", dataObj);
    if (response.status === 200) {
      console.log("adminCreateNewUser__response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

// create a new USER by user...
export const userCreateAccount = async (dataObj) => {
  try {
    console.log("userCreateAccount", dataObj);
    const response = await axiosInstance.post("/api/user/createUser", dataObj);

    if (response) {
      console.log("userCreateAccount__RESPONSE >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log("userCreateAccount__ERROR >>>>> ", error);
    return error;
  }
};

// create by admin user only new TEAM, logo and colors
export const adminTeamPost = async (dataObj) => {
  console.log("adminTeamPost_dataObj", dataObj);
  try {
    const response = await axiosInstanceFormData.post(
      "/api/admin/team",
      dataObj
    );
    if (response) {
      console.log("adminTeamPost response", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// create by admin user only PLAYERS, images, positions...
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

// create by admin user only COACHES, image, info...
export const adminCoachesPost = async (dataObj) => {
  console.log({ adminCoachesPost_dataObj: dataObj });

  try {
    const response = await axiosInstance.post(
      "/api/admin/coaches/createCoach",
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

// create by admin user only a SCHEDULE
export const adminSchedulePost = async (dataObj) => {
  console.log({ adminSchedulePost: dataObj });

  try {
    const response = await axiosInstance.post(
      "/api/admin/createSchedule",
      dataObj
    );
    if (response) {
      console.log({ adminSchedulePost: response });
      return response;
    }
  } catch (error) {
    console.log({ adminSchedulePost: error });
    return error;
  }
};

// create POST by any authenticated user
export const userPost = async (teamId, dataObj) => {
  try {
    const response = await axiosInstanceFormData.post(
      `/api/user/posts/${teamId}`,
      dataObj
    );

    if (response) {
      console.log("userPost >>>>> response", response);
      return response;
    }
  } catch (error) {
    console.log({ userPost_error: error });
    return error;
  }
};

// READ REQUESTS
// get TEAM any auth user
export const authUserGetTeam = async (teamId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/team/${teamId}`);

    if (response) {
      console.log("authUserGetTeam__Response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get PLAYERS any auth user
export const authUserGetPlayers = async (teamId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/players/${teamId}`);
    if (response) {
      console.log("authUserGetPlayers__Response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get COACHES any auth user
export const authUserGetCoaches = async (teamId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/coaches/${teamId}`);
    if (response) {
      console.log("authUserGetCoaches__Response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get SCHEDULE any auth user
export const authUserGetSchedule = async (teamId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/schedule/${teamId}`);
    if (response) {
      console.log("authUserGetSchedule__Response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get POSTS any auth users
export const authUserGetPosts = async (teamId) => {
  try {
    const response = await axiosInstance.get(`/api/user/posts/${teamId}`);
    if (response) {
      console.log("authUserGetPosts__Response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get USERS by admin user only
export const adminUserGetUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/users");

    if (response.status === 200) {
      console.log("adminUserGetUsers__response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get ADMIN USERS by admin user only
export const adminUserGetAdminUsers = async () => {
  try {
    const response = await axiosInstance.get("api/admin/adminUsers");

    if (response.status === 200) {
      console.log("adminUserGetAdminUsers__response >>>>> ", response);
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// UPDATE REQUESTS

// update admin users to include a second user, only two admin users are allowed
export const addSecondAdminUser = async (teamId, dataObj) => {
  console.log(dataObj);
  try {
    const response = await axiosInstance.put(
      `/api/admin/updateAdminUsers/${teamId}`,
      dataObj
    );

    if (response) {
      console.log({ addSecondAdminUser: response });
      return response;
    }
  } catch (error) {
    console.log({ addSecondAdminUser: error });
    return error;
  }
};

// DELETE REQUESTS

// delete ADMIN USER by admin only
export const adminDeleteAdminUser = async (dataObj) => {
  console.log("adminDeleteAdminUser__dataObj >>>>> ", dataObj);

  try {
    const response = await axiosInstance.delete(
      `/api/admin/updateRemoveAdminUser/${dataObj.teamId}?userId=${dataObj._id}`
    );

    console.log(response);
    return response;
  } catch (error) {
    console.log("adminDeleteAdminUser__error >>>>> ", error);
    return error;
  }
};
