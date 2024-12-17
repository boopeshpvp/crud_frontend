const user = require("../models/authSchema");
const jwt = require("jsonwebtoken");

module.exports = {
  registerDetails: async (req, res) => {
    try {
      const emailCheck = await user.findOne({ email: req.body.email });
      if (emailCheck) {
        throw "Email is already registered";
      }
      const users = await new user(req.body);

      return res.status(200).send({
        status: "Success",
        message: "Registration successfull",
        data: users.save(),
      });
    } catch (error) {
      return res.status(400).send({
        status: "Fail",
        message: error.message,
        data: error,
      });
    }
  },
  loginDetails: async (req, res) => {
    try {
      const users = await user.find({
        email: req.body.email,
        password: req.body.password,
      });
      
      const userData = req.body;
      if (users.length) {
        const accessToken = jwt.sign({ userData }, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ userData }, process.env.REFRESH_TOKEN, {
          expiresIn: "3h",
        });
  

      //   await user.updateOne(
      //   {email:req.body.email},
      //   {$set:{"accessToken":accessToken,"refreshToken":refreshToken}}, 
      // )

        res.status(200).send({
          status: "Success",
          message: "Login Successfull",
          data:{accessToken,refreshToken}
        });

      } else {
        res.status(400).send({
          status: "Fail",
          message: "Login credential is wrong",
          data: {},
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(400).send({
        status: "Fail",
        message: error.message,
        data: null,
      });
    }
  },
};
