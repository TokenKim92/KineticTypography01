import AppBuilder from './dotKineticText.js';

new AppBuilder()
  .dotRadius(10)
  .rippleSpeed(20)
  .fontFormat({ width: 700, size: 800, name: 'Arial' })
  .text('Hi')
  //.setRandomTextMode(true)
  .build();
