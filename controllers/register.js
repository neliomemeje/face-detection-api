import nodemailer from "nodemailer";
import { user } from "../env.js";

let emailVerificationTime = 0;

const config = {
  service: "gmail",
  auth: {
    user: user.EMAIL,
    pass: user.PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

export const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordFormat =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields must not be empty." });
  }
  if (!mailformat.test(email)) {
    return res.status(400).json({ message: "Invalid email." });
  }
  if (!passwordFormat.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, one uppercase, one digit, and one symbol.",
    });
  }

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        name: name,
        email: email,
        verified: false,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
            verified: false,
          })
          .returning("*")
          .then((user) => {
            sendVerificationEmail(user[0], res);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => {
        res.status(400).json({ message: err.detail });
      });
  });
  removeNotVerifiedUser(db);
};

const removeNotVerifiedUser = (db) => {
  const time = Date.now() + 7200000;
  const x = setInterval(function () {
    const now = Date.now();
    emailVerificationTime = (time - now) / 1000;
    if (emailVerificationTime < 0) {
      clearInterval(x);
      return db("users")
        .where("verified", false)
        .del()
        .then(() => {
          console.log("user deleted");
          return db("login").where("verified", false).del();
        })
        .catch(() => {
          console.log("User was not deleted.");
        });
    }
  }, 1000);
};

const sendVerificationEmail = ({ id, email }, res) => {
  const currentUrl = "https://smart-brain-api-rqbk.onrender.com/";
  const message = {
    from: user.EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Click this link to <a href=${
      currentUrl + "user/verify/" + id
    }>verify<a/> your email.</p>
   <p>This link <b>expires in 2 hours</b></p>`,
  };

  transporter
    .sendMail(message)
    .then(() => {
      res.json({ message: "Check your email to verify your account." });
    })
    .catch(() => {
      res.status(400).json({ message: "Error while sending the email" });
    });
};

export const handleVerificationEmail = (db) => (req, res) => {
  const { id } = req.params;

  if (emailVerificationTime < 0) {
    res.redirect("/user/expiredVerification");
  } else {
    res.redirect("/user/isVerified");
    return db
      .select("*")
      .from("users")
      .where("id", "=", id)
      .update("verified", true)
      .then(() => {
        return db
          .select("*")
          .from("login")
          .where("id", "=", id)
          .update("verified", true);
      })
      .catch(() => {
        res.status(400).json({ message: "Error getting user." });
      });
  }
};

export const handleProfileImage = (db) => (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  let image = "";
  if (req.file) {
    image = `/image/images/${req.file.filename}`;
  }
  reqBody.usersimage = image;
  const userImage = reqBody.usersimage.toString();

  db.select("*")
    .from("users")
    .where("id", "=", id)
    .update("usersimage", userImage)
    .returning("usersimage")
    .then((data) => {
      res.json(data[0].usersimage);
    })
    .catch(() => {
      res.status(400).json("Error updating image.");
    });
};
