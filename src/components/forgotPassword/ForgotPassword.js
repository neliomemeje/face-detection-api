import React, { useState } from "react";
import showPassword from "../../images/show.png";
import hidePassword from "../../images/hide.png";

const ForgotPassword = ({
  closeForgotPasswordModal,
  forgotPasswordModal,
  onRouteChange,
  loadUser,
  handlePassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleForgotPassword = () => {
    fetch("http://localhost:3001/forgotpassword", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          loadUser(user);
          onRouteChange("signin");
          closeForgotPasswordModal();
          setEmail("");
          setPassword("");
        } else {
          setMessage(user.message);
          setTimeout(() => {
            setMessage("");
          }, 4000);
        }
      })
      .catch(console.log());
  };

  return (
    forgotPasswordModal && (
      <div className="profile">
        <section className="content edit-profile-content">
          <button
            className="close pointer"
            onClick={() => {
              closeForgotPasswordModal();
              setEmail("");
              setPassword("");
              setShow(null);
            }}
          >
            &times;
          </button>
          <p className="red">{message}</p>
          <label className="title mb1" htmlFor="email">
            Enter your email:
          </label>
          <input
            autoComplete="off"
            className="info pa2 w-70 outline-0 br2 email"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="title mb1" htmlFor="password">
            Enter your new password:
          </label>
          <div className="forgot-password-input pa2 br2">
            <input
              autoComplete="off"
              className="w-90 pv1 outline-0 bg-transparent forgot-password"
              type="password"
              name="password"
              id="forgot-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password.length > 0 ? (
              <img
                src={show ? showPassword : hidePassword}
                onClick={() => {
                  handlePassword("forgot-password");
                  setShow(!show);
                }}
                alt="icon"
                width="20px"
                height="20px"
                className="pointer"
              />
            ) : null}
          </div>
          <button className="editBtn" onClick={handleForgotPassword}>
            Submit
          </button>
        </section>
      </div>
    )
  );
};

export default ForgotPassword;
