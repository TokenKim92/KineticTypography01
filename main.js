import AppBuilder from './src/appBuilder.js';

const body = getComputedStyle(document.body);

const dotRadius = body.getPropertyValue('--dot-radius');
const rippleSpeed = body.getPropertyValue('--ripple-speed');
const fontWidth = body.getPropertyValue('--font-width');
const fontSize = body.getPropertyValue('--font-size');

window.onload = () => {
  new AppBuilder()
    .dotRadius(dotRadius)
    .rippleSpeed(rippleSpeed)
    .fontFormat({ width: fontWidth, size: fontSize, name: 'Arial' })
    .text('JS')
    //.setRandomTextMode(true)
    .build();
};
