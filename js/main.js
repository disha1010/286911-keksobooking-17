'use strict';

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
var mapViewportOffset = adMap.getBoundingClientRect();

var mainPin = mapPins.querySelector('.map__pin--main');
var adNoties = document.querySelector('.notice');
var adForm = adNoties.querySelector('.ad-form');
var adFormFields = document.querySelectorAll('fieldset');

var mainPinAddress = adForm.querySelector('#address');
var mainPinViewportOffset = mainPin.getBoundingClientRect();

var xMax = mapViewportOffset.right - mapViewportOffset.left - PIN_WIDTH;
var xMin = 0;
var yMax = PIN_Y_MAX - PIN_HEIGHT;
var yMin = PIN_Y_MIN;

var getRandomValue = function (dataList) {
  var randValueIndex = Math.floor(Math.random() * dataList.length);

  return dataList[randValueIndex];
};

var getPinLocation = function (min, max) {
  return Math.random() * (max - min) + min;
};

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
        type: getRandomValue(OFFER_TYPES)
      },
      location: {
        x: getPinLocation(xMin, xMax),
        y: getPinLocation(yMin, yMax)
      }
    };

    newMapItems.push(newItem);
  }

  return newMapItems;
};

// нахождение значения поля адреса
var getMainPinLocation = function () {
  return mainPinViewportOffset.left + mainPinViewportOffset.width / 2 - mapViewportOffset.left;
};

// блокировка элементов формы ввода
var disableFormElements = function () {
  for (var i = 0; i < adFormFields.length; i++) {
    adFormFields[i].setAttribute('disabled', 'disabled');
  }
};

// aктивация форм и карты
var activateElements = function () {
  for (var i = 0; i < adFormFields.length; i++) {
    adFormFields[i].removeAttribute('disabled');
  }

  adMap.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  var mapItems = getMapItems(ITEMS_COUNT);
  mapPins.appendChild(createMapFragment(mapItems));
};

disableFormElements();

mainPinAddress.value = getMainPinLocation();

mainPin.addEventListener('click', function () {
  activateElements();
});

mainPin.addEventListener('mouseup', function () {
  mainPinAddress.value = getMainPinLocation();
});
