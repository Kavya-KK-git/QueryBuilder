import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => setShow((prev) => !prev);

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      toast.error("Please fill all the fields");
      return;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/user",
        { name, email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Signup successful");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to register user");
      console.log(error);
    }
  };

  return (
    <div className="px-6 pb-6 pt-3 rounded-xl bg-white  w-full max-w-md mx-auto space-y-5">
      <div className="m-5">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="m-5">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="m-5">
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type={show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClick}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="m-5">
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type={show ? "text" : "password"}
          onChange={(e) => setConfirmpassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClick}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="m-5">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitHandler}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Signup;
