import './lib/kt-dot.min.js';

window.onload = () => {
  new AppBuilder().fontName('Arial').text('JS').build();
};

export default class AppBuilder {
  #app;

  fontName(fontName) {
    this.fontName = fontName;
    return this;
  }

  text(text) {
    this.text = text;
    return this;
  }

  build() {
    this.#app = new kt.Dot(this.fontName, this.text);
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
