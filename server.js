import express from "express";
import cors from "cors";
import path from "path";
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

knex({
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
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/image", express.static(__dirname + "/storage"));
app.get("/user/verify/:id", handleVerificationEmail(knex));
app.get("/user/isVerified", (req, res) => {
  res.sendFile(path.join(__dirname + "/verified.html"));
});
app.get("/user/expiredVerification", (req, res) => {
  res.sendFile(path.join(__dirname + "/expiredVerification.html"));
});
app.post("/signin", handleSignin(knex, bcrypt));
app.post("/register", handleRegister(knex, bcrypt));
app.put(
  "/profileimage/:id",
  upload("./storage/images"),
  handleProfileImage(knex)
);
app.get("/profile/:id", handleGetProfile(knex));
app.put("/profile/:email", deleteAccount(knex));
app.put("/editprofile/:email", editProfile(knex, bcrypt));
app.put("/forgotpassword", handleForgotPassword(knex, bcrypt));
app.put("/image", handleImage(knex));
app.post("/imageurl", (req, res) => handleApiCall(req, res));
app.listen(process.env.PORT || 3000, () => {
  console.log(`port is listening to port ${process.env.PORT}`);
});
