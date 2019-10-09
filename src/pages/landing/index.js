import Head from "next/head";
import React from "react";
import posed from "react-pose";
import moment from "moment";
import Wrapper from "../../components/wrapPage";
import { images } from "../../assets";
import Game from "./../game";


const land =
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundImage: `url(${images.bgIntro()})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    }}
  >
    <img
      style={{
        width: "95%",
        height: "auto",
        bottom: "15px",
        marginBottom: "30px",
        cursor: "pointer"
      }}
      src={images.playBtn()}
      onClick={() => {
        console.log('tapped');

        function handleClick(e) {
          e.preventDefault();
          console.log('User wanna plays game lah!');
        }

        return (
          <Game />
        );
      }} />
  </div>


class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Wrapper bg={images.bgIntro()} children={land}></Wrapper>
    );
  };
}
export default Landing;
