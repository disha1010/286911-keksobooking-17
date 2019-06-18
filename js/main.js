'use strict';

var ITEMS_COUNT = 8;
var OFFER_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var mapItems = [];

var map = document.querySelector('.map');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

var mapViewportOffset = map.getBoundingClientRect();
var pinWidth = 50;
var pinHeight = 70;

var xMax = mapViewportOffset.right - mapViewportOffset.left - pinWidth;
var xMin = 0;

var yMax = 630 - pinHeight;
var yMin = 130;

var getRandomValue = function (dataList) {
  var randValueIndex = Math.floor(Math.random() * dataList.length);
  return dataList[randValueIndex];
};

var getPinLocation = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var createMapElement = function (element) {
  var mapElement = pinTemplate.cloneNode(true);
  mapElement.style = 'left:' + element.location.x + 'px; top:' + element.location.y + 'px';
  mapElement.querySelector('img').src = element.author.avatar;
  mapElement.querySelector('img').alt = element.offer.type;

  return mapElement;
};

var createMapFragment = function (fragment) {
  var mapFragment = document.createDocumentFragment();

  for (var i = 0; i < fragment.length; i++) {
    mapFragment.appendChild(createMapElement(fragment[i]))
  }

  return mapFragment;
};

map.classList.remove('map--faded');

for (var i = 0; i < ITEMS_COUNT; i++) {
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

  mapItems.push(newItem);
}

mapPins.appendChild(createMapFragment(mapItems));
