import { PI2 } from './utils.js';

export default class Dot {
  static BOUNCE = 0.82;
  static FPS = 15;
  static FPS_TIME = 1000 / Dot.FPS;
  static FRICTION = 0.86;
  static RADIUS_OFFSET = 0.85;
  static INVALID = -1;

  #orgPos;
  #targetRadius;
  #prevTime;
  #rotateRatios;

  #backgroundRGB;
  #orgDotRGB;
  #dotRGB;
  #pos;
  #posVelocity;
  #rotateRadius;
  #radius;
  #radiusVelocity;
  #toBeIncreased;
  #toBeChangedColorCount;

  constructor(orgPos, targetRadius, dotColor, bgColor) {
    this.#orgPos = orgPos;
    this.#targetRadius = targetRadius * Dot.RADIUS_OFFSET;
    this.#orgDotRGB = dotColor;
    this.#backgroundRGB = bgColor;
    this.#prevTime = 0;
    this.#rotateRatios = [(this.#targetRadius / Dot.FPS) * -1, this.#targetRadius / Dot.FPS]; // prettier-ignore

    this.init();
  }

  init() {
    this.#dotRGB = this.#orgDotRGB;
    this.#pos = {
      x: this.#orgPos.x,
      y: this.#orgPos.y,
    };
    this.#posVelocity = {
      vx: 0,
      vy: 0,
    };
    this.#radius = 0;
    this.#radiusVelocity = 0;
    this.#toBeIncreased = 0;
    this.#rotateRadius = this.#targetRadius + this.#rotateRatios[this.#toBeIncreased]; // prettier-ignore
    this.#toBeChangedColorCount = Dot.INVALID;
  }

  pluckAnimate(ctx) {
    ctx.save();

    ctx.fillStyle = `rgba(
      ${this.#backgroundRGB.r}, 
      ${this.#backgroundRGB.g}, 
      ${this.#backgroundRGB.b}, 
      0.8)`; // prettier-ignore

    ctx.fillRect(
      this.#orgPos.x - this.#radius,
      this.#orgPos.y - this.#radius,
      this.#radius * 2,
      this.#radius * 2
    );

    const accel = (this.#targetRadius - this.#radius) / 2;
    this.#radiusVelocity = (this.#radiusVelocity + accel) * Dot.BOUNCE;
    this.#radius += this.#radiusVelocity;

    ctx.beginPath();
    ctx.fillStyle = `rgb(
      ${this.#dotRGB.r}, 
      ${this.#dotRGB.g}, 
      ${this.#dotRGB.b})`;

    ctx.arc(
      this.#orgPos.x, this.#orgPos.y,
      this.#radius * Dot.RADIUS_OFFSET, 
      0, PI2, false); // prettier-ignore
    ctx.fill();

    ctx.restore();
  }

  kineticAnimate(ctx, curTime) {
    this.#checkFPSTime(curTime);

    this.#posVelocity.vx *= Dot.FRICTION;
    this.#posVelocity.vy *= Dot.FRICTION;

    this.#pos.x += this.#posVelocity.vx;
    this.#pos.y += this.#posVelocity.vy;

    ctx.beginPath();
    ctx.fillStyle = `rgb(
      ${this.#dotRGB.r}, 
      ${this.#dotRGB.g}, 
      ${this.#dotRGB.b})`;

    ctx.ellipse(
      this.#pos.x, this.#pos.y, 
      this.#rotateRadius, this.#radius * Dot.RADIUS_OFFSET, 
      0, 0, PI2); // prettier-ignore
    ctx.fill();
  }

  #checkFPSTime(curTime) {
    if (!this.#prevTime) {
      this.#prevTime = curTime;
    }

    if (curTime - this.#prevTime > Dot.FPS_TIME) {
      this.#prevTime = curTime;

      this.#onFPSTime();
    }
  }

  #onFPSTime() {
    if (this.#toBeChangedColorCount > 0) {
      const randomColor = Math.round(Math.random() * 0xffffff);
      this.#dotRGB = {
        r: (randomColor >> 16) & 0xff,
        g: (randomColor >> 8) & 0xff,
        b: randomColor & 0xff,
      };

      this.#toBeChangedColorCount--;
    } else if (this.#toBeChangedColorCount !== Dot.INVALID) {
      this.#dotRGB = this.#orgDotRGB;
      this.#toBeChangedColorCount = Dot.INVALID;
    }

    if (this.#rotateRadius < 1) {
      this.#toBeIncreased = 1;
    } else if (this.#rotateRadius >= this.#radius * Dot.RADIUS_OFFSET) {
      this.#toBeIncreased = 0;
    }

    this.#rotateRadius += this.#rotateRatios[this.#toBeIncreased];
  }

  collide() {
    this.#toBeChangedColorCount = Dot.FPS;
  }

  get posVelocity() {
    return this.#posVelocity;
  }

  set posVelocity(posVelocity) {
    this.#posVelocity = posVelocity;
  }

  get pos() {
    return this.#pos;
  }
}
