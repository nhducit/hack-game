import React from "react";
import Wrapper from "../../components/wrapPage";
import { images } from "../../assets";
import Card from "../../components/card";
import { withRouter } from "next/router";
import { user } from "../../utils/gamePlay";

class Claim extends React.Component {
  state = {
    side: "back",
    prizes: [
      {
        type: "coin",
        value: 100,
        description: "100 coins!",
        image: images.prize01()
      },
      {
        type: "coin",
        value: 290,
        description: "290 coins!",
        image: images.prize02()
      },
      {
        type: "bump",
        value: 1,
        description: "1 free bump",
        image: images.prize03()
      },
      {
        type: "spotlight",
        value: 100,
        description: "1 free spotlight",
        image: images.prize01()
      }
    ],
    prize: Math.floor(Math.random() * 4)
  };

  onFlipCard = () => {
    this.setState({ side: "front" });
  };

  render = () => {
    const { prize, prizes, side } = this.state;
    const gift = prizes[prize];
    return (
      <Wrapper bg={images.bgClaim()}>
        <div
          style={{
            flexDirection: "column-reverse",
            display: "flex",
            alignItems: "center",
            height: "100%"
          }}
        >
          <button
            onClick={() => {
              user.point = 0;
              this.props.router.push("/game");
            }}
            style={{
              backgroundImage: `url(${images.continuePlayButton()})`,
              width: "334px",
              height: "56px",
              marginBottom: "16px",
              backgroundSize: "cover"
            }}
          ></button>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              marginTop: "180px",
              alignItems: "center",
              flex: 1
            }}
          >
            <Card
              side={side}
              onFlipCard={this.onFlipCard}
              backImage={images.backCardClaimIcon()}
              image={gift.image}
              width="200px"
              height="200px"
            ></Card>

            {side == "front" ? (
              <div
                style={{
                  marginTop: "34px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <p
                  style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "white"
                  }}
                >
                  {gift.description}
                </p>
                <p
                  style={{
                    marginTop: "4px",

                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "white"
                  }}
                >
                  Reward is sent to your profile
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "34px",
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center"
                }}
              >
                Flip to claim
              </p>
            )}
          </div>
        </div>
      </Wrapper>
    );
  };
}
export default withRouter(Claim);
