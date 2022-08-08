import AppBuilder from './src/appBuilder.js';

const fontWidth = 800;
const fontSize = 700;

window.onload = () => {
  new AppBuilder()
    .fontFormat({ width: fontWidth, size: fontSize, name: 'Arial' })
    .text('JS')
    .build();
};
