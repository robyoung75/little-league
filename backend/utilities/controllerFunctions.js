
// find auth user by id
export const findUserById = async (mongooseSchema, id) => {
  try {
    return await mongooseSchema.findById(id);
  } catch (error) {
    console.log({ findUserById: error });
    return error;
  }
};
