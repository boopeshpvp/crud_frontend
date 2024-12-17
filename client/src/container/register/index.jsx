import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [registerError, setRegisterError] = useState({
    firstnameErr: "",
    lastnameErr: "",
    emailErr: "",
    passwordErr: "",
  });

  const validation = () => {
    let flag = true;

    const firstNameRegex = /^[a-zA-Z]{2,30}$/;
    const lastNameRegex = /^[a-zA-Z]{1,30}$/;
    const emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let Error = { ...registerError };

    Object.keys(registerData).forEach((key) => {
      const registeredValue = registerData[key];

      if (registeredValue.trim() === "") {
        Error[key + "Err"] = "Enter the feild";
        flag = false;
      } else if (
        !firstNameRegex.test(registerData.firstname) &&
        key === "firstname"
      ) {
        Error[key + "Err"] = "Enter valid first name";
        flag = false;
      } else if (
        !lastNameRegex.test(registerData.lastname) &&
        key === "lastname"
      ) {
        Error[key + "Err"] = "Enter valid last name";
        flag = false;
      } else if (!emailRegex.test(registerData.email) && key === "email") {
        Error[key + "Err"] = "Enter valid email";
        flag = false;
      } else if (
        !passwordRegex.test(registerData.password) &&
        key === "password"
      ) {
        Error[key + "Err"] = "Enter valid password";
        flag = false;
      } else {
        Error[key + "Err"] = "";
      }
    });
    setRegisterError(Error);
    return flag;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let result = validation();
    if (result) {
      axios
        .post("http://localhost:4000/auth", registerData, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          setResponse(res.data.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          setResponse(error.response.data.data);
        });
    }
  };
  const handleChange = (e) => {
    return setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div className="center-content height-100">
        <form onSubmit={handleSubmit}>
          <div className="center-content font-size-25 font-weight-600">
            Register Form
          </div>
          <div className="mt-20 ">
            <div className="center-content font-size-18">
              <label>First Name</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="text"
                name="firstname"
                placeholder="Enter first name"
                value={registerData.firstname}
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">
            {registerError.firstnameErr}
          </div>
          <div className="mt-20">
            <div className="center-content font-size-18">
              {" "}
              <label>Last Name</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="text"
                name="lastname"
                placeholder="Enter last name"
                value={registerData.lastname}
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">
            {registerError.lastnameErr}
          </div>
          <div className="mt-20">
            <div className="center-content font-size-18">
              <label>Email Address</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={registerData.email}
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">
            {registerError.emailErr}
          </div>
          <div className="mt-20">
            <div className="center-content font-size-18">
              <label>Password</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={registerData.password}
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">
            {registerError.passwordErr}
          </div>
          <div
            className={`center-content mt-5 font-size-18 ${
              response === "Registration successfull"
                ? "color-green"
                : "color-red"
            }`}
          >
            {response}
          </div>
          <div className="center-content">
            <button
              className="mt-20 button-style font-size-18 pointer"
              type="submit"
            >
              Register
            </button>
          </div>
          <div className="mt-20 font-size-18">
            Already have an account ?{" "}
            <span className="color-blue pointer" onClick={() => navigate("/")}>
              Login
            </span>
          </div>
        </form>
      </div>
    </>
  );
};
export default Register;
