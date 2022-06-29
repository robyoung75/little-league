import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  createNewSchedule,
  findAdminUserById,
  findTeamSchedule,
  updateTeamSchedule,
} from "../utilities/controllerFunctions.js";

// check if existing team schedule exists if not create new schedule else update schedule
export const authSchedule_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authSchedule_post: req.error });
      throw req.error;
    }
    const { id } = req.userId;
    const authUser = await findAdminUserById(id);
    const existingSchedule = await findTeamSchedule(authUser.teamId);
    req.body.teamName = authUser.teamName;
    req.body.teamUserName = authUser.teamUserName;
    req.body.teamId = authUser.teamId;
    console.log({ authSchedule_post_reqBody: req.body });
    console.log({ authSchedule_post_authUser: authUser });

    if (!existingSchedule && authUser) {
      const schedule = await createNewSchedule({
        teamName: authUser.teamName,
        teamUserName: authUser.teamUserName,
        teamId: authUser.teamId,
        schedule: req.body.schedule,
      });
      res.status(200).json(schedule);
    }
    if (existingSchedule && authUser) {
      const filter = authUser.teamId;
      const update = {
        $push: {
          schedule: req.body.schedule,
        },
      };
      const updatedSchedule = await updateTeamSchedule(filter, update);

      res.status(200).json(updatedSchedule);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json(errors);
  }
};
