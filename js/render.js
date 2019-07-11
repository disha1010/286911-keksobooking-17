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

  var createMapElement = function (pinData, index) {
    var mapElement = pinTemplate.cloneNode(true);
    var pinImg = mapElement.querySelector('img');

    var locationX = pinData.location.x - PIN_WIDTH;
    var locationY = pinData.location.y - PIN_HEIGHT;

    mapElement.classList.add('map__pin--ads');
    mapElement.setAttribute('data-index', index);

    mapElement.style = 'left:' + locationX + 'px; top:' + locationY + 'px';
    pinImg.src = pinData.author.avatar;
    pinImg.alt = pinData.offer.type;

    return mapElement;
  };

  var getAdOffer = function (offerData) {
    var mapCard = mapCardTemplate.cloneNode(true);

    var offerAvatar = mapCard.querySelector('.popup__avatar');
    var offerTitle = mapCard.querySelector('.popup__title');
    var offerAddress = mapCard.querySelector('.popup__text--address');
    var offerPrice = mapCard.querySelector('.popup__text--price');
    var offerType = mapCard.querySelector('.popup__type');
    var offerRoomsAndGuests = mapCard.querySelector('.popup__text--capacity');
    var offerTime = mapCard.querySelector('.popup__text--time');
    var offerFeatures = mapCard.querySelector('.popup__features');
    var offerDescription = mapCard.querySelector('.popup__description');
    var offerPhotos = mapCard.querySelector('.popup__photos');
    var offerImgSrcs = offerData.offer.photos || [];

    var housingType = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    };

    offerTitle.innerHTML = offerData.offer.title;
    offerAddress.innerHTML = offerData.offer.address;
    offerPrice.innerHTML = offerData.offer.price + '₽/ночь';
    offerType.innerHTML = housingType[offerData.offer.type];
    offerRoomsAndGuests.innerHTML = offerData.offer.rooms + ' комнаты для ' + offerData.offer.rooms + ' гостей';
    offerTime.innerHTML = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    offerFeatures.innerHTML = offerData.offer.features;
    offerDescription.innerHTML = offerData.offer.description;
    offerAvatar.src = offerData.author.avatar;

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

  var onEscPress = function (evt) {
    window.util.isEscEvt(evt, closeOfferCard);
  };

  var closeOfferCard = function () {
    var offerCard = document.querySelector('.map__card');
    offerCard.classList.add('hidden');
  };

  var openPopup = function (cardTemplate, data) {
    var offerCard = cardTemplate.appendChild(getAdOffer(data));
    var offerClose = offerCard.querySelector('.popup__close');

    var offerCardNew = document.querySelector('.map__card');

    if (offerCardNew) {
      offerCardNew.parentNode.removeChild(offerCardNew);
    }

    adMap.appendChild(offerCard, mapFilterContainer);
    document.addEventListener('keydown', onEscPress);

    offerClose.addEventListener('click', function () {
      closeOfferCard();
    });
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
        mapFragment.appendChild(createMapElement(data[i], i));
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
      var pins = mapPins.querySelectorAll('.map__pin--ads');

      pins.forEach(function (pin) {
        pin.addEventListener('click', function () {
          openPopup(mapCardFragment, data[pin.dataset.index]);
        });
      });
    }
  };
})();
