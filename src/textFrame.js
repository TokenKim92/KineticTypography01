import { getBgColorObject } from './utils.js';

export default class TextFrame {
  static EVEN_ODD_OFFSET = 6;

  #ctx;
  #fontFormat;
  #pixelSize;
  #bgColor;

  constructor(ctx, fontFormat, pixelSize) {
    this.#ctx = ctx;
    this.#fontFormat = fontFormat;
    this.#pixelSize = pixelSize;
    this.#bgColor = getBgColorObject();
  }

  drawTextFrame(text, stageWidth, stageHeight) {
    this.#ctx.clearRect(0, 0, stageWidth, stageHeight);

    this.#ctx.font = `
      ${this.#fontFormat.width} 
      ${this.#fontFormat.size}px 
      ${this.#fontFormat.name}`; // prettier-ignore

    this.#ctx.fillStyle = `rgba(
      ${this.#bgColor.r}, 
      ${this.#bgColor.g}, 
      ${this.#bgColor.b}, 
      0.3)`; // prettier-ignore
    this.#ctx.textBaseline = 'middle';

    const fontPos = this.#ctx.measureText(text);

    this.#ctx.fillText(
      text,
      (stageWidth - fontPos.width) / 2,
      (stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2
    ); // prettier-ignore

    const textField = {
      left:(stageWidth - fontPos.width) / 2,
      top: (stageHeight - fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2,
      width: fontPos.width,
      height: fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent ,
    }; // prettier-ignore

    return {
      textField: textField,
      dots: this.#getDotPos(stageWidth, stageHeight),
    };
  }

  #getDotPos(stageWidth, stageHeight) {
    const imageData = this.#ctx.getImageData(
      0, 0,
      stageWidth, stageHeight
    ).data; // prettier-ignore

    const dots = [];
    let alphaValue;
    let x = 0;
    let i = 0;

    for (let y = 0; y < stageHeight; y += this.#pixelSize) {
      x = (i++ % 2) * TextFrame.EVEN_ODD_OFFSET;
      for (x; x < stageWidth; x += this.#pixelSize) {
        alphaValue = imageData[(x + y * stageWidth) * 4 + 3];

        if (alphaValue) {
          dots.push({
            x: x,
            y: y,
          });
        }
      }
    }

    return dots;
  }
}
