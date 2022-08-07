import DotKineticText from './dotKineticText.js';

export default class AppBuilder {
  #app;

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
    this.#app = new DotKineticText(
      this.dotRadius,
      this.rippleSpeed,
      this.fontFormat,
      this.text,
      this.isRandomTextMode
    );
    window.requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize);
    this.resize();

    return this.#app;
  }

  animate = (curTime) => {
    this.#app && this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };

  resize = () => {
    this.#app && this.#app.resize();
  };
}
