import React from "react";
import "./FaceRecognition.css";
const FaceRecognition = ({ imageUrl, box }) => {
    console.log("12", box);
  if (imageUrl) {
    return (
      <div className="center ma pa3">
        <div className="absolute mt2 ma4 grow">
          <img
            id="input-image"
            src={imageUrl}
            alt="Face"
            width="500px"
            height="auto"
          />
          <div
            className="bounding-box"
            style={{
              top: box.topRow,
              left: box.leftCol,
              right: box.rightCol,
              bottom: box.bottomRow,
            }}
          ></div>
        </div>
      </div>
    );
  }
  return (
    <h2 className="white">Please provide URL of an image and click submit</h2>
  );
};
export default FaceRecognition;
