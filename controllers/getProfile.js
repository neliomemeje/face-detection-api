export const handleGetProfile = (db) => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => {
      res.status(400).json("error getting user");
    });
};

export const deleteAccount = (db) => (req, res) => {
  const { email } = req.params;
  db.select("*")
    .from("users")
    .where("email", "=", email)
    .del()
    .then(() => {
      return db
        .select("*")
        .from("login")
        .where("email", "=", email)
        .del()
        .then(() => {
          res.json({ message: "Account deleted" });
        });
    })
    .catch(() => {
      res.status(400).json("error getting user");
    });
};

export const editProfile = (db, bcrypt) => (req, res) => {
  const { name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  const passwordFormat =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
  if (!name || !password) {
    return res.status(400).json({ message: "All fields must not be empty." });
  }

  if (!passwordFormat.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, one uppercase, one digit, and one symbol.",
    });
  }
  db.select("*")
    .from("users")
    .where("email", "=", req.params.email)
    .update({
      name: name,
    })
    .then(() => {
      return db
        .select("*")
        .from("login")
        .where("email", "=", req.params.email)
        .update({
          name: name,
          hash: hash,
        })
        .then(() => {
          res.json({ message: "Successfully updated." });
        })
        .catch(() => {
          res.status(400).json("Cannot update user.");
        });
    })
    .catch(() => {
      res.status(400).json("Error updating.");
    });
};
