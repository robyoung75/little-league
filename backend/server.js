import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// import routes
import { authRoute } from "./routes/authRoutes.js";

dotenv.config();

// configure app
const app = express();
const PORT = process.env.PORT || 8001;
const connection_url = process.env.DB_CONNECT;

// middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

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
