// import epress server
import express from "express";
// import mongoose for my schemas
import mongoose from "mongoose";
// import cors for cross origin
import Cors from "cors";
// import donenv for my environment file, for passwords and other secure information
import dotenv from "dotenv";
// impor cookiParse to pars data to json format
import cookieParser from "cookie-parser";
// import morgan middleware for logging
import morgan from "morgan";

// import routes
import { authRoute } from "./routes/authRoutes.js";


// configure dotenv file
dotenv.config();

// configure app
const app = express();
const PORT = process.env.PORT || 8001;
const connection_url = process.env.DB_CONNECT;

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(Cors(corsOptions));


// db configuration
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongo db connection
const db_connection = mongoose.connection;

db_connection.once("open", () => {
  console.log("MongoDB connection successfully established");
});

// routes
app.get("/", (req, res) => {
  return res.json({ message: "Hola bienvenidos a mi mundo" });
});

app.use(authRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}, bienvenidos amigo`);
});
