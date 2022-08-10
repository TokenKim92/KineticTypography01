export default class TextFrame {
  static EVEN_ODD_OFFSET = 6;

  #fontFormat;
  #pixelSize;
  #bgColor;

  constructor(fontFormat, pixelSize, bgColor) {
    this.#fontFormat = fontFormat;
    this.#pixelSize = pixelSize;
    this.#bgColor = bgColor;
  }

  drawTextFrame = (ctx, text, stageWidth, stageHeight) => {
    ctx.save();

    ctx.font = this.#fontFormat.font;
    ctx.fillStyle = this.#bgColor;
    ctx.textBaseline = 'middle';
    const fontPos = ctx.measureText(text);

    ctx.fillText(
      text,
      (stageWidth - fontPos.width) / 2,
      (stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2
    ); // prettier-ignore

    ctx.restore();

    const textField = {
      left:(stageWidth - fontPos.width) / 2,
      top: (stageHeight - fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2,
      width: fontPos.width,
      height: fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent ,
    }; // prettier-ignore

    return {
      textField: textField,
      dots: this.#getDotPos(ctx, stageWidth, stageHeight),
    };
  };

  #getDotPos(ctx, stageWidth, stageHeight) {
    const imageData = ctx.getImageData(0, 0, stageWidth, stageHeight).data; // prettier-ignore

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
