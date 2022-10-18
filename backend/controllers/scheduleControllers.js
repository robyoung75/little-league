import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  createNewSchedule,
  findAdminUserById,
  findTeamSchedule,
  updateScheduleDate,
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

    let schedule = req.body;

    // console.log("ID SCHEDULE CREATE", id);

    const authUser = await findAdminUserById(id);
    const existingSchedule = await findTeamSchedule(authUser.teamId);

    // console.log("AUTHUSER_SCEHDULE", authUser);
    schedule.teamId = authUser.teamId;
    schedule.teamUserName = authUser.teamUserName;
    schedule.teamName = authUser.teamName;

    // console.log("SCHEDULE", schedule);

    if (!existingSchedule && authUser) {
      const scheduleDoc = await createNewSchedule({
        teamName: schedule.teamName,
        teamUserName: schedule.teamUserName,
        teamId: schedule.teamId,
        schedule: schedule,
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

// READ ALL SCHEDULE ITEMS

export const schedule_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ schedule_get: req.error.message });
      throw req.error;
    }

    const schedule = await findTeamSchedule(req.userTeamId);

    res.status(200).json(schedule);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE SCHEDULE
export const updateSchedule_put = async (req, res) => {
  try {
    if (req.error) {
      console.log({ scheduleUpdate_put_req_put: error });
      throw req.error;
    }

    const { id } = req.userId;
    const { scheduleId } = req.query;

    let updateObj = req.body;
    let filter = { id: id, "schedule._id": scheduleId };

    let updatedScheduleDoc = await updateScheduleDate(filter, updateObj);

    res.json(updatedScheduleDoc);
  } catch (error) {
    console.log({ scheduleUpdate_put: error });
    const errors = handleErrors(error);
    res.status(400).json(errors);
  }
};
