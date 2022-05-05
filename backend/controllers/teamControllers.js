// import model schemas from models/teamControllers
import TeamSchema from "../models/team.js";
import AdminUserSchema from "../models/aminUser.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";
import user from "../models/aminUser.js";

// create team
const authTeam_post = async (req, res) => {
  // req body
  const { primaryColor, secondaryColor } = req.body;
  console.log("authTeam_post req.userId from middleware", req.userId);
  const { id } = req.userId;
  console.log("team post id", id);

  try {
    const authUserDoc = await AdminUserSchema.findById(id);
    console.log("autUserDoc from team post", authUserDoc);

    if (authUserDoc) {
      const adminTeamPost = {
        teamName: authUserDoc.teamName,
        primaryColor,
        secondaryColor,
        _id: id,
      };
      const authTeamDoc = await TeamSchema.create(adminTeamPost);

      const response = {
        teamName: authTeamDoc.teamName,
        _id: authTeamDoc._id,
        primaryColor: authTeamDoc.primaryColor,
        secondaryColor: authTeamDoc.secondaryColor,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { authTeam_post };
