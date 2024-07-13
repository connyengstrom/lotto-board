import React from "react";
import { useSelector } from "react-redux";

const ChosenRow = () => {

  const currentView = useSelector(state => state.currentView);

  return (
    <>
    <h2>Your numbers</h2>
    <div className="row">
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
      <div className={`row-number ${currentView === "view2" ? "grey-dot" : ""}`}>N</div>
    </div>
    </>
  )
};

export default ChosenRow;