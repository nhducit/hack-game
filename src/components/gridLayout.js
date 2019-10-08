import React from "react";
import Card from "./card";

const getItems = ({ cards, layout, blank }) => {
  let cardLength = (cards || []).length;

  let blankFlatten = (blank || []).reduce((result, value) => {
    result[value.x * layout.columns + value.y] = true;
    return result;
  }, {});

  var card = 0;

  return [...Array(layout.rows).keys()].map(row => {
    return [...Array(layout.columns).keys()].map(column => {
      if (blankFlatten[row * layout.columns + column] == true) {
        return {
          type: "blank"
        };
      } else if (card < cardLength) {
        let result = {
          ...cards[card],
          index: card
        };
        card += 1;
        return result;
      } else {
        return {
          type: "blank"
        };
      }
    });
  });
};

const GridLayout = props => {
  const { cards, layout, blank, onFlipCard } = props;

  const items = getItems({
    cards,
    layout,
    blank
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: row == 0 ? "0px" : "10px"
            }}
          >
            {items[rowIndex].map((item, columnIndex) => {
              if (item.type == "blank") {
                return (
                  <div
                    key={`${columnIndex}`}
                    style={{
                      width: layout.width,
                      height: layout.height,
                      marginLeft: columnIndex == 0 ? "0px" : "10px"
                    }}
                  ></div>
                );
              } else if (item.type == "card") {
                return (
                  <Card
                    width={layout.width}
                    height={layout.height}
                    key={`${rowIndex * layout.rows + columnIndex}`}
                    marginLeft={columnIndex == 0 ? "0px" : "10px"}
                    side={item.side}
                    index={item.index}
                    onFlipCard={onFlipCard}
                    id={item.id}
                  />
                );
              } else {
                return <div />;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GridLayout;
