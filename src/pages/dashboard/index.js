import React from "react";
import Wrapper from "../../components/wrapPage";
import { images } from "../../assets";
import { user } from "../../utils/gamePlay";
import { withRouter } from "next/router";

const Item = ({ rank, img, name, maxLevel, point, isSelected, onClick }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "16px"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "16px",
        padding: "8px 8px",
        backgroundColor: "white",
        width: "100%",
        border: isSelected ? "solid 8px rgba(0, 217, 255, 0.4)" : 0
      }}
    >
      <p
        style={{
          fontFamily: "Fabriga",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#2c2c2d"
        }}
      >
        {rank}
      </p>
      <div style={{ marginLeft: "16px" }}></div>
      <img
        src={img}
        width="40px"
        height="40px"
        style={{ borderRadius: "20px" }}
      />
      <div style={{ marginLeft: "4px" }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <p
          style={{
            fontFamily: "Fabriga",
            fontSize: "17px",
            color: "#008f79",
            lineHeight: 1.41
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "Fabriga",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#57585a",
            lineHeight: 1.47
          }}
        >
          Level {maxLevel}
        </p>
      </div>
      <div style={{ flex: 1 }}></div>
      <p
        style={{
          fontFamily: "Fabriga",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#2c2c2d",
          textAlign: "right"
        }}
      >
        {point}
      </p>
    </div>
    {isSelected ? (
      <button
        style={{
          width: "177px",
          height: "48px",
          marginTop: "-20px",
          backgroundImage: `url(${images.collectButton()})`
        }}
        onClick={onClick}
      ></button>
    ) : null}
  </div>
);

class Dashboard extends React.Component {
  state = {
    items: [
      {
        name: "@nathalie2",
        maxLevel: 2,
        point: 682,
        img: images.cardWheel()
      },
      {
        name: "@nathalie3",
        maxLevel: 2,
        point: 678,
        img: images.cardWheel()
      }
    ]
  };

  componentDidMount = () => {
    const { items } = this.state;

    let users = [...items, { ...user, isSelected: true }];
    users.sort((a, b) => b.point - a.point);
    users = users.map((a, index) => ({ ...a, rank: index + 1 }));

    this.setState({ items: users });
  };

  render = () => {
    const { items } = this.state;
    return (
      <Wrapper bg={images.bgClaim()}>
        <p
          style={{
            fontFamily: "Fabriga",
            fontSize: "34px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center"
          }}
        >
          Ranking board
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "28px",
            paddingRight: "28px",
            width: "100%"
          }}
        >
          {items.map(item => {
            return (
              <Item
                key={item.name}
                {...item}
                onClick={() => {
                  this.props.router.push("/claim");
                }}
              />
            );
          })}
        </div>
      </Wrapper>
    );
  };
}

export default withRouter(Dashboard);
