import TextFrame from './textFrame.js';
import Ripple from './ripple.js';
import Dot from './dot.js';
import { collide, posInRect, randomClickInRect, colorToRGB, getRandomCharFromText } from './utils.js'; // prettier-ignore
import BaseCanvas from '../lib/baseCanvas.js';

export default class DotKineticText extends BaseCanvas {
  static DOT_RADIUS = 10;
  static RADIUS = 10;
  static MATCH_MEDIA = window.matchMedia('(max-width: 768px)').matches;
  static BG_COLOR = 'rgba(0, 0, 0)';
  static DOT_COLOR = 'rgb(255, 255, 255)';

  #dotRadius;
  #pixelSize;
  #rippleSpeed;
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

  constructor(fontFormat, text, rippleSpeed = 10, isRandomTextMode = false) {
    super(true);

    this.#dotRadius = DotKineticText.DOT_RADIUS;
    this.#pixelSize = this.#dotRadius * 2;
    this.#rippleSpeed = rippleSpeed;
    this.#text = text;
    this.#isRandomTextMode = isRandomTextMode;

    this.textFrame = new TextFrame(fontFormat, this.#pixelSize, DotKineticText.BG_COLOR); // prettier-ignore
    this.ripple = new Ripple(this.#rippleSpeed);
    this.initEvents();
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

    this.addDotItemOnTextField();
    DotKineticText.MATCH_MEDIA ? this.onClick({ offsetX: 0, offsetY: 0 })
                               : this.onClick(randomClickInRect(this.#textField)); // prettier-ignore
  };

  animate = (curTime) => {
    this.#isKineticActivated ? this.KineticAnimate(curTime) : this.pluckAnimate(); // prettier-ignore
  };

  onClick = (event) => {
    if (
      DotKineticText.MATCH_MEDIA &&
      posInRect({ x: event.offsetX, y: event.offsetY }, this.#textField)
    ) {
      return;
    }

    this.#dots.forEach((dot) => dot.init());
    this.#pluckCount = 0;
    this.#clickedPos = { x: event.offsetX, y: event.offsetY };
    this.#maxPluckCount = this.ripple.init(this.#clickedPos.x, this.#clickedPos.y, this.#textField); // prettier-ignore

    this.clearCanvas();
    this.animateTarget(this.textFrame.drawTextFrame, this.#toBeDrawText, this.stageWidth, this.stageHeight); // prettier-ignore
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
      .forEach((dot) => this.animateTarget(dot.pluckAnimate, 1, 2));

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

      this.animateTarget(dot.kineticAnimate, curTime);
    });
  }

  addDotItemOnTextField() {
    this.#dots = [];

    this.#toBeDrawText = this.#isRandomTextMode ? getRandomCharFromText(this.#text)
                                                : this.#text; // prettier-ignore

    this.clearCanvas();
    const textData = this.animateTarget(this.textFrame.drawTextFrame, this.#toBeDrawText, this.stageWidth, this.stageHeight) // prettier-ignore

    const dots = textData.dots;
    this.#textField = textData.textField;

    dots.forEach((dot) => {
      this.#dots.push(
        new Dot(
          dot,
          this.#dotRadius,
          colorToRGB(DotKineticText.DOT_COLOR),
          colorToRGB(DotKineticText.BG_COLOR)
        )
      );
    });
  }
}
