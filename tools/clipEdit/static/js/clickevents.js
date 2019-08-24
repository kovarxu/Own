function $ (selector) {
  return document.querySelector(selector);
}

$('#addArrow').onclick = function (e) {
  let arrow = new Arrow;
  arrow.setScale(2.0);
  arrow.setRotate(.5);
  arrow.draw(100, 100);
}