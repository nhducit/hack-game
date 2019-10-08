import React from "react";
import moment from "moment";
import Countdown from "./Countdown";
import "./GameHeader.css";

class GameHeader extends React.Component {
  render() {
    const score = this.props.score;
    const level = this.props.level;
    const then = this.props.then;
    const timeOver = this.props.timeOver;

    return (
      <div className="Header">
        <div className="HeaderLeft">
          <img className="Oval" src="./avatar.png" alt="avatar" />
          <div className="Score">{score}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: "green" }}></div>
        <div className="HeaderRight">
          <div className="Level">L{level}</div>
          <Countdown then={then} timeOver={timeOver} />
        </div>
      </div>
    );
  }
}

export default GameHeader;
