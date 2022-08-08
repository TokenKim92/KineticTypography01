import DotKineticText from './dotKineticText.js';

export default class AppBuilder {
  #app;

  fontFormat(fontFormat) {
    this.fontFormat = fontFormat;
    return this;
  }

  text(text) {
    this.text = text;
    return this;
  }

  build() {
    this.#app = new DotKineticText(this.fontFormat, this.text);
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
