import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

let config = {
  num: [4, 7],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  alpha: [0.6, 0],
  scale: [0.1, 0.4],
  position: "all",
  color: ["random", "#ff0000"],
  cross: "dead",
  // emitter: "follow",
  random: 15,
};

if (Math.random() > 0.85) {
  config = Object.assign(config, {
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.rect(
        particle.p.x,
        particle.p.y,
        particle.radius * 2,
        particle.radius * 2
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    },
  });
}
function App() {
  const [input, setInput] = useState("");
  const [box, setBox] = useState([]);
  const [error, setError] = useState(false);
  const [route, setRoute] = useState("signIn");
  const [isSignedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });
  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data) => {
    if (error) return;
    const faces = data.outputs[0].data.regions.length;
    const ClarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    const coordinates = [];
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
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const [imageUrl, setImageUrl] = useState();
  const handleError = (error) => {
    setError(true);
  };
  const onButtonSubmit = () => {
    setError(false);
    setImageUrl(input);
    fetch("http://localhost:3001/imageUrl", {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        input: imageUrl
      })
    })
      .then((response) => response.json())
      .then((parsedResponse) =>
        displayFaceBox(calculateFaceLocation(parsedResponse))
      )
      .catch((err) => handleError(err));
  };
  const onRouteChange = (route) => {
    setRoute(route);
    if (route === "home") setSignedIn(true);
    else if (route === "signOut") {
      setSignedIn(false);
      setInput("");
      setBox([]);
      setError(false);
      setRoute("signIn");
      setSignedIn(false);
      setUser({
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      });
    }
    setRoute(route);
  };
  return (
    <div className="App">
      {route === "home" ? (
        <div>
          <ParticlesBg type="square" bg={true} />
          <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} error={error} />
        </div>
      ) : route === "signIn" || route === "signOut" ? (
        <div>
          <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
          <ParticlesBg config={config} type="custom" bg={true} />
          <SignIn onRouteChange={onRouteChange} />
        </div>
      ) : (
        <div>
          <ParticlesBg
            num={200}
            type="cobweb"
            bg={true}
            className="particles"
          />
          <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
          <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        </div>
      )}
    </div>
  );
}

export default App;
