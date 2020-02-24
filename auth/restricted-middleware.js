const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

module.exports = (req, res, next) => {
  let { username, password } = req.headers;
  console.log("headers:\n", req.headers);
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        console.log("user:\n", user);
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "invalid credentials" });
        }
      })
      .catch(({ name, message, stack }) => {
        res.status(500).json({ name, message, stack });
      });
  } else {
    res.status(400).json({ message: "please provide credentials" });
  }
};
