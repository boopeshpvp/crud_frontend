import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../../redux/slice";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState({
    emailErr: "",
    passwordErr: "",
  });
  const [responseErr, setResponseErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validation = () => {
    let flag = true;
    const emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let Error = { ...loginError };
    Object.keys(loginData).forEach((key) => {
      let loginValue = loginData[key];
      if (loginValue.trim() === "") {
        Error[key + "Err"] = "Enter the feild";
        flag = false;
      } else if (!emailRegex.test(loginData.email) && key === "email") {
        Error[key + "Err"] = "Enter valid email";
        flag = false;
      } else if (
        !passwordRegex.test(loginData.password) &&
        key === "password"
      ) {
        Error[key + "Err"] = "Enter valid password";
        flag = false;
      } else {
        Error[key + "Err"] = "";
      }
    });
    setLoginError(Error);
    return flag;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let flag = validation();
    if (flag) {
      axios
        .post("http://localhost:4000/auth/login", loginData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setResponseErr(res.data.message);
          setTimeout(() => {
            dispatch(setAccessToken(res.data.data.accessToken));
            dispatch(setRefreshToken(res.data.data.refreshToken));
            navigate("/dashboard");
          }, 2000);
        })
        .catch((error) => { 
          setResponseErr(error.response.data.message);
        });
    }
  };

  const handleChange = (e) => {
    return setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  return (
    <div className="center-content height-100">
      <form onSubmit={handleSubmit}>
        <div className="font-size-25 font-weight-600 center-content">
          Login Form
        </div>
        <div className="mt-20">
          <div className="center-content font-size-18">
            {" "}
            <label>Email Address</label>
          </div>
          <div className="mt-5">
            {" "}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={handleChange}
              className="inputStyle font-size-18"
            />
          </div>
          <div className="center-content color-red">{loginError.emailErr}</div>
        </div>
        <div className="mt-20">
          <div className="center-content font-size-18">
            <label>Password</label>
          </div>
          <div className="mt-5">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              className="inputStyle font-size-18"
            />
          </div>
          <div className="center-content color-red">
            {loginError.passwordErr}
          </div>
        </div>
        <div
          className={`center-content mt-5 font-size-18 ${
            responseErr === "Login Successfull" ? "color-green" : "color-red"
          }`}
        >
          {responseErr}
        </div>
        <div className="mt-20 center-content">
          <button type="submit" className="button-style font-size-18 pointer">
            Login
          </button>
        </div>
        <div className="mt-20 font-size-18">
          Don't have an account ?{" "}
          <span
            className="color-blue pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
};
export default Login;
