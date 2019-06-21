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

var mapItems = [];
var adMap = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapViewportOffset = adMap.getBoundingClientRect();

var xMax = mapViewportOffset.right - mapViewportOffset.left - PIN_WIDTH;
var xMin = 0;
var yMax = PIN_Y_MAX - PIN_HEIGHT;
var yMin = PIN_Y_MIN;

var getRandomValue = function (dataList) {
  var randValueIndex = Math.floor(Math.random() * dataList.length);

  return dataList[randValueIndex];
};

var getPinLocation = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
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

adMap.classList.remove('map--faded');

mapItems = getMapItems(ITEMS_COUNT);
mapPins.appendChild(createMapFragment(mapItems));
