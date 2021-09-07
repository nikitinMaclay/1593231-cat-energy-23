let mapButton = document.querySelector('.cooperation__button-img');
let mapPopup = document.querySelector('.map--modal');
let mapClosingButton = document.querySelector('.map-closing-button');

mapButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  mapPopup.classList.add("map--acive");

  if (mapPopup.classList.contains("map--acive")) {
    mapClosingButton.classList.add("map-closing-button--is");
  }
});

mapClosingButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  mapPopup.classList.remove("map--acive");
  mapClosingButton.classList.remove("map-closing-button--is");
});


