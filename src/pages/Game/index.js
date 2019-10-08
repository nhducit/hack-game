import Head from "next/head";
import React from "react";
import posed from "react-pose";
import { generate, numOfLevel } from "./levelGenerator";
import GameHeader from "../../components/GameHeader";
import { user, rules } from "../gamePlay";
import moment from "moment";
import Wrapper from "../../components/wrapPage";

import GridLayout from "../../components/gridLayout";

import { images } from "../../assets";

const Point = posed.div({
  visible: {
    y: ({ nextY }) => nextY,
    opacity: 1,
    transition: { duration: 250 }
  },
  hidden: {
    y: ({ fromY }) => fromY,
    opacity: 0,
    transition: { duration: 0 }
  }
});

const defaultState = {
  cards: [],
  layout: {},
  blank: [],
  canFlip: 2,
  openedCards: {},
  pointUp: { time: 0, value: 0 }
};

class Game extends React.Component {
  state = defaultState;

  componentDidMount = () => {
    const { level } = this.props;
    this.setupLevel({ level: level });
  };

  setupLevel = ({ level }) => {
    const l = level || 1;
    const config = generate({ level: l });
    this.setState({
      ...defaultState,
      ...config,
      then: moment().add(config.time, "seconds"),
      level: l,
      point: user.point
    });
  };

  setCardSide = ({ index, side }) => {
    const { cards } = this.state;

    cards[index] = {
      ...cards[index],
      side
    };

    this.setState({ cards });
  };

  setCardMarked = ({ indexs, marked }) => {
    const { cards } = this.state;

    indexs.forEach(index => {
      cards[index] = {
        ...cards[index],
        marked
      };
    });

    let numOfMarked = cards.reduce((result, value) => {
      return result + (value.marked ? 1 : 0);
    }, 0);

    this.setState({ cards });

    console.log("NGHIA: numOfMarked");
    console.log(numOfMarked);
    if (numOfMarked == cards.length) {
      this.toNextLevel();
    }
  };

  removeCards = ({ indexs }) => {
    const { openedCards } = this.state;

    indexs.forEach(index => {
      if (openedCards[index]) {
        delete openedCards[index];
      }
    });

    this.setState({ openedCards });
  };

  appendPoint = ({ type, value }) => {
    const { point } = this.state;
    this.setPointUp({ value, type });
    let newPoint = Math.max(0, point + value);
    user.point = newPoint;
    this.setState({ point: newPoint });
  };

  removePointUp = ({ time }) => {
    const { pointUp } = this.state;
    if (pointUp.time != time) {
      return;
    }
    this.setState({ pointUp: { time: 0, value: 0 } });
  };

  setPointUp = ({ value, type }) => {
    const time = new Date().getMilliseconds;
    this.setState({ pointUp: { time: 0, value: 0 } }, () => {
      const pointUp = {
        value,
        time,
        type
      };

      this.setState({ pointUp });
    });

    setTimeout(() => {
      this.removePointUp({ time });
    }, 300);
  };

  pointUpModel = ({ pointUp }) => {
    switch (pointUp.type) {
      case "bomb":
        return {
          header: "Bomb Blast!",
          title: `${pointUp.value}`
        };
      case "failed":
        return {
          title: `${pointUp.value}`
        };
      case "flip":
        return {
          title: `+${pointUp.value}`
        };
      default:
        return {};
    }
  };

  checkCards = () => {
    const { canFlip, openedCards } = this.state;
    const keys = Object.keys(openedCards);
    if (keys.length < canFlip) {
      return;
    }

    let card1 = openedCards[keys[0]];
    let card2 = openedCards[keys[1]];

    if (card1.id != card2.id) {
      if (card1.isBomb || card2.isBomb) {
        this.appendPoint({ value: rules.bomb, type: "bomb" });
      } else {
        this.appendPoint({ value: rules.failed, type: "failed" });
      }
      return;
    }

    if (!card1.isBomb) {
      this.appendPoint({ value: rules.flip, type: "flip" });
    }

    this.removeCards({ indexs: keys });
    this.setCardMarked({ indexs: keys, marked: true });
  };

  onFlipCard = ({ index }) => {
    var { canFlip, openedCards, cards } = this.state;
    if (Object.keys(openedCards).length < canFlip) {
      openedCards[index] = cards[index];
      this.setState({ openedCards: { ...openedCards } });
      this.setCardSide({ index, side: "front" });
      this.checkCards();
      setTimeout(() => {
        this.onFlipTimeOut({ index });
      }, 1000);
    }
  };

  onFlipTimeOut = ({ index }) => {
    const { cards } = this.state;
    if (cards[index].marked) {
      return;
    }

    this.removeCards({ indexs: [index] });
    this.setCardSide({ index, side: "back" });
  };

  onTimeOver = () => {
    //show popup
  };

  toNextLevel = () => {
    let nextLevel = this.state.level + 1;
    if (nextLevel > numOfLevel) {
      // go to dashboard
    } else {
      this.setupLevel({ level: nextLevel });
    }
  };

  render = () => {
    const { cards, pointUp, layout, blank, then, point, level } = this.state;
    const pointUpModel = this.pointUpModel({ pointUp });

    return (
      <Wrapper bg={images.bgGame()}>
        <GameHeader
          level={level}
          score={point}
          then={then}
          timeOver={this.onTimeOver}
        />

        <div style={{ marginTop: "100px" }}></div>

        <GridLayout
          backCardIcon={images.backCardIcon()}
          onFlipCard={this.onFlipCard}
          cards={cards}
          layout={layout}
          blank={blank}
        />
        <Point
          pose={pointUp.value != 0 ? "visible" : "hidden"}
          nextY={30}
          fromY={40}
          style={{
            flexDirection: "column",
            alignItems: "center",
            display: "flex",
            position: "absolute",
            y: 40,
            x: 200
          }}
        >
          <p
            style={{
              fontFamily: "Fabriga",
              fontSize: "20px",
              fontWeight: "bold",
              lineHeight: 1.67,
              color: "#33e1ff"
            }}
          >
            {pointUpModel.header}
          </p>
          <p
            style={{
              fontFamily: "Fabriga",
              fontSize: "48px",
              fontWeight: "bold",
              color: "#33e1ff"
            }}
          >
            {pointUpModel.title}
          </p>
        </Point>
      </Wrapper>
    );
  };
}

export default Game;
