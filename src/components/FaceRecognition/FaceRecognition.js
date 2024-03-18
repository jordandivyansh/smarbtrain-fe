import React from "react";
import "./FaceRecognition.css";
const FaceRecognition = ({ imageUrl, box, numberOfFaces, error }) => {
  console.log(numberOfFaces, "faces");
  console.log("err", error);
  if (error) {
    return (
      <div className="center ma pa3">
        <div className="absolute mt2 ma4 grow">
          <h2>Error, Please check the URL of Image</h2>
        </div>
      </div>
    );
  }
  if (imageUrl) {
    console.log("passed box", box);
    const coordinates = box.coordinates;
    console.log(Array.isArray(coordinates), "check");
    if (Array.isArray(coordinates)) console.log(coordinates.length, "faces");
    if (Array.isArray(coordinates)) {
      return (
        <div>
          <div className="center ma pa3">
            <div className="absolute mt2 ma4 grow">
              <img
                id="input-image"
                src={imageUrl}
                alt="Face"
                width="500px"
                height="auto"
              />
              {/* {coordinates.map((coordinate, index) => (
            <div
              key={index}
              className="bounding-box"
              style={{
                left: coordinate[0],
                right: coordinate[1],
                top: coordinate[2],
                bottom: coordinate[3],
              }}>
                {index + 1}
              </div>
          ))} */}
          <h3 className="white">
                Number of Faces in current image: {coordinates.length}
              </h3>
              <div
                className="bounding-box"
                style={{
                  left: coordinates[0][0],
                  right: coordinates[0][1],
                  top: coordinates[0][2],
                  bottom: coordinates[0][3],
                }}
              />
            </div>
          </div>
        </div>
      );
    } else {
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
          </div>
        </div>
      );
    }
  }
  return (
    <h2 className="white">Please provide URL of an image and click submit</h2>
  );
};
export default FaceRecognition;
