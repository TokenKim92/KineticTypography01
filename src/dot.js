import { getBgColorObject } from './utils.js';

export default class Dot {
  static PI2 = Math.PI * 2;
  static BOUNCE = 0.82;
  static FPS = 15;
  static FPS_TIME = 1000 / Dot.FPS;
  static FRICTION = 0.86;
  static COLOR_SPEED = 0.36;
  static RADIUS = 10;
  static RADIUS_OFFSET = 0.85;
  static BACKGROUND_COLOR = getBgColorObject();

  #orgPos;
  #targetRadius;
  #radius;
  #radiusVelocity;
  #prevTime;
  #rotateRadius;
  #toBeIncreased;
  #rgb;
  #pos;
  #posVelocity = {
    vx: 0,
    vy: 0,
  };

  constructor(orgPos, targetRadius) {
    this.#orgPos = orgPos;
    this.#targetRadius = targetRadius * Dot.RADIUS_OFFSET;
    this.#radius = 0;
    this.#radiusVelocity = 0;
    this.#prevTime = 0;
    //this.#rgb = 0x000000;
    this.#pos = orgPos;

    this.#rotateRadius = this.#targetRadius - 0.5; //TODO:: Use static variable and Multiply not add
    this.#toBeIncreased = false;
  }

  init() {
    this.#radius = 0;
    this.#radiusVelocity = 0;
    this.#rotateRadius = this.#targetRadius - 0.5;
  }

  pluckAnimate(ctx) {
    ctx.fillStyle = `rgba(
      ${Dot.BACKGROUND_COLOR.r}, 
      ${Dot.BACKGROUND_COLOR.g}, 
      ${Dot.BACKGROUND_COLOR.b}, 
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
      ${255 - Dot.BACKGROUND_COLOR.r}, 
      ${255 - Dot.BACKGROUND_COLOR.g}, 
      ${255 - Dot.BACKGROUND_COLOR.b})`; // prettier-ignore

    ctx.arc(
      this.#orgPos.x, this.#orgPos.y,
      this.#radius * Dot.RADIUS_OFFSET, 
      0, Dot.PI2, false); // prettier-ignore
    ctx.fill();
  }

  checkFPSTime(curTime) {
    if (!this.#prevTime) {
      this.#prevTime = curTime;
    }

    if (curTime - this.#prevTime > Dot.FPS_TIME) {
      this.#prevTime = curTime;

      this.onFPSTime();
    }
  }

  onFPSTime() {
    //this.#rgb -= this.#rgb * Dot.COLOR_SPEED;

    if (this.#rotateRadius < 1) {
      this.#toBeIncreased = true;
    } else if (this.#rotateRadius >= this.#radius * Dot.RADIUS_OFFSET) {
      this.#toBeIncreased = false;
    }

    const ratio = this.#toBeIncreased ? 0.5 : -0.5;
    this.#rotateRadius += ratio;
  }

  kineticAnimate(ctx, curTime) {
    this.checkFPSTime(curTime);

    // this.#posVelocity.vx *= Dot.FRICTION;
    // this.#posVelocity.vy *= Dot.FRICTION;

    // this.#pos.x += this.#posVelocity.vx;
    // this.#pos.y += this.#posVelocity.vy;

    // const r = (this.#rgb >> 16) & 0xff;
    // const g = (this.#rgb >> 8) & 0xff;
    // const b = this.#rgb & 0xff;

    ctx.beginPath();
    //ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; // prettier-ignore
    ctx.fillStyle = `rgb(
      ${255 - Dot.BACKGROUND_COLOR.r}, 
      ${255 - Dot.BACKGROUND_COLOR.g}, 
      ${255 - Dot.BACKGROUND_COLOR.b})`; // prettier-ignore

    ctx.ellipse(
      this.#pos.x, this.#pos.y, 
      this.#rotateRadius, this.#radius * Dot.RADIUS_OFFSET, 
      0, 0, Dot.PI2); // prettier-ignore

    ctx.fill();
  }

  collide() {
    this.#rgb = 0xffffff;
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

  set pos(pos) {
    this.#pos = pos;
  }
}
