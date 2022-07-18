import AppBuilder from './dotKineticText.js';

const body = getComputedStyle(document.body);

const dotRadius = body.getPropertyValue('--dot-radius');
const rippleSpeed = body.getPropertyValue('--ripple-speed');
const fontWidth = body.getPropertyValue('--font-width');
const fontSize = body.getPropertyValue('--font-size');

new AppBuilder()
  .dotRadius(dotRadius)
  .rippleSpeed(rippleSpeed)
  .fontFormat({ width: fontWidth, size: fontSize, name: 'Arial' })
  .text('Hi')
  //.setRandomTextMode(true)
  .build();
