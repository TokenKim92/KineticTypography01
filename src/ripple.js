import { distance } from './utils.js';

export default class Ripple {
  static PLUCK_COUNT_OFFSET = 1.5;

  #speed;
  #radius;
  #maxRadius;

  constructor(speed) {
    this.#speed = speed;
  }

  init(x, y, textField) {
    this.#radius = 0;
    this.#maxRadius = this.#getMaxDistance(x, y, textField);

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

  get radius() {
    return this.#radius;
  }

  set radius(radius) {
    this.#radius = radius;
  }
}
