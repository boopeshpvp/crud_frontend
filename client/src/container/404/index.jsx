import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import errorImage from "../../assets/error.jpg";
const PageNotFound = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  return (
    <>
      <div className="height-100 center-content">
        <div>
          <div className="center-content">
            <img src={errorImage} alt="errorImage" />
          </div>
          <div className="center-content">
            <button
              className="button-style pointer font-size-18 mt-20"
              onClick={() => (token ? navigate("/dashboard") : navigate("/"))}
            >
              {token ? "Back to dashboard" : "Back to login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PageNotFound;
