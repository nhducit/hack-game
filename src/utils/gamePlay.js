import { images } from "../assets";

const user = {
  point: 0,
  name: "@anhpham",
  img: images.cardWheel(),
  maxLevel: 1
};

const rules = {
  bomb: -30,
  failed: -10,
  speed: 5,
  flip: 100
};

export { user, rules };
