import { images } from "../assets";

const user = {
  point: 0,
  name: "@anhpham",
  img: images.cardWheel(),
  maxLevel: 1
};

const rules = {
  bomb: -10,
  failed: -5,
  speed: 5,
  flip: 100
};

export { user, rules };
