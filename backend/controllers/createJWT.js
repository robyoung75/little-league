// import jsonwebtoken
import jwt from "jsonwebtoken";

// define maxAge for token
export const maxAge = 1 * 24 * 60 * 60;

// generate jwt token
// jwt.io to decode your token. Input your secret and paste the token.
export const createJwtToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

// verify if jwt token exists
export const verifyJwtToken = (token, secret) => {
  return jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      return { message: err.message };
    } else {
      let decoded = decodedToken;
      console.log("decoded from verifyJwtToken", decoded);
      return decoded;
    }
  });
};
