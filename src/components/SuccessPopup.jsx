import React from "react";
import "./SuccessPopup.css";

function SuccessPopup({ show, message }) {
  if (!show) return null;

  return (
    <div className="success-popup">
      <div className="popup-icon">✓</div>
      <div className="popup-message">
        <h3>Success!</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SuccessPopup;