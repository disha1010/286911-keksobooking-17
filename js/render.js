'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var adMap = document.querySelector('.map');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mainWrapper = document.querySelector('main');

  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFilterContainer = document.querySelector('.map__filters-container');

  var createMapElement = function (data) {
    var mapElement = pinTemplate.cloneNode(true);
    var pinImg = mapElement.querySelector('img');

    var locationX = data.location.x - PIN_WIDTH;
    var locationY = data.location.y - PIN_HEIGHT;

    mapElement.style = 'left:' + locationX + 'px; top:' + locationY + 'px';
    mapElement.classList.add('map__pin--ads');
    pinImg.src = data.author.avatar;
    pinImg.alt = data.offer.type;

    return mapElement;
  };

  var getAdCardInfo = function (data) {
    var mapCard = mapCardTemplate.cloneNode(true);

    var offerTitle = mapCard.querySelector('.popup__title');
    var offerAddress = mapCard.querySelector('.popup__text--address');
    var offerPrice = mapCard.querySelector('.popup__text--price');
    var offerType = mapCard.querySelector('.popup__type');
    var offerRoomsAndGuests = mapCard.querySelector('.popup__text--capacity');
    var offerTime = mapCard.querySelector('.popup__text--time');
    var offerFeatures = mapCard.querySelector('.popup__features');
    var offerDescription = mapCard.querySelector('.popup__description');
    var offerPhotos = mapCard.querySelector('.popup__photos');
    var offerImgSrcs = data.offer.photos || [];

    var housingType = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    };

    offerTitle.innerHTML = data.offer.title;
    offerAddress.innerHTML = data.offer.address;
    offerPrice.innerHTML = data.offer.price + '₽/ночь';
    offerType.innerHTML = housingType[data.offer.type];
    offerRoomsAndGuests.innerHTML = data.offer.rooms + ' комнаты для ' + data.offer.rooms + ' гостей';
    offerTime.innerHTML = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    offerFeatures.innerHTML = data.offer.features;
    offerDescription.innerHTML = data.offer.description;

    offerImgSrcs.forEach(function (src) {
      var offerImg = document.createElement('img');

      offerImg.classList.add('popup__photo');
      offerImg.width = 45;
      offerImg.height = 40;
      offerImg.alt = 'Фотография жилья';
      offerImg.src = src;

      offerPhotos.appendChild(offerImg);
    });

    return mapCard;
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
    },
    adCard: function (data) {
      var mapCardFragment = document.createDocumentFragment();
      var takeNumber = data.length > 5 ? 5 : data.length;

      for (var i = 0; i < takeNumber; i++) {
        mapCardFragment.appendChild(getAdCardInfo(data[i]));
      }

      adMap.insertBefore(mapCardFragment, mapFilterContainer);
    }
  };
})();
