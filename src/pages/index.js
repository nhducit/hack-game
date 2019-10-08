import Head from "next/head";
import React from "react";

import GridLayout from "../components/gridLayout";

const testCards = [...Array(6).keys()].map(v => ({
  type: "card",
  side: "back",
  id: `${v}`
}));

class Game extends React.Component {
  state = {
    cards: [...testCards, ...testCards],
    canFlip: 2,
    openedCards: {}
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

    this.setState({ cards });
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

  checkCards = () => {
    const { canFlip, openedCards } = this.state;
    const keys = Object.keys(openedCards);
    if (keys.length < canFlip) {
      return;
    }

    let card1 = openedCards[keys[0]];
    let card2 = openedCards[keys[1]];

    if (card1 != card2) {
      return;
    }

    this.removeCards({ indexs: keys });
    this.setCardMarked({ indexs: keys, marked: true });
  };

  onFlipCard = ({ index, id }) => {
    var { canFlip, openedCards } = this.state;
    if (Object.keys(openedCards).length < canFlip) {
      openedCards[index] = id;
      this.setState({ openedCards: { ...openedCards } });
      this.setCardSide({ index, side: "front" });
      this.checkCards();
      setTimeout(() => {
        this.onFlipTimeOut({ index });
      }, 2000);
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

  render = () => {
    const { cards } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        <GridLayout
          onFlipCard={this.onFlipCard}
          cards={cards}
          layout={{ rows: 4, columns: 4, width: "50px", height: "50px" }}
          blank={[
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: 3
            },
            {
              x: 3,
              y: 0
            },
            {
              x: 3,
              y: 3
            }
          ]}
        />
      </div>
    );
  };
}

export default Game;
