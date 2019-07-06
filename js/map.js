'use strict';

(function () {
  var ITEMS_COUNT = 8;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;
  var OFFER_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var adMap = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  var mainPin = mapPins.querySelector('.map__pin--main');
  var adFormFields = document.querySelectorAll('fieldset');
  var mainPinAddress = window.adForm.querySelector('#address');

  var xMax = adMap.offsetLeft + adMap.offsetWidth - adMap.offsetLeft - PIN_WIDTH;
  var xMin = 0;
  var yMax = PIN_Y_MAX - PIN_HEIGHT;
  var yMin = PIN_Y_MIN;

  var createMapElement = function (elementData) {
    var mapElement = pinTemplate.cloneNode(true);
    var pinImg = mapElement.querySelector('img');

    mapElement.style = 'left:' + elementData.location.x + 'px; top:' + elementData.location.y + 'px';
    pinImg.src = elementData.author.avatar;
    pinImg.alt = elementData.offer.type;

    return mapElement;
  };

  var createMapFragment = function (dataList) {
    var mapFragment = document.createDocumentFragment();

    for (var i = 0; i < dataList.length; i++) {
      mapFragment.appendChild(createMapElement(dataList[i]));
    }

    return mapFragment;
  };

  var getMapItems = function (itemsCount) {
    var newMapItems = [];

    for (var i = 0; i < itemsCount; i++) {
      var imgUrl = 'img/avatars/user0' + (i + 1) + '.png';

      var newItem = {
        author: {
          avatar: imgUrl
        },
        offer: {
          type: window.util.getRandomValue(OFFER_TYPES)
        },
        location: {
          x: window.util.getPinLocation(xMin, xMax),
          y: window.util.getPinLocation(yMin, yMax)
        }
      };

      newMapItems.push(newItem);
    }

    return newMapItems;
  };

  // блокировка элементов формы ввода
  var disableFormElements = function () {
    for (var i = 0; i < adFormFields.length; i++) {
      adFormFields[i].setAttribute('disabled', 'disabled');
    }

    // значение в поле Адреса
    mainPinAddress.value = mainPin.offsetLeft + mainPin.offsetWidth / 2;
  };

  // aктивация форм и карты
  var isActive = false;

  var activateElements = function () {
    if (isActive) {
      return;
    }

    isActive = true;

    for (var i = 0; i < adFormFields.length; i++) {
      adFormFields[i].removeAttribute('disabled');
    }

    adMap.classList.remove('map--faded');
    window.adForm.classList.remove('ad-form--disabled');

    var mapItems = getMapItems(ITEMS_COUNT);
    mapPins.appendChild(createMapFragment(mapItems));
  };

  disableFormElements();

  // перетаскивание
  var isDrag = false;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    activateElements();

    var limits = {
      left: xMin,
      right: adMap.offsetWidth - mainPin.offsetWidth,
      bottom: PIN_Y_MAX,
      top: PIN_Y_MIN
    };

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var getMainPinCoords = function (pinMoveEvt) {
      var shift = {
        x: startCoords.x - pinMoveEvt.clientX,
        y: startCoords.y - pinMoveEvt.clientY
      };

      startCoords = {
        x: pinMoveEvt.clientX,
        y: pinMoveEvt.clientY
      };

      var newLocation = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      if (isDrag) {
        if (pinMoveEvt.clientX - adMap.offsetLeft > limits.right) {
          newLocation.x = limits.right;
        } else if (pinMoveEvt.clientX - adMap.offsetLeft < limits.left) {
          newLocation.x = limits.left;
        } else if (pinMoveEvt.clientY > limits.bottom) {
          newLocation.y = limits.bottom;
        } else if (pinMoveEvt.clientY < limits.top) {
          newLocation.y = limits.top;
        }

        mainPin.style.left = newLocation.x + 'px';
        mainPin.style.top = newLocation.y + 'px';
      }

      // значение в поле Адреса
      mainPinAddress.value = mainPin.offsetLeft + mainPin.offsetWidth / 2;
    };

    isDrag = true;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      getMainPinCoords(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      getMainPinCoords(upEvt);
      isDrag = false;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
