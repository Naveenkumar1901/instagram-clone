import React from "react";
import "./status.css";

const Story = ({ img, username }) => {
  return (
    <div className="each-status">
      <div className="status-avatar">
        <img src={img} alt="" />
      </div>
      <p className="status-name">{username}</p>
    </div>
  );
};

export default Story;
