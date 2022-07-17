import AppBuilder from './dotKineticText.js';

new AppBuilder()
  .dotRadius(10)
  .rippleSpeed(10)
  .fontFormat({ width: 700, size: 800, name: 'Arial' })
  .text('Jesus')
  //.setRandomTextMode(true)
  .build();
