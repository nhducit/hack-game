import React from "react";
import moment from "moment";
import Countdown from "./Countdown";
import "./GameHeader.css";
import { user } from "../utils/gamePlay";
class GameHeader extends React.Component {
  render() {
    const score = this.props.score;
    const level = this.props.level;
    const then = this.props.then;
    const timeOver = this.props.timeOver;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "16px 8px",
          alignItems: "center",
          width: "100%"
        }}
      >
        <img
          className="Oval"
          src={user.img}
          alt="avatar"
          width="40px"
          height="40px"
        />
        <div className="Score">{score}</div>
        <div
          style={{ flex: 1, backgroundColor: "green", display: "flex" }}
        ></div>
        <div className="Level">L{level}</div>
        <Countdown then={then} timeOver={timeOver} />
      </div>
    );
  }
}

export default GameHeader;
