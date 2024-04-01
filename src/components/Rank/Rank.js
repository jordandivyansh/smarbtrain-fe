import React from "react";

const Rank = ({user, entries}) => {
  return (
    <div>
      <div className="white tc b f2">{`Hello ${user}, your current count is... ` }</div>
      <div className="white tc b f1" style={{paddingTop:'10px'}}>{'#{5}'}</div>
    </div>
  );
}

export default Rank;