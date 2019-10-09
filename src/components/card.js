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
        containerStyle={{
          marginLeft: props.marginLeft,
          borderRadius: "4px"
        }}
      >
        <div
          key="front"
          onClick={this.onBackViewClick}
          style={{
            width: props.width,
            height: props.height,
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover"
          }}
        />
        <div
          key="back"
          style={{
            width: props.width,
            height: props.height,
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
