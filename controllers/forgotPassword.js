const handleForgotPassword = (knex, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  const passwordFormat =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields must not be empty." });
  }
  if (!passwordFormat.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, one uppercase, one digit, and one symbol.",
    });
  }
  const hash = bcrypt.hashSync(password);
  knex("users")
    .select("*")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isVerified = data[0].verified;
      if (!isVerified) {
        res.status(400).json({
          message: "Email hasn't been verified. Check your email to continue.",
        });
      } else {
        return knex
          .select("*")
          .from("login")
          .where("email", "=", email)
          .update("hash", hash)
          .then(() => {
            return knex
              .select("*")
              .from("users")
              .where("email", "=", email)
              .then((user) => {
                res.json(user[0]);
              })
              .catch(() => {
                res.status(400).json({ message: "Unable to get user." });
              });
          });
      }
    })
    .catch(() => {
      res.status(400).json({ message: "User doesn't exist." });
    });
};

module.exports = {
  handleForgotPassword,
};
