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
  let {
    opponent,
    date,
    gameTime,
    arrivalTime,
    address,
    city,
    state,
    zipCode,
    homeAway,
    uniformColor,
  } = req.body;

  let schedule = {};
  try {
    if (req.error) {
      console.log({ authSchedule_post: req.error });
      throw req.error;
    }
    const { id } = req.userId;

    console.log("ID SCHEDULE CREATE", id);
    const authUser = await findAdminUserById(id);
    const existingSchedule = await findTeamSchedule(authUser.teamId);

    console.log("AUTHUSER_SCEHDULE", authUser);
    schedule.teamId = authUser.teamId;
    schedule.teamUserName = authUser.teamUserName;
    schedule.teamName = authUser.teamName;
    schedule.opponent = opponent;
    schedule.date = date;
    schedule.gameTime = gameTime;
    schedule.arrivalTime = arrivalTime;
    schedule.address = address;
    schedule.city = city;
    schedule.state = state;
    schedule.zipCode = zipCode;
    schedule.homeAway = homeAway;
    schedule.uniformColor = uniformColor;

    console.log("SCHEDULE", schedule);

    if (!existingSchedule && authUser) {
      const scheduleDoc = await createNewSchedule({
        teamName: schedule.teamName,
        teamUserName: schedule.teamUserName,
        teamId: schedule.teamId,
        schedule: {
          teamName: schedule.teamName,
          teamUserName: schedule.teamUserName,
          teamId: schedule.teamId,
          opponent: schedule.opponent,
          date: schedule.date,
          gameTime: schedule.gameTime,
          arrivalTime: schedule.arrivalTime,
          address: schedule.address,
          city: schedule.city,
          state: schedule.state,
          zipCode: schedule.zipCode,
          homeAway: schedule.homeAway,
          uniformColor: schedule.uniformColor,
        },
      });
      res.status(200).json(scheduleDoc);
    }
    if (existingSchedule && authUser) {
      const filter = { teamId: schedule.teamId };
      const update = {
        $push: {
          schedule: schedule,
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
