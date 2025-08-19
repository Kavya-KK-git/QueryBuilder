import { useState } from "react";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function Homepage() {
  const [alignment, setAlignment] = useState("login");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 pt-15">
        <div className="flex justify-center mb-4">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleChange}
            color="primary"
          >
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="signup">Sign Up</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {alignment === "login" && <Login />}
        {alignment === "signup" && <Signup />}
      </div>
    </div>
  );
}

export default Homepage;
