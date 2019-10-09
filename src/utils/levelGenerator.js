import { images } from "../assets";

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

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const randomChooseCards = ({ number }) => {
  return getRandom(cards, number);
};

const shuffle = ({ cards }) => {
  return cards.sort(() => 0.5 - Math.random());
};

const levels = {
  1: {
    time: 119,
    numOfCards: 4,
    numOfBomb: 0,
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
    numOfCards: 6,
    numOfBomb: 1,
    layout: {
      rows: 4,
      columns: 4
    },
    blank: [
      {
        x: 3,
        y: 0
      },
      {
        x: 3,
        y: 3
      }
    ]
  }
};

const numOfLevel = 2;

const generate = ({ level, isShuffle }) => {
  const config = levels[level];

  const randomCards = randomChooseCards({
    number: config.numOfCards
  });
  const bombCards = [...Array(config.numOfBomb).keys()].map(() => ({
    ...bomb
  }));
  const oneSideCards = [...randomCards, ...bombCards];
  const cards = isShuffle
    ? shuffle({ cards: [...oneSideCards, ...oneSideCards] })
    : [...oneSideCards, ...oneSideCards];
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
