import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  createSchedules,
  deleteSchedule,
  getAdminUsersById,
  getTeamSchedule,
  updateScheduleData,
  updateTeamSchedule,
  createSchedule,
} from "../utilities/controllerFunctions.js";

// CREATE A NEW SCHEDULE DATE
export const createSchedule_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authSchedule_post: req.error });
      throw req.error;
    }

    const { id } = req.userId;
    req.body.teamId = id;
    const schedule = req.body;

    const scheduleDoc = await createSchedule(id, schedule);

    res.status(200).json(scheduleDoc);
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

    // req.param middleware returns req.teamUserId
    const teamUserId = req.userTeamId;

    const schedule = await getTeamSchedule(teamUserId);

    console.log({ teamUserId });

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

    console.log({ id, scheduleId, updateObj });

    let updatedScheduleDoc = await updateScheduleData(
      id,
      scheduleId,
      updateObj
    );

    res.json(updatedScheduleDoc);
  } catch (error) {
    console.log({ scheduleUpdate_put: error });
    const errors = handleErrors(error);
    res.status(400).json(errors);
  }
};

// DELETE SCHEDULE
export const deleteSchedule_delete = async (req, res) => {
  try {
    if (req.error) {
      console.log({ deleteSchedule_delete: error });
      throw req.error;
    }
    const { id } = req.userId;
    const { scheduleId } = req.query;

    const updatedScheduleDoc = await deleteSchedule(id, scheduleId);

    res.status(200).json(updatedScheduleDoc);
  } catch (error) {
    console.log({ deleteSchedule_delete: error });
    const errors = handleErrors(error);
    res.status(400).json(errors);
  }
};
