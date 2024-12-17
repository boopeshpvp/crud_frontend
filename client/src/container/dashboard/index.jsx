import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setRefreshToken } from "../../redux/slice";
import axios from "axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users,setUsers]=useState([])
  const [message,setMessage]=useState('')
  const tokenData = useSelector((state) => state);

  const handleLogout = () => {
    dispatch(setAccessToken(""));
    dispatch(setRefreshToken(""));
    navigate("/");
  };

  const fetchUser=()=>{
    axios.get('http://localhost:4000/user/getuserlist')
    .then((res)=>{
      console.log(res);
      
     setUsers(res.data.data)
    })
    .catch((error)=>{
      console.log('geterror',error);      
    })
  }

  useEffect(()=>{
      fetchUser()
  },[])

  const handleDelete=(user)=>{
    // for mongodb = user._id 
    //for mysql =user.id
    axios.delete(`http://localhost:4000/user/deleteuser/${user.id}`,{
      headers:{
        accessToken:tokenData.accessToken,
        refreshToken:tokenData.refreshToken
      }
    })
    .then((res)=>{
         setMessage(res.data.message)
        fetchUser()
    })
    .catch((error)=>{
      console.log('error',error);
      
      setMessage(error.response.data.message)   
      setTimeout(() => {
        dispatch(setAccessToken(""));
        dispatch(setRefreshToken(""));
        navigate("/");
      }, 2000);  
    })
  }

  const handleEdit=(user)=>{
    navigate('/edituser',{state:user})
  }

  return (
    <>
      <div className="center-content">
        <h1>Dashboard</h1>
      </div>
      <div className="d-flex justify-around">
      <div className="center-content">
        <button
          className="logout-style pointer font-size-18"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="center-content">
        <button
          className="button-style pointer font-size-18 mt-5"
          onClick={()=>navigate('/adduser')}
        >
          Add User
        </button>
      </div>
     </div>   
     <div className="d-flex p-20 gap-10 flex-wrap">
      {users.map((user)=>{
       return(
        <div className="dashboard-card border-radius-20">
          <div className="font-size-20 font-weight-600 text-align-center">{user.name}</div>
          <div className="font-size-18 mt-5 text-align-center">{user.role}</div>
          <div className="mt-20 d-flex gap-10 justify-center" >
            <button onClick={()=>handleEdit(user)} className="button-style pointer">Edit</button>
            <button onClick={()=>handleDelete(user)} className="logout-style pointer">Delete</button>
            </div>
        </div>
       )
        
      })}
      </div> 
    </>
  );
};
export default Dashboard;
