import React from "react";
import { useNavigate } from "react-router-dom";
import api from "./axiosInstance";
import Button from "@mui/material/Button";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/token/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      color="error"
      type="primary"
      size="small"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
