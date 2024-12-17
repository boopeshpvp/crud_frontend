const dbConnection = require("../config/dbConfig");
const jwt = require("jsonwebtoken");

module.exports = {
  registerDetails: async (req, res) => {
    const data = req.body;

    const sql = "INSERT INTO registereddata VALUES (?,?,?,?)";
    const values = [data.firstname, data.lastname, data.email, data.password];

    dbConnection.query(sql, values, (err) => {
      if (err) {
        console.log("err", err);
        return res.status(400).send({
          status: "Fail",
          data: {},
          message: err.message,
        });
      } else {
        return res.status(200).send({
          status: "Success",
          message: "User Registered Successfully",
        });
      }
    });
  },

  loginDetails: (req, res) => {
    const data = req.body;
    const user =
      "SELECT * FROM registereddata WHERE email = ? AND password = ?";
    const values = [data.email, data.password];
    dbConnection.query(user, values, (err, data) => {
      if (err) {
        return res.status(400).send({
          status: "Fail",
          message: err.message,
          data: null,
        });
      } else {
        if (data.length === 0) {
          return res.status(400).send({
            status: "Fail",
            data: {},
            message: "Login Credentials is wrong",
          });
        } else {
          const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
          });
          const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN, {
            expiresIn: "3h",
          });

          return res.status(200).send({
            status: "Success",
            data: { accessToken, refreshToken },
            message: "Login Successfull",
          });
        }
      }
    });
  },
};
