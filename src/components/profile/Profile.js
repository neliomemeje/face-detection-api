import React, { useState } from "react";

const Profile = ({
  id,
  name,
  email,
  entries,
  joined,
  image,
  closeModal,
  openEditModal,
  isModalOpen,
  updateUser,
}) => {
  const [editImage, setEditImage] = useState(false);
  const [fileMsg, setFileMsg] = useState("");

  const timeOut = () => {
    setTimeout(() => {
      setFileMsg("");
    }, 4000);
  };
  const handleSubmit = () => {
    const fileInput = document.getElementById("userImage");
    if (!fileInput.value) return;
    if (fileInput.files[0].size > 2000000) {
      setFileMsg("File too large");
      timeOut();
    }
    if (
      fileInput.files[0].type === "image/png" ||
      fileInput.files[0].type === "image/jpg" ||
      fileInput.files[0].type === "image/jpeg"
    ) {
      const formData = new FormData();
      formData.append("userImage", fileInput.files[0]);
      fetch(`http://localhost:3001/profileimage/${id}`, {
        method: "put",
        body: formData,
      })
        .then((response) => response.json())
        .then((userimage) => {
          updateUser(userimage);
          setEditImage(false);
        })
        .catch((err) => console.log(err));
    } else {
      setFileMsg("Only .jpg, .jpeg, .png file formats are allowed.");
      timeOut();
    }
  };

  if (isModalOpen) {
    return (
      <div className="profile">
        <section className="content profile-content pv4">
          <button
            className="close pointer"
            onClick={() => {
              closeModal();
              setEditImage(false);
            }}
          >
            &times;
          </button>
          <div className="grid mt3">
            <div className="edit-profile-image">
              <button
                onClick={() => setEditImage(!editImage)}
                className="edit-profile pointer white mb3"
              >
                {editImage ? "Cancel" : "Change Photo"}
              </button>
              <img
                src={
                  image
                    ? `http://localhost:3001${image}`
                    : "https://miro.medium.com/v2/resize:fill:32:32/1*dmbNkD5D-u45r44go_cf0g.png"
                }
                alt=""
                width="150"
                height="150"
                loading="lazy"
                className="pa1 br-100 bg-moon-gray br-100 shadow-5"
              />
            </div>
            <div className="tl">
              <button
                onClick={() => {
                  openEditModal();
                  closeModal();
                }}
                className="edit-profile pointer white"
              >
                Edit Info
              </button>
              <h4 className="mt2">Name: {name}</h4>
              <h4>Email: {email}</h4>
              <h4>Entries: {entries}</h4>
              <h4>Joined: {joined}</h4>
            </div>
          </div>
          {editImage && (
            <>
              <p className="tl ml5 red">{fileMsg}</p>
              <div className="ml5">
                <input
                  id="userImage"
                  type="file"
                  className="mb1"
                  name="userImage"
                />
                <input
                  type="submit"
                  className="edit-profile pointer white"
                  value="Submit"
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
        </section>
      </div>
    );
  }
};

export default Profile;
