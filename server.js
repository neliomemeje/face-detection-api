import express from "express";
import cors from "cors";
import bcrypt from "bcrypt-nodejs";
import {
  handleRegister,
  handleVerificationEmail,
  handleProfileImage,
} from "./controllers/register.js";
import { handleSignin } from "./controllers/signin.js";
import {
  handleGetProfile,
  deleteAccount,
  editProfile,
} from "./controllers/getProfile.js";
import { handleApiCall, handleImage } from "./controllers/image.js";
import { handleForgotPassword } from "./controllers/forgotPassword.js";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});
import { upload } from "./fileUpload.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/image", express.static(__dirname + "/storage"));
app.get("/user/verify/:id/:token", handleVerificationEmail(db));
app.get("/user/isVerified", (req, res) => {
  res.sendFile(path.join(__dirname + "/verified.html"));
});
app.get("/user/expiredVerification", (req, res) => {
  res.sendFile(path.join(__dirname + "/expiredVerification.html"));
});
app.post("/signin", handleSignin(db, bcrypt));
app.post("/register", handleRegister(db, bcrypt));
app.put(
  "/profileimage/:id",
  upload("./storage/images"),
  handleProfileImage(db)
);
app.get("/profile/:id", handleGetProfile(db));
app.put("/profile/:email", deleteAccount(db));
app.put("/editprofile/:email", editProfile(db, bcrypt));
app.put("/forgotpassword", handleForgotPassword(db, bcrypt));
app.put("/image", handleImage(db));
app.post("/imageurl", (req, res) => handleApiCall(req, res));
app.listen(process.env.PORT || 3000, () => {
  console.log(`port is listening to port ${process.env.PORT}`);
});
