import React, { useState } from "react";

const Signin = ({
  onRouteChange,
  loadUser,
  openForgotPasswordModal,
  handlePassword,
}) => {
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const onSubmitSignin = () => {
    fetch("http://localhost:3001/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signinEmail,
        password: signinPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          loadUser(user);
          onRouteChange("home");
        } else {
          setErrMsg(user.message);
          setTimeout(() => {
            setErrMsg("");
          }, 4000);
        }
      })
      .catch(console.log());
  };

  return (
    <article className="br2 ba b--white-70 mv4 w-100 w-50-m w-25-l mw6 center">
      <main className="pa4 white">
        <div className="measure">
          <p className="red bg-white">{errMsg}</p>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                autoComplete="off"
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                name="email-address"
                id="email-address"
              />
            </div>
            <div className="mt3 mb0">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="off"
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                name="password"
                id="password"
              />
            </div>
            <div className="flex">
              <input
                type="checkbox"
                className="mr1 pointer"
                onClick={() => handlePassword("password")}
              />
              <p className="ma0">show password</p>
            </div>
          </fieldset>
          <div>
            <input
              className="b ph3 mt3 pv2 input-reset ba  b--white-70 white bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
              onClick={onSubmitSignin}
            />
          </div>
          <div>
            <p className="mb0 pointer" onClick={openForgotPasswordModal}>
              Forgot password?
            </p>
            <p className="mb0">Doesn't have an account yet?</p>
            <p
              className="b--white-70 white underline bg-transparent grow pointer mv2"
              onClick={() => onRouteChange("register")}
            >
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Signin;
