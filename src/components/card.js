import React from "react";
import ReactCardFlip from "react-card-flip";
class Card extends React.Component {
  onBackViewClick = () => {
    this.props.onFlipCard({ index: this.props.index, id: this.props.id });
  };

  render = () => {
    const props = this.props;
    const isFlipped = this.props.side == "front";
    const { backImage, image } = this.props;
    return (
      <ReactCardFlip
        key={props.key}
        isFlipped={isFlipped}
        flipDirection="horizontal"
      >
        <button
          key="front"
          onClick={this.onBackViewClick}
          style={{
            backgroundColor: "#57585a",
            width: props.width,
            height: props.height,
            marginLeft: props.marginLeft,
            borderRadius: "4px",
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover"
          }}
        />
        <div
          key="back"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: props.width,
            height: props.height,
            marginLeft: props.marginLeft,
            borderRadius: "4px",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover"
          }}
        />
        />
      </ReactCardFlip>
    );
  };
}

export default Card;
