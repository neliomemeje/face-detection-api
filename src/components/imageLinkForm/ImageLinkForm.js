import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({
  handleChange,
  handleImageUrl,
  isSignin,
  onRouteChange,
}) => {
  const checkSignIn = () => {
    if (isSignin) {
      handleImageUrl();
    } else {
      onRouteChange("signin");
    }
  };
  return (
    <div>
      <h2>This magic brain will detect faces. Enter image via URL.</h2>
      <div className="center shadow-5 pa3 br3 form">
        <input type="text" className="f3 pa2 w-70" onChange={handleChange} />
        <button
          onClick={checkSignIn}
          className="f3 grow link white bg-light-purple w-30"
        >
          Detect
        </button>
      </div>
    </div>
  );
};

export default ImageLinkForm;
