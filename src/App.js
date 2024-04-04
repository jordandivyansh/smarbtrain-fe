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
  const [box, setBox] = useState({});
  // const [error, setError] = useState(false);
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
    console.log(data);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data) => {
    // if (error) return;
    // const faces = data.outputs[0].data.regions.length;
    // const ClarifaiFaces = data.outputs[0].data.regions;
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
    // for multi face input

    // const coordinates = [];
    // for (let i = 0; i < faces; i++) {
    //   const leftCol =
    //     ClarifaiFaces[i].region_info.bounding_box.left_col * width;
    //   const rightCol =
    //     width - ClarifaiFaces[i].region_info.bounding_box.right_col * width;
    //   const topRow =
    //     ClarifaiFaces[i].region_info.bounding_box.right_col * height;
    //   const bottomRow =
    //     height - ClarifaiFaces[i].region_info.bounding_box.bottom_row * height;

    //   coordinates.push([leftCol, rightCol, topRow, bottomRow]);
    // }
    // return {
    //   coordinates,
    // };
  };

  const displayFaceBox = (box) => {
    // console.log(box);
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const [imageUrl, setImageUrl] = useState();
  // const handleError = (error) => {
  //   setError(true);
  // };
  const onButtonSubmit = () => {
    if (input === imageUrl) {
      window.alert("Please change the image URL input.");
      return;
    }
    // setError(false);
    setImageUrl(input);
    fetch("http://localhost:3001/imageUrl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        return response.json();
      })
      .then((parsedResponse) => {
        displayFaceBox(calculateFaceLocation(parsedResponse));
        fetch("http://localhost:3001/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
          }),
        })
          .then((response) => response.json())
          .then((entries) => {
            setUser({
              entries: entries,
              id: user.id,
              name: user.name,
            });
          });
      })
      .catch((err) => {
        console.error(err);
        window.alert(
          "Input provided is not image url. Failed to fetch data. Please try again later."
        );
      });
    // .then((response) => response.json())
    // .then((parsedResponse) => {
    //   displayFaceBox(calculateFaceLocation(parsedResponse));
    // })
    // .catch((err) => console.error(err));
  };
  const onRouteChange = (route) => {
    setRoute(route);
    if (route === "home") {
      setSignedIn(true);
      // fetch("http://localhost:3001/image", {
      //     method: "put",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       id: user.id,
      //     }),
      //   })
      //     .then((response) => {response.json()
      //     console.log(response)})
      //     .then((count) => {
      //       Object.assign(user, { entries: count });
      //     });
    } else if (route === "signOut") {
      setSignedIn(false);
      setInput("");
      setBox([]);
      // setError(false);
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
          <Rank user={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
          {/* <FaceRecognition box={box} imageUrl={imageUrl} error={error} /> */}
        </div>
      ) : route === "signIn" || route === "signOut" ? (
        <div>
          <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
          <ParticlesBg config={config} type="custom" bg={true} />
          <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
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
