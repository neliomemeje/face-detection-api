import React from "react";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center">
      <div className="relative mt2 mb5">
        <img
          id="inputImage"
          src={imageUrl}
          alt=""
          width="500px"
          height="auto"
        />
        {box.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div
                className="bounding-box"
                style={{
                  top: item.topRow,
                  right: item.rightCol,
                  bottom: item.bottomRow,
                  left: item.leftCol,
                  color: "red",
                }}
              >
                <small className="count">Person {item.count}</small>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
