import AdminSchema from "../models/adminUser.js";

const adminUser_post = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const newAdmin = await AdminSchema.create({
      firstName,
      lastName,
      email,
      password,
    });
    res
      .status(200)
      .json({
        adminFirstName: newAdmin.firstName,
        adminLastName: newAdmin.lastName,
        adminEmail: newAdmin.email,
        adminPassword: newAdmin.password,
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export {adminUser_post}
