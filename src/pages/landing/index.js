import React from "react";
import Wrapper from "../../components/wrapPage";
import { images } from "../../assets";
import { withRouter } from "next/router";

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  land = (
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
          width: "150px",
          height: "150px",
          marginBottom: "270px",
          borderRadius: "500px",
          border: "10px solid white"
        }}
        src={images.catAvatar()}
      />
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
          this.props.router.push(`/game${this.props.demo ? "?demo=true" : ""}`);
        }}
      />
    </div>
  );

  render = () => {
    return <Wrapper bg={images.bgIntro()} children={this.land}></Wrapper>;
  };
}
export default withRouter(Landing);
