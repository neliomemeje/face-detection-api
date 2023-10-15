import React from "react";

const Rank = ({ name, entries, isSignin }) => {
  return (
    isSignin && (
      <div>
        <h3 className="ma0">
          Welcome <span className="orange">{name}</span>! Your current entry
          count is...
        </h3>
        <h2 className="ma0">{entries}</h2>
      </div>
    )
  );
};

export default Rank;
