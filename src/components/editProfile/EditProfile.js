import React, { useState } from "react";
import showPassword from "../../images/show.png";
import hidePassword from "../../images/hide.png";

const EditProfile = ({ editModal, closeEditModal, email, handlePassword }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditProfile = () => {
    fetch(`http://localhost:3001/editprofile/${email}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formValues.name,
        password: formValues.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== "Successfully updated.") {
          setMessage(data.message);
          setTimeout(() => {
            setMessage("");
          }, 4000);
        } else {
          closeEditModal();
          setFormValues({ name: "", password: "" });
        }
      })
      .catch(console.log());
  };

  return (
    editModal && (
      <div className="profile">
        <section className="content edit-profile-content">
          <button
            className="close pointer"
            onClick={() => {
              closeEditModal();
              setFormValues({ name: "", password: "" });
              setShow(null);
            }}
          >
            &times;
          </button>
          <p className="red">{message}</p>
          <fieldset className="mv4 pv4 b--blue">
            <legend>Enter your new info</legend>
            <label className="title" htmlFor="name">
              Name:{" "}
            </label>
            <input
              autoComplete="off"
              className="info pa2 w-70 outline-0 br2 email"
              type="text"
              name="name"
              id="name"
              value={formValues.name}
              onChange={handleChange}
            />
            <label className="title" htmlFor="password">
              Password:{" "}
            </label>
            <div className="forgot-password-input pa2 br2">
              <input
                autoComplete="off"
                className="w-90 pv1 outline-0 bg-transparent forgot-password"
                type="password"
                name="password"
                id="edit-password"
                value={formValues.password}
                onChange={handleChange}
              />
              {formValues.password.length > 0 ? (
                <img
                  src={show ? showPassword : hidePassword}
                  onClick={() => {
                    handlePassword("edit-password");
                    setShow(!show);
                  }}
                  alt="icon"
                  width="20px"
                  height="20px"
                  className="pointer"
                />
              ) : null}
            </div>

            <button className="editBtn" onClick={handleEditProfile}>
              Submit
            </button>
          </fieldset>
        </section>
      </div>
    )
  );
};

export default EditProfile;
