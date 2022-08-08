export const PI2 = Math.PI * 2;

export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

export function collide(pos1, pos2, radius) {
  if (distance(pos1.x, pos1.y, pos2.x, pos2.y) <= radius) {
    return true;
  } else {
    return false;
  }
}

export function posInRect(pos, rect) {
  if (
    rect.left <= pos.x &&
    pos.x <= rect.left + rect.width - 1 &&
    rect.top <= pos.y &&
    pos.y <= rect.top + rect.height - 1
  ) {
    return true;
  } else {
    return false;
  }
}

export function randomClickInRect(rect) {
  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + Math.random() * rect.height;
  return { offsetX: x, offsetY: y };
}

export function colorToRGB(color) {
  const colorName = color.toLowerCase();

  if (colorName.includes('rgb')) {
    const openBracketIndex = colorName.indexOf('(');
    const closeBracketIndex = colorName.indexOf(')');

    const colorList = colorName
      .substring(openBracketIndex + 1, closeBracketIndex)
      .split(', ');

    return {
      r: colorList[0],
      g: colorList[1],
      b: colorList[2],
    };
  }
}

export function getRandomCharFromText(text) {
  const charList = text.split('');
  return charList[Math.round(Math.random() * (charList.length - 1))];
}
