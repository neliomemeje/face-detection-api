import React from "react";
import Tilt from "react-parallax-tilt";
import logo from "./logo.png";

const Logo = () => {
  return (
    <div className="ma4 mt2 center">
      <Tilt>
        <div
          style={{
            height: 150,
            width: 150,
            backgroundColor: "white",
            borderRadius: "3px",
          }}
        >
          <img style={{ paddingTop: "8px" }} src={logo} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
