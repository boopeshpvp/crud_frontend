// import React, { useEffect, useState } from "react";
// import QRCode from "qrcode";
// import axios from "axios";
// const Userlist = () => {
//   const [qrcode, setQrcode] = useState(null);
//   const [list, setList] = useState(null);
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/user/getuserlist")
//       .then((res) => {
//         setList(res.data.data);
//       })
//       .catch((error) => {
//         console.log("error", error);
//       });
//   }, []);
//   console.log("list", JSON.stringify(list));
//   const generateQR = async () => {
//     try {
//       const result = await QRCode.toString(JSON.stringify(list));
//       console.log("result", result);
//         setQrcode(result);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   return (
//     <>
//       <button
//         onClick={() => {
//           generateQR();
//         }}
//       >
//         qr code
//       </button>

//       {qrcode}

//     </>
//   );
// };
// export default Userlist;

import axios from "axios";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setAccessToken, setRefreshToken } from "../../redux/slice";

const Adduser = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addUser, setAddUser] = useState({
    name: location.state?.name ? location.state?.name : "",
    role: location.state?.role ? location.state?.role : "",
  });
  const [addUserErr, setAddUserErr] = useState({ nameErr: "", roleErr: "" });
  const [responseErr, setResponseErr] = useState("");

  const tokenData = useSelector((state) => state);

  const validation = () => {
    let flag = true;
    const nameRegex = /^[a-zA-Z]{2,30}$/;
    const roleRegex = /^[a-zA-Z]{2,30}$/;
    let Error = { ...addUserErr };
    Object.keys(addUser).forEach((key) => {
      const inputFieldValue = addUser[key];

      if (inputFieldValue.trim() === "") {
        Error[key + "Err"] = "Enter the feild";
        flag = false;
      } else if (!nameRegex.test(inputFieldValue) && key === "name") {
        Error[key + "Err"] = "Enter the valid name";
        flag = false;
      } else if (!roleRegex.test(inputFieldValue) && key === "role") {
        Error[key + "Err"] = "Enter the valid role";
        flag = false;
      } else {
        Error[key + "Err"] = "";
      }
    });
    setAddUserErr(Error);
    return flag;
  };

  const handleChange = (e) => {
    setAddUser({ ...addUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const flag = validation();
    if (flag) {
      if(location.pathname==='/adduser'){
        console.log('7777');
        
      axios
        .post("http://localhost:4000/user/addUser", addUser, {
          headers: {
            Authorization: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
          },
        })
        .then((res) => {
          setResponseErr(res.data.message);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        })
        .catch((error) => {
          setResponseErr(error.response.data.message);
          setTimeout(() => {
            dispatch(setAccessToken(""));
            dispatch(setRefreshToken(""));
            navigate("/");
          }, 2000);
        });
    }
    else{
      // for mongodb = location.state._id 
      // for sql db  = location.state.id
      axios.patch(`http://localhost:4000/user/edituser/${location.state.id}`,addUser,{
        headers:{
          Authorization:tokenData.accessToken,
          refreshToken:tokenData.refreshToken
        }
      })
      .then((res)=>{
       setResponseErr(res.data.message)
       setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      })
      .catch((error)=>{
        setResponseErr(error.response.data.message);
        setTimeout(() => {
          dispatch(setAccessToken(""));
          dispatch(setRefreshToken(""));
          navigate("/");
        }, 2000);
      })
    }
  }
  };

  return (
    <>
      <button
        className="button-style pointer font-size-18 mt-5"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>
      <div className="center-content mt-20">
        <form onSubmit={handleSubmit}>
          <div className="center-content font-size-25 font-weight-600">
            {location.pathname === "/adduser"
              ? "Add User Form"
              : "Edit User Form"}
          </div>
          <div className="mt-20 ">
            <div className="center-content font-size-18">
              <label>Name</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="text"
                name="name"
                placeholder="Enter the name"
                defaultValue={
                  location.pathname === "/adduser"
                    ? addUser.name
                    : location.state.name
                }
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">{addUserErr.nameErr}</div>
          <div className="mt-20">
            <div className="center-content font-size-18">
              <label>Role</label>
            </div>
            <div className="center-content mt-5">
              <input
                type="text"
                name="role"
                placeholder="Enter the role"
                defaultValue={
                  location.pathname === "/adduser"
                    ? addUser.role
                    : location.state.role
                }
                onChange={handleChange}
                className="inputStyle font-size-18"
              />
            </div>
          </div>
          <div className="center-content color-red">{addUserErr.roleErr}</div>
          <div
            className={`center-content ${
              responseErr === "User session expired"
                ? "color-red"
                : "color-green"
            } mt-5`}
          >
            {responseErr}
          </div>
          <div className="center-content">
            <button
              className="mt-20 button-style font-size-18 pointer"
              type="submit"
            >
             {location.pathname==='/adduser'? 'Add User':'Edit User'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Adduser;
