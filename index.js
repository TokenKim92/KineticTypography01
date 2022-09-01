import DotKineticText from './webpack/src/dotKineticText.js';

window.onload = () => {
  new AppBuilder().fontName('Fjalla One').text('JS').build();
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
    WebFont.load({
      google: { families: ['Fjalla One'] },
      fontactive: () => {
        this.#app = new DotKineticText(this.fontName, this.text);
        window.requestAnimationFrame(this.animate);
        window.addEventListener('resize', this.resize);
        this.resize();
      },
    });
  }

  animate = (curTime) => {
    this.#app && this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };

  resize = () => {
    this.#app && this.#app.resize();
  };
}
