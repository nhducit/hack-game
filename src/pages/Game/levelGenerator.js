import { images } from "../../assets";

const cards = [
  images.cardABC(),
  images.cardBike(),
  images.cardCamera(),
  images.cardCard(),
  images.cardHelmet(),
  images.cardLipstick(),
  images.cardPropBlue(),
  images.cardPropGreen(),
  images.cardPropPurple(),
  images.cardTicket(),
  images.cardTree(),
  images.cardTyre(),
  images.cardWheel(),
  images.cardWheelChair()
].map((value, index) => {
  return {
    id: `${index}`,
    image: value,
    type: "card"
  };
});

const bomb = {
  id: "bomb",
  image: images.cardBomb(),
  isBomb: true,
  type: "card"
};

const randomChooseCards = ({ number }) => {
  return cards.slice(0, number); // refactor later
};

const shuffle = ({ cards }) => {
  return cards; // refactor later
};

const levels = {
  1: {
    time: 119,
    numOfCards: 3,
    numOfBomb: 1,
    layout: {
      rows: 3,
      columns: 4
    },
    blank: [
      {
        x: 0,
        y: 0
      },
      {
        x: 0,
        y: 3
      },
      {
        x: 2,
        y: 0
      },
      {
        x: 2,
        y: 3
      }
    ]
  },
  2: {
    time: 119,
    numOfCards: 7,
    numOfBomb: 1,
    layout: {
      rows: 5,
      columns: 4
    },
    blank: [
      {
        x: 0,
        y: 0
      },
      {
        x: 0,
        y: 3
      },
      {
        x: 2,
        y: 0
      },
      {
        x: 2,
        y: 3
      }
    ]
  }
};

const numOfLevel = 2;

const generate = ({ level }) => {
  const config = levels[level];

  const randomCards = randomChooseCards({
    number: config.numOfCards
  });
  const bombCards = [...Array(config.numOfBomb).keys()].map(() => ({
    ...bomb
  }));
  const oneSideCards = [...randomCards, ...bombCards];
  const cards = shuffle({ cards: [...oneSideCards, ...oneSideCards] });
  return {
    cards,
    blank: config.blank,
    layout: {
      ...config.layout,
      width: "60px",
      height: "60px"
    },
    time: config.time
  };
};

export { generate, numOfLevel };
