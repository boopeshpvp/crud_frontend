const dbConnection = require("../config/dbConfig");
const jwt = require("jsonwebtoken");

module.exports = {
  addUser: (req, res, next) => {
    const accessToken = req.headers["authorization"];
    const refreshToken = req.headers["refreshtoken"];

    if (!accessToken && !refreshToken) {
      return res.status(401).send({
        status: "fail",
        message: "Access denied, no token provided",
        data: {},
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded;
      // Step 1: Create the table if it doesn't exist
      const createTable = `
            CREATE TABLE IF NOT EXISTS userlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL
            )
        `;

      dbConnection.query(createTable, (err) => {
        if (err) {
          console.error("Error creating table:", err);
          return res.status(500).send({
            status: "Fail",
            message: err.message,
            data: {},
          });
        }

        // Step 2: Insert data into the table
        const insertData = "INSERT INTO userlist (name, role) VALUES (?, ?)";
        const values = [req.body.name, req.body.role];

        dbConnection.query(insertData, values, (err, result) => {
          if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).send({
              status: "Fail",
              message: err.message,
              data: {},
            });
          }
          return res.status(201).send({
            message: "User added successfully",
            status: "Success",
            data: result,
          });
        });
      });
    } catch (error) {
      if (!refreshToken) {
        return res.status(401).send({
          status: "Fail",
          message: "Access denied, no refresh Token provided",
          data: {},
        });
      }

      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const accessToken = jwt.sign(
          { user: decoded.user },
          process.env.ACCESS_TOKEN,
          { expiresIn: "1h" }
        );
        const createTable = `
        CREATE TABLE IF NOT EXISTS userlist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL
        )
    `;

        dbConnection.query(createTable, (err) => {
          if (err) {
            console.error("Error creating table:", err);
            return res.status(500).send({
              status: "Fail",
              message: err.message,
              data: {},
            });
          }

          // Step 2: Insert data into the table
          const insertData = "INSERT INTO userlist (name, role) VALUES (?, ?)";
          const values = [req.body.name, req.body.role];

          dbConnection.query(insertData, values, (err, result) => {
            if (err) {
              console.error("Error inserting data:", err);
              return res.status(500).send({
                status: "Fail",
                message: err.message,
                data: {},
              });
            }

            console.log("Data inserted successfully:", result);
            return res.status(201).send({
              message: "User added successfully",
              status: "Success",
              data: accessToken,
            });
          });
        });
      } catch {
        return res.status(400).send({
          status: "Fail",
          message: "User session expired",
          data: {},
        });
      }
    }
  },

  getUser: (req, res) => {
    try {
      const getuser = "SELECT * from userlist";

      dbConnection.query(getuser, (err, data) => {
        if (err) {
          return res.status(400).send({
            message: err.message,
            data: {},
          });
        } else {
          return res.status(200).send({
            data: data,
            message: "Recieved data successfully",
          });
        }
      });
    } catch (error) {
      return res.status(400).send({
        data: {},
        status: "Fail",
        message: error.message,
      });
    }
  },

  editUser: (req, res) => {
    const accessToken = req.headers["authorization"];
    const refreshToken = req.headers["refreshtoken"];

    if (!accessToken && !refreshToken) {
      return res.status(400).send({
        data: {},
        message: "Access denied,no token provided",
        status: "Fail",
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded;
      const id = req.params.id;
      const edituser = "UPDATE userlist SET name=?, role=? where id=?";
      const values = [req.body.name, req.body.role, id];

      dbConnection.query(edituser, values, (err, data) => {
        if (err) {
          return res.status(400).send({
            message: err.message,
            data: {},
          });
        } else {
          return res.status(200).send({
            data: data,
            message: "User Edited Successfully",
          });
        }
      });
    } catch {
      if (!refreshToken) {
        return res.status(401).send({
          data: {},
          status: "Fail",
          message: "Access denied, no refreshtoken provided",
        });
      }

      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const accessToken = jwt.sign(
          { user: decoded.user },
          process.env.ACCESS_TOKEN,
          { expiresIn: "1h" }
        );
        const id = req.params.id;
        const edituser = "UPDATE userlist SET name=?, role=? where id=?";
        const values = [req.body.name, req.body.role, id];

        dbConnection.query(edituser, values, (err, data) => {
          if (err) {
            return res.status(400).send({
              message: err.message,
              data: {},
            });
          } else {
            return res.status(200).send({
              data: data,
              message: "User Edited Successfully",
              accessToken: accessToken,
            });
          }
        });
      } catch (error) {
        return res.status(400).send({
          data: {},
          status: "Fail",
          message: "User session expired",
        });
      }
    }
  },

  deleteuser: (req, res) => {
    const accessToken = req.headers["accesstoken"];
    const refreshToken = req.headers["refreshtoken"];

    if (!accessToken && !refreshToken) {
      return res.status(401).send({
        status: "Fail",
        message: "Access denied, no token provided",
        data: {},
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded;
      const deleteData = "DELETE FROM userlist WHERE id=?";
      const values = [req.params.id];
      dbConnection.query(deleteData, values, (err, data) => {
        if (err) {
          return res.status(400).send({
            data: {},
            status: "Fail",
            message: err.message,
          });
        } else {
          return res.status(200).send({
            status: "Success",
            message: "User deleted successfully",
            data: data,
          });
        }
      });
    } catch (error) {
      if (!refreshToken) {
        return res.status(401).send({
          data: {},
          message: "Access denied, no refreshtoken provided",
          status: "Fail",
        });
      }
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        req.user = decoded;
        const accessToken = jwt.sign(
          { user: decoded.user },
          process.env.ACCESS_TOKEN,
          { expiresIn: "1h" }
        );
        const deleteData = "DELETE FROM userlist WHERE id=?";
        const values = [req.params.id];
        dbConnection.query(deleteData, values, (err, data) => {
          if (err) {
            return res.status(400).send({
              data: {},
              status: "Fail",
              message: err.message,
            });
          } else {
            return res.status(200).send({
              status: "Success",
              message: "User deleted successfully",
              data: data,
              accessToken: accessToken,
            });
          }
        });
      } catch (error) {
        return res.status(400).send({
          data: {},
          message: "User session expired",
          status: "Fail",
        });
      }
    }
  },
};
