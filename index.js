import './lib/kt-dot.min.js';
import FontFormat from './lib/fontFormat.js';

window.onload = () => {
  new AppBuilder()
    .fontFormat(new FontFormat(800, 700, 'Arial'))
    .text('JS')
    .build();
};

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
    this.#app = new kt.Dot(this.fontFormat, this.text);
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
