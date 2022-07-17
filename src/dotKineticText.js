import TextFrame from './textFrame.js';
import Ripple from './ripple.js';
import Dot from './dot.js';
import { collide, posInRect, randomClickOnRect } from './utils.js';

export default class AppBuilder {
  dotRadius(dotRadius) {
    this.dotRadius = dotRadius;
    return this;
  }

  rippleSpeed(rippleSpeed) {
    this.rippleSpeed = rippleSpeed;
    return this;
  }

  fontFormat(fontFormat) {
    this.fontFormat = fontFormat;
    return this;
  }

  text(text) {
    this.text = text;
    return this;
  }

  setRandomTextMode(isRandomTextMode) {
    this.isRandomTextMode = isRandomTextMode;
    return this;
  }

  build() {
    return new DotKineticText(
      this.dotRadius,
      this.rippleSpeed,
      this.fontFormat,
      this.text,
      this.isRandomTextMode
    );
  }
}

class DotKineticText {
  static RADIUS = 10;

  #canvas;
  #ctx;
  #dotRadius;
  #pixelSize;
  #rippleSpeed;
  #pixelRatio;
  #stageWidth;
  #stageHeight;
  #dots = [];
  #pluckCount = 0;
  #maxPluckCount;
  #clickedPos = { x: 0, y: 0 };
  #fontFormat;
  #text;
  #toBeDrawText;
  #textField;
  #isKineticActivated = false;
  #mouse = {
    x: 0,
    y: 0,
    radius: 30,
  };
  #isRandomTextMode;

  constructor(
    dotRadius,
    rippleSpeed,
    fontFormat,
    text,
    isRandomTextMode = false
  ) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#dotRadius = dotRadius;
    this.#pixelSize = this.#dotRadius * 2;
    this.#rippleSpeed = rippleSpeed;
    this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.#fontFormat = fontFormat;
    this.#text = text;
    this.#isRandomTextMode = isRandomTextMode;

    this.textFrame = new TextFrame(
      this.#ctx,
      this.#fontFormat,
      this.#pixelSize
    );
    this.ripple = new Ripple(this.#rippleSpeed);

    window.addEventListener('resize', this.resize);
    this.#canvas.addEventListener('click', this.onClick);
    // document.addEventListener('pointermove', (event) => {
    //   this.#mouse.x = event.clientX;
    //   this.#mouse.y = event.clientY;
    // });

    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize = () => {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);

    this.addDotItemOnTextField();
    this.onClick(randomClickOnRect(this.#textField));
  };

  animate = (curTime) => {
    if (this.#isKineticActivated) {
      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.KineticAnimate(curTime);
    } else {
      this.pluckAnimate();
    }

    window.requestAnimationFrame(this.animate.bind(this));
  };

  pluckAnimate = () => {
    this.ripple.animate();

    let dot, isCollided;
    for (let i = 0; i < this.#dots.length; i++) {
      dot = this.#dots[i];
      isCollided = collide(dot.pos.x, dot.pos.y, this.#clickedPos.x, this.#clickedPos.y, this.ripple.radius); // prettier-ignore
      if (isCollided) {
        dot.pluckAnimate(this.#ctx);
      }
    }

    if (this.#pluckCount < this.#maxPluckCount) {
      this.#pluckCount++;
    } else {
      this.#isKineticActivated = true;
    }
  };

  KineticAnimate = (curTime) => {
    let dot;
    let dx, dy, dist, minDist;
    let angle, tx, ty, ax, ay;

    for (let i = 0; i < this.#dots.length; i++) {
      dot = this.#dots[i];
      dx = this.#mouse.x - dot.pos.x;
      dy = this.#mouse.y - dot.pos.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      minDist = DotKineticText.RADIUS + this.#mouse.radius;

      if (dist < minDist) {
        angle = Math.atan2(dy, dx);
        tx = dot.x + Math.cos(angle) * minDist;
        ty = dot.y + Math.sin(angle) * minDist;
        ax = tx - this.#mouse.x;
        ay = ty - this.#mouse.y;

        dot.posVelocity.vx -= ax;
        dot.posVelocity.vy -= ay;
        dot.collide();
      }

      dot.kineticAnimate(this.#ctx, curTime);
    }
  };

  onClick = (event) => {
    if (!posInRect({ x: event.offsetX, y: event.offsetY }, this.#textField)) {
      return;
    }

    for (let i = 0; i < this.#dots.length; i++) {
      this.#dots[i].init();
    }

    this.#pluckCount = 0;
    this.#clickedPos = { x: event.offsetX, y: event.offsetY };
    this.#maxPluckCount = this.ripple.init(
      this.#clickedPos.x,
      this.#clickedPos.y,
      this.#textField
    );

    this.textFrame.drawTextFrame(
      this.#toBeDrawText,
      this.#stageWidth,
      this.#stageHeight
    );

    this.#isKineticActivated = false;
  };

  addDotItemOnTextField() {
    this.#dots = [];

    if (this.#isRandomTextMode) {
      const randomText = this.#text.split('');
      this.#toBeDrawText = randomText[Math.round(Math.random() * (randomText.length - 1))]; // prettier-ignore
    } else {
      this.#toBeDrawText = this.#text;
    }

    const textData = this.textFrame.drawTextFrame(
      this.#toBeDrawText,
      this.#stageWidth,
      this.#stageHeight
    );

    const dots = textData.dots;
    this.#textField = textData.textField;

    let dot;
    for (let i = 0; i < dots.length; i++) {
      dot = dots[i];

      this.#dots.push(new Dot(dot, this.#dotRadius));
    }
  }
}
