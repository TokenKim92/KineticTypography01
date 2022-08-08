import AppBuilder from './src/appBuilder.js';
import FontFormat from './lib/fontFormat.js';

window.onload = () => {
  new AppBuilder()
    .fontFormat(new FontFormat(800, 700, 'Arial'))
    .text('JS')
    .build();
};
