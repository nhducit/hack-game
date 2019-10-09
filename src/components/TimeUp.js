import React from "react";
import moment from "moment";
import Countdown from "./Countdown";
import { images } from "../assets";
import "./GameHeader.css";

class TimeUp extends React.Component {
  render() {
    return (
      <div
        style={{
          width: "312px",
          height: "305px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "32px",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "#ffffff"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <img
            style={{
              width: "95px",
              height: "95px",
              border: "10px solid white"
            }}
            src={images.catAvatar()}
          />
          <img
            style={{
              width: "40px",
              height: "40px",
              marginTop: "50px",
              marginLeft: "-35px"
            }}
            src={images.objClock()}
          />
        </div>
        <div
          style={{
            height: "26px",

            fontSize: "20px",
            fontWeight: "bold",
            fontStyle: "normal",
            fontStretch: "normal",
            letterSpacing: "normal",
            textAlign: "center",
            color: "#991720",
            marginTop: "12px"
          }}
        >
          Oops, Time’s Up
        </div>
        <div
          style={{
            width: "124px",
            height: "40px",

            fontSize: "50px",
            fontWeight: "bold",
            fontStyle: "normal",
            fontStretch: "normal",
            lineHeight: "0.8",
            letterSpacing: "normal",
            textAlign: "center",
            marginTop: "16px",
            color: "#2c2c2d"
          }}
        >
          {this.props.score}
        </div>
        <div
          style={{
            height: "26px",

            fontSize: "20px",
            fontWeight: "bold",
            fontStyle: "normal",
            fontStretch: "normal",
            lineHeight: "1.3",
            letterSpacing: "normal",
            textAlign: "center",
            marginTop: "13px",
            color: "#2c2c2d"
          }}
        >
          Level {this.props.level}
        </div>
      </div>
    );
  }
}

export default TimeUp;
