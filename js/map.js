'use strict';

(function () {
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;

  var adMap = document.querySelector('.map');

  var mainPin = document.querySelector('.map__pin--main');
  var adFormFields = document.querySelectorAll('fieldset');
  var mainPinAddress = window.adForm.querySelector('#address');

  var xMin = 0;

  var pins = [];
  var selectedHouseType = 'any';

  var mapFilter = document.querySelector('.map__filters-container');
  var housingTypeFilter = mapFilter.querySelector('#housing-type');

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
    updatePins();
  };

  var updatePins = function () {
    var sameHousingType = selectedHouseType !== 'any'
      ? pins.filter(function (data) {
        return data.offer.type === selectedHouseType;
      })
      : pins;
    window.render.pins(sameHousingType);
    window.render.adCard(sameHousingType);
  };

  var onLoad = function (data) {
    pins = data;
    updatePins();
  };

  var onError = function (message) {
    window.render.error();
    var errorMessage = document.querySelector('.error__message');
    errorMessage.textContent = message;
  };

  disableFormElements();

  housingTypeFilter.addEventListener('change', function () {
    selectedHouseType = housingTypeFilter.value;
    updatePins();
  });

  // перетаскивание
  var isDrag = false;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    activateElements();
    window.backend.load(onLoad, onError);

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
