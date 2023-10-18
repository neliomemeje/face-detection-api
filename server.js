const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const signin = require("./controllers/signin");
const register = require("./controllers/register");
const getProfile = require("./controllers/getProfile");
const image = require("./controllers/image");
const forgotPassword = require("./controllers/forgotPassword");
const knex = require("knex")({
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
const upload = require("./fileUpload");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/image", express.static(__dirname + "/storage"));
app.get("/user/verify/:id", register.handleVerificationEmail(knex));
app.get("/user/isVerified", (req, res) => {
  res.sendFile(path.join(__dirname + "/verified.html"));
});
app.get("/user/expiredVerification", (req, res) => {
  res.sendFile(path.join(__dirname + "/expiredVerification.html"));
});
app.post("/signin", signin.handleSignin(knex, bcrypt));
app.post("/register", register.handleRegister(knex, bcrypt));
app.put(
  "/profileimage/:id",
  upload("./storage/images"),
  register.handleProfileImage(knex)
);
app.get("/profile/:id", getProfile.handleGetProfile(knex));
app.put("/profile/:email", getProfile.deleteAccount(knex));
app.put("/editprofile/:email", getProfile.editProfile(knex, bcrypt));
app.put("/forgotpassword", forgotPassword.handleForgotPassword(knex, bcrypt));
app.put("/image", image.handleImage(knex));
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));
app.listen(process.env.PORT || 3000, () => {
  console.log(`port is listening to port ${process.env.PORT}`);
});
