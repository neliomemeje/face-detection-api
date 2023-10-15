import React, { useState } from "react";

const Register = ({ loadUser, handlePassword }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const onSubmitRegister = () => {
    fetch("http://localhost:3001/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          loadUser(user);
        } else {
          setErrMsg(user.message);
          setTimeout(() => {
            setErrMsg("");
          }, 4000);
        }
      })
      .catch(console.log);
  };

  return (
    <article className="br2 ba b--white-70 mv4 w-100 w-50-m w-25-l mw6 center">
      <main className="pa4 white">
        <div className="measure">
          <p className="red bg-white">{errMsg}</p>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                autoComplete="off"
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                autoComplete="off"
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email"
                id="email-address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              className="b ph3 mt3 pv2 input-reset ba b--white-70 white bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
              onClick={onSubmitRegister}
            />
          </div>
        </div>
      </main>
    </article>
  );
};

export default Register;
