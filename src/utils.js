export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

export function collide(x1, y1, x2, y2, radius) {
  if (distance(x1, y1, x2, y2) <= radius) {
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

export function randomClickOnRect(rect) {
  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + Math.random() * rect.height;
  return { offsetX: x, offsetY: y };
}

export function getBgColorObject() {
  const tempBgColor = window
    .getComputedStyle(document.body, null)
    .getPropertyValue('background-color')
    .substring(4, 17)
    .split(',');

  return {
    r: parseInt(tempBgColor[0]),
    g: parseInt(tempBgColor[1]),
    b: parseInt(tempBgColor[2]),
  };
}
