import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow((prev) => !prev);

  const submitHandler = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      sessionStorage.setItem("accessToken", data.accessToken);

      const userInfo = {
        ...data,
        token: data.accessToken,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      toast.success("Login is successful");

      navigate("/products");
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed", error);
    }
  };

  return (
    <div className="p-6 pt-3 rounded-xl bg-white w-full max-w-md mx-auto mt-5 space-y-5">
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitHandler}
        >
          Login
        </Button>
      </div>

      <div className="m-5 ">
        <GoogleLogin
          width="310"
          onSuccess={async (credentialResponse) => {
            try {
              console.log(credentialResponse);
              const credential = credentialResponse.credential;

              const { data } = await axiosInstance.post("user/auth/google", {
                credential,
              });

              sessionStorage.setItem("accessToken", data.accessToken);

              const userInfo = {
                ...data,
                token: data.accessToken,
              };
              localStorage.setItem("userInfo", JSON.stringify(userInfo));

              toast.success("Google login is successful");

              navigate("/products");
            } catch (error) {
              console.error("Google login failed:", error);
            }
          }}
          onError={() => {
            toast.error("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default Login;
