import React from "react";
// import Register from "../Register/Register";
const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <div>
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("signOut")}
            className="f3 link dim black underline pa3 pointer"
          >
            Sign Out
          </p>
        </nav>
      </div>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signIn")}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange("register")}
          className="f3 link dim black underline pa3 pointer"
        >
          Register
        </p>
      </nav>
    );
  }
};
export default Navigation;
