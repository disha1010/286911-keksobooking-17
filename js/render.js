'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mainWrapper = document.querySelector('main');

  var createMapElement = function (elementData) {
    var mapElement = pinTemplate.cloneNode(true);
    var pinImg = mapElement.querySelector('img');

    var locationX = elementData.location.x - PIN_WIDTH;
    var locationY = elementData.location.y - PIN_HEIGHT;

    mapElement.style = 'left:' + locationX + 'px; top:' + locationY + 'px';
    mapElement.classList.add('map__pin--ads');
    pinImg.src = elementData.author.avatar;
    pinImg.alt = elementData.offer.type;

    return mapElement;
  };

  window.render = {
    pins: function (data) {
      // remove existing pins
      var oldPins = mapPins.querySelectorAll('.map__pin--ads');
      if (oldPins && oldPins.length) {
        oldPins.forEach(function (p) {
          p.parentElement.removeChild(p);
        });
      }
      // add new pins
      var mapFragment = document.createDocumentFragment();
      var takeNumber = data.length > 5 ? 5 : data.length;

      for (var i = 0; i < takeNumber; i++) {
        mapFragment.appendChild(createMapElement(data[i]));
      }

      mapPins.appendChild(mapFragment);
    },
    error: function () {
      var error = errorTemplate.cloneNode(true);
      var errorFragment = document.createDocumentFragment();

      errorFragment.appendChild(error);
      mainWrapper.appendChild(errorFragment);
    }
  };
})();
