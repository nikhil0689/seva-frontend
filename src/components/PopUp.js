import React from "react";

function PopUp(props) {
  return props.trigger ? (
    <div className="popup">
      <h2>This is a popup</h2>
      <button className="close-btn" onClick={() => props.trigger = false}>Close</button>
      {props.children}
    </div>
  ) : (
    ""
  );
}

export default PopUp;
