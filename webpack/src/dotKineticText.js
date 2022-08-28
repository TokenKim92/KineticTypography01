import TextFrame from './textFrame.js';
import Ripple from './ripple.js';
import Dot from './dot.js';
import { collide, posInRect, randomClickInRect, colorToRGB, getRandomCharFromText } from './utils.js'; // prettier-ignore
import BaseCanvas from '../lib/baseCanvas.js';
import FontFormat from '../lib/fontFormat.js';

export default class DotKineticText extends BaseCanvas {
  static RADIUS = 10;
  static PIXEL_SIZE = DotKineticText.RADIUS * 2;
  static SMALL_DOT_RADIUS = 4;
  static SMALL_MODE_PIXEL_SIZE = DotKineticText.SMALL_DOT_RADIUS * 2;
  static BG_COLOR = 'rgba(0, 0, 0)';
  static DOT_COLOR = 'rgb(255, 255, 255)';

  #dots = [];
  #pluckCount = 0;
  #maxPluckCount;
  #clickedPos = { x: 0, y: 0 };
  #text;
  #toBeDrawText;
  #textField;
  #isKineticActivated = false;
  #mouse = {
    x: 0,
    y: 0,
    radius: 100,
  };
  #isRandomTextMode;
  #fontName;
  #prevSizeMode = BaseCanvas.INIT_MODE;

  constructor(fontName, text, rippleTime = 5, isRandomTextMode = false) {
    super(true);

    this.#text = text;
    this.#isRandomTextMode = isRandomTextMode;
    this.#fontName = fontName;

    this.ripple = new Ripple(rippleTime);
    this.#initTextFrame();
    this.initEvents();
  }

  #initTextFrame() {
    if (this.sizeMode === this.#prevSizeMode) {
      return;
    }

    this.#prevSizeMode = this.sizeMode;
    let fontSize = 0;

    switch (this.sizeMode) {
      case BaseCanvas.SMALL_MODE:
        fontSize = 250;
        this.#mouse.radius /= 2;
        break;
      case BaseCanvas.REGULAR_MODE:
        fontSize = 400;
        break;
      case BaseCanvas.MEDIUM_MODE:
        fontSize = 700;
        break;
      case BaseCanvas.LARGE_MODE:
        fontSize = 800;
        break;
      default:
        throw new Error('This canvas size is not possible!');
    }

    const fontFormat = new FontFormat(800, fontSize, this.#fontName);
    const pixelSize = this.isMatchMedia
      ? DotKineticText.SMALL_MODE_PIXEL_SIZE
      : DotKineticText.PIXEL_SIZE;
    this.textFrame = new TextFrame(fontFormat, pixelSize, DotKineticText.BG_COLOR); // prettier-ignore
  }

  initEvents() {
    this.addEventToCanvas('click', this.onClick);
    document.addEventListener('pointermove', this.onMouseMove);
  }

  removeEvents() {
    this.removeEventFromCanvas('click', this.onClick);
    document.removeEventListener('pointermove', this.onMouseMove);
  }

  bringToStage() {
    super.bringToStage();
    this.initEvents();
  }

  removeFromStage() {
    this.removeEvents();
    super.removeFromStage();
  }

  resize = () => {
    super.resize();

    this.#initTextFrame();
    this.addDotItemOnTextField();
    this.isMatchMedia ? this.onClick({ offsetX: 0, offsetY: 0 })
                      : this.onClick(randomClickInRect(this.#textField)); // prettier-ignore
  };

  animate(curTime) {
    this.#isKineticActivated ? this.KineticAnimate(curTime) : this.pluckAnimate(); // prettier-ignore
  }

  onClick = (event) => {
    if (
      this.isMatchMedia &&
      posInRect({ x: event.offsetX, y: event.offsetY }, this.#textField)
    ) {
      return;
    }

    this.#dots.forEach((dot) => dot.init());
    this.#pluckCount = 0;
    this.#clickedPos = { x: event.offsetX, y: event.offsetY };
    this.#maxPluckCount = this.ripple.init(this.#clickedPos.x, this.#clickedPos.y, this.#textField); // prettier-ignore

    this.clearCanvas();
    this.textFrame.drawTextFrame(
      this.ctx,
      this.#toBeDrawText,
      this.stageWidth,
      this.stageHeight
    );
    this.#isKineticActivated = false;
  };

  onMouseMove = (event) => {
    this.#mouse.x = event.clientX;
    this.#mouse.y = event.clientY;
  };

  pluckAnimate() {
    this.ripple.animate();

    this.#dots
      .filter((dot) => collide(dot.pos, this.#clickedPos, this.ripple.radius))
      .forEach((dot) => dot.pluckAnimate(this.ctx));

    const isDonePluckAnimate = this.#pluckCount >= this.#maxPluckCount;
    isDonePluckAnimate ? (this.#isKineticActivated = true) : this.#pluckCount++;
  }

  KineticAnimate(curTime) {
    this.clearCanvas();

    let dx, dy, dist, minDist;
    let angle, tx, ty, ax, ay;

    this.#dots.forEach((dot) => {
      dx = this.#mouse.x - dot.pos.x;
      dy = this.#mouse.y - dot.pos.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      minDist = DotKineticText.RADIUS + this.#mouse.radius;

      if (dist < minDist) {
        angle = Math.atan2(dy, dx);
        tx = dot.pos.x + Math.cos(angle) * minDist;
        ty = dot.pos.y + Math.sin(angle) * minDist;
        ax = tx - this.#mouse.x;
        ay = ty - this.#mouse.y;

        dot.posVelocity.vx -= ax;
        dot.posVelocity.vy -= ay;
        dot.collide();
      }

      dot.kineticAnimate(this.ctx, curTime);
    });
  }

  addDotItemOnTextField() {
    this.#dots = [];

    this.#toBeDrawText = this.#isRandomTextMode ? getRandomCharFromText(this.#text)
                                                : this.#text; // prettier-ignore

    this.clearCanvas();
    const textData = this.textFrame.drawTextFrame(
      this.ctx,
      this.#toBeDrawText,
      this.stageWidth,
      this.stageHeight
    );

    const dots = textData.dots;
    this.#textField = textData.textField;
    const dotRadius = this.isMatchMedia
      ? DotKineticText.SMALL_DOT_RADIUS
      : DotKineticText.RADIUS;

    dots.forEach((dot) => {
      this.#dots.push(
        new Dot(
          dot,
          dotRadius,
          colorToRGB(DotKineticText.DOT_COLOR),
          colorToRGB(DotKineticText.BG_COLOR)
        )
      );
    });
  }
}
