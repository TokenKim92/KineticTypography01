import { distance } from './utils.js';

export default class Ripple {
  static PLUCK_COUNT_OFFSET = 1.5;

  #time;
  #FPS;
  #speed;
  #radius;
  #maxRadius;

  constructor(time, FPS = 60) {
    this.#time = time;
    this.#FPS = FPS;
  }

  init(x, y, textField) {
    this.#radius = 0;
    this.#maxRadius = this.#getMaxDistance(x, y, textField);
    this.#speed = this.#calculateSpeed(this.#maxRadius);

    return Math.ceil(this.#maxRadius / this.#speed) * Ripple.PLUCK_COUNT_OFFSET;
  }

  animate() {
    this.#radius += this.#speed * (this.#radius < this.#maxRadius);
  }

  #getMaxDistance(x, y, textField) {
    const fromLeftTop = distance(textField.left, textField.top, x, y);
    const fromRightTop = distance(textField.left + textField.width - 1, textField.top, x, y); // prettier-ignore
    const fromLeftBottom = distance(textField.left, textField.top + textField.height - 1, x, y); // prettier-ignore
    const fromRightBottom = distance(textField.left + textField.width - 1, textField.top + textField.height - 1, x, y); // prettier-ignore

    return Math.max(fromLeftTop, fromRightTop, fromLeftBottom, fromRightBottom);
  }

  #calculateSpeed(maxRadius) {
    const FPS_TIME = 1000 / this.#FPS;
    return maxRadius / (FPS_TIME * this.#time);
  }

  get radius() {
    return this.#radius;
  }
}
