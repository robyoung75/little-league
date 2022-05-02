// import jsonwebtoken
import jwt from "jsonwebtoken";

// define maxAge for token
export const maxAge = 1 * 24 * 60 * 60;

// generate jwt token
// jwt.io to decode your token. Input your secret and paste the token.
export const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};
