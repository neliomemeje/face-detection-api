import React from "react";

const Navigation = ({
  isSignin,
  onRouteChange,
  id,
  email,
  image,
  loadUser,
  openModal,
}) => {
  const handleProfile = () => {
    fetch(`http://localhost:3001/profile/${id}`, {
      method: "get",
    })
      .then((response) => response.json())
      .then((user) => {
        if (user) {
          loadUser(user);
          openModal();
        }
      });
  };

  const deleteAccount = () => {
    const message = "Are you sure you want to delete your account?";
    if (window.confirm(message)) {
      fetch(`http://localhost:3001/profile/${email}`, {
        method: "put",
      })
        .then((response) => response.json())
        .then(() => {
          onRouteChange("signout");
        });
    }
  };

  return isSignin ? (
    <nav className="flex justify-end items-center">
      <div className="dropdown pa3 ma2">
        <button className="dropbtn pointer">
          <img
            alt=""
            src={
              image
                ? `http://localhost:3001${image}`
                : "https://miro.medium.com/v2/resize:fill:32:32/1*dmbNkD5D-u45r44go_cf0g.png"
            }
            width="60"
            height="60"
            className="pa1 br-100 bg-blue br-100"
          />
        </button>
        <div className="dropdown-content">
          <p onClick={handleProfile}>Edit Profile</p>
          <p onClick={deleteAccount}>Delete Account</p>
          <p onClick={() => onRouteChange("signout")}>Sign Out</p>
        </div>
      </div>
    </nav>
  ) : (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <p
        className="f3 dim pa2 pointer underline"
        onClick={() => onRouteChange("signin")}
      >
        Sign In
      </p>
      <p
        className="f3 dim pa2 pointer underline"
        onClick={() => onRouteChange("register")}
      >
        Register
      </p>
    </nav>
  );
};

export default Navigation;
