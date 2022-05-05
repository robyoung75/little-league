// import verifyJwtToke from ../controllers/createJWT.js
import { verifyJwtToken } from "../controllers/createJWT.js";

const requiresAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if token exists
  if (token) {
    let auth = verifyJwtToken(token, process.env.TOKEN_SECRET);
    console.log("middleware auth", auth);
    req.userId = auth;
    next();
  } else {
    let error = new Error("unauthorized you must be an authorized user");
    req.error = error;
    next();
  }
};

export { requiresAuth };
