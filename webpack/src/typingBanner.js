import Typing from '../lib/typing.js';
import FontFormat from '../lib/fontFormat.js';

export default class TypingBanner {
  #typing;
  #stageWidth;
  #stageHeight;
  #fontName;
  #fontColor;
  #backgroundColor;
  #isCalledWaitingHandler = false;

  constructor(fontName, speed = 50, fontColor = '#ffffff', backgroundColor = '#000000cc') {
    this.#fontName = fontName;
    this.#fontColor = fontColor;
    this.#backgroundColor = backgroundColor;

    this.#typing = new Typing(
      new FontFormat(400, 50, this.#fontName, this.#fontColor),
      speed
    );
    this.#typing.setWaitingHandler(this.hide, 300);
    this.#typing.hide();
  } // prettier-ignore

  resize() {
    if (!this.#typing.isMatchMedia) {
      this.#stageWidth = 560;
      this.#stageHeight = 180;
      this.#typing.fontFormat = new FontFormat(400, 35, this.#fontName, this.#fontColor); // prettier-ignore
      this.#typing.setStartPos(60, 55);
    } else {
      this.#stageWidth = 270;
      this.#stageHeight = 150;
      this.#typing.fontFormat = new FontFormat(400, 26, this.#fontName, this.#fontColor); // prettier-ignore
      this.#typing.setStartPos(30, 50);
    }

    this.#typing.resize(this.#stageWidth, this.#stageHeight);
    this.#typing.setPosition(
      (document.body.clientWidth - this.#stageWidth) / 2,
      (document.body.clientHeight - this.#stageHeight) / 2
    );
    this.#typing.borderRadius = 15;
    this.#typing.backgroundColor = this.#backgroundColor;
    this.setMessage();
  }

  animate(curTime) {
    this.#typing.animate(curTime);
  }

  setMessage() {
    const text = !this.#typing.isMatchMedia
      ? ['Click anywhere or', 'move the mouse on the screen']
      : ['Touch anywhere', 'on the screen'];

    this.#typing.delay(500).type(text, 200).start();
  }

  show(millisecond = 0, mode = 'ease') {
    this.#isCalledWaitingHandler = false;
    this.#typing.isOnStage || this.#typing.bringToStage();

    this.#typing.show(millisecond, mode);
  }

  hide = (millisecond = 0, mode = 'ease') => {
    if (this.#isCalledWaitingHandler) {
      return;
    }
    this.#isCalledWaitingHandler = true;

    this.#typing.hide(millisecond, mode);
    setTimeout(
      () => this.#typing.isOnStage && this.#typing.removeFromStage(),
      millisecond * 2
    );
  };
}
