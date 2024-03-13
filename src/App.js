import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
// import Clarifai from 'clarifai';

const PAT = "fa82bf3b5c5b433995e2183ff69ee2e2";
const USER_ID = "jordandivyansh";
const APP_ID = "smartbrain";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
function App() {
  const [input, setInput] = useState();
  const [box, setBox] = useState({});

  const calculateFaceLocation = (data) => {
    const numberOfFace = data.outputs[0].data.regions.length;
    const ClarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image')
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(ClarifaiFace, width, height, numberOfFace)
    return{
      leftCol: ClarifaiFace.left_col * width,
      topRow: ClarifaiFace.top_row * height,
      rightCol: width - (ClarifaiFace.right_col * width),
      bottomRow: height - (ClarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    console.log("bx", box);
    setBox(box)
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const [imageUrl, setImageUrl] = useState();

  const onButtonSubmit = () => {
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
    .then(response => response.json())
    .then(parsedResponse => displayFaceBox(calculateFaceLocation(parsedResponse)))
    .catch((error) => console.log("error", error));
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
      <FaceRecognition box = {box} imageUrl={imageUrl} />
    </div>
  );
}

export default App;
