import React from "react";

const Rank = () => {
  return (
    <div>
      <div className="white tc b f2">{"Hello {User}, Your Rank is"}</div>
      <div className="white tc b f1" style={{paddingTop:'10px'}}>{'#{5}'}</div>
    </div>
  );
}

export default Rank;