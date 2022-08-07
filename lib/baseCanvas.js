export default class BaseCanvas {
  #canvas;
  #ctx;
  #pixelRatio;
  #stageWidth;
  #stageHeight;

  constructor() {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
  }

  resize() {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }

  get canvas() {
    return this.#canvas;
  }

  get ctx() {
    return this.#ctx;
  }

  get stageWidth() {
    return this.#stageWidth;
  }

  get stageHeight() {
    return this.#stageHeight;
  }
}
