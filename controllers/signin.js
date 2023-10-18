export const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields must not be empty." });
  }
  db("users")
    .select("*")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isVerified = data[0].verified;
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid && isVerified) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch(() => {
            res.status(400).json({ message: "unable to get user." });
          });
      } else {
        res.status(400).json({ message: "Wrong email or password." });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "User doesn't exist." });
    });
};
