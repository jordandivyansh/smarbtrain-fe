import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const PAT = "fa82bf3b5c5b433995e2183ff69ee2e2";
const USER_ID = "jordandivyansh";
const APP_ID = "smartbrain";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
function App() {
  const [input, setInput] = useState();
  const [box, setBox] = useState([]);
  const [error, setError] = useState(false);
  const [numberOfFaces, setNumberFaces] = useState(0);
  const calculateFaceLocation = (data) => {
    if(error)
    return;
    const faces = data.outputs[0].data.regions.length;
    setNumberFaces(faces);
    const ClarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    const coordinates = [];
    console.log("w ", width, "h ", height)
    console.log(ClarifaiFaces,"api data");
    for (let i = 0; i < faces; i++) {
      const leftCol =
        ClarifaiFaces[i].region_info.bounding_box.left_col * width;
      const rightCol =
        width - ClarifaiFaces[i].region_info.bounding_box.right_col * width;
      const topRow =
        ClarifaiFaces[i].region_info.bounding_box.right_col * height;
      const bottomRow =
        height - ClarifaiFaces[i].region_info.bounding_box.bottom_row * height;

      coordinates.push([leftCol, rightCol, topRow, bottomRow]);
    }
    return {
      coordinates,
    };
  };

  const displayFaceBox = (box) => {
    console.log(box);
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const [imageUrl, setImageUrl] = useState();
  const handleError = (error) => {
      setError(true);
  }
  const onButtonSubmit = () => {
    setError(false);
    setImageUrl(input);
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: input,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((parsedResponse) =>
        displayFaceBox(calculateFaceLocation(parsedResponse))
      )
      .catch((err) => handleError(err));
  };

  return (
    <div className="App">
      <ParticlesBg num={200} type="circle" bg={true} className="particles" />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl} error = {error} faces = {numberOfFaces} />
    </div>
  );
}

export default App;
