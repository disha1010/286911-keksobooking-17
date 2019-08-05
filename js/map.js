'use strict';

(function () {
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;

  var adMap = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  var mainPinAddress = window.adForm.querySelector('#address');
  var mapFilter = document.querySelector('.map__filters');

  var forms = document.querySelectorAll('form');
  var resetButton = document.querySelector('.ad-form__reset');

  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var adPreview = document.querySelector('.ad-form__photo');

  var xMin = 0;

  // значение в поле Адреса
  var mainPinValue = function () {
    mainPinAddress.value =
      mainPin.offsetLeft +
      mainPin.offsetWidth / 2 +
      ', ' +
      (mainPin.offsetTop + mainPin.offsetHeight);
  };

  // блокировка элементов формы ввода
  var disableFormElements = function () {
    forms.forEach(function (formItem) {
      var formElement = formItem.children;
      [].forEach.call(formElement, function (field) {
        field.setAttribute('disabled', 'disabled');
      });
    });

    mainPinValue();
  };

  var resetMainPin = function () {
    mainPin.style.top = 375 + 'px';
    mainPin.style.left = 570 + 'px';
  };

  var activateFormElements = function () {
    forms.forEach(function (formItem) {
      var formElement = formItem.children;
      [].forEach.call(formElement, function (field) {
        field.removeAttribute('disabled');
      });
    });
    window.adForm.classList.remove('ad-form--disabled');
  };

  // aктивация форм и карты
  var isActive = false;

  var activateElements = function () {
    if (isActive) {
      return;
    }
    isActive = true;

    activateFormElements();

    adMap.classList.remove('map--faded');

    onActualizePins();
  };

  var onError = function (message) {
    window.render.error();
    var errorMessage = document.querySelector('.error__message');
    errorMessage.textContent = message;
  };

  var setMapPins = function (items) {
    window.render.pins(items);
    window.render.adCard(items);
    activateFormElements();
  };

  var actualizeTimeout = null;

  var onActualizePins = function () {
    // debounce
    if (actualizeTimeout) {
      window.clearTimeout(actualizeTimeout);
      actualizeTimeout = null;
    }
    actualizeTimeout = window.setTimeout(function () {
      disableFormElements();
      window.adsApi.getFilteredAds(setMapPins, onError);
    }, 500);
  };

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  disableFormElements();

  // перетаскивание
  var isDrag = false;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    activateElements();
    onActualizePins();

    var limits = {
      left: xMin,
      right: adMap.offsetWidth - mainPin.offsetWidth,
      bottom: PIN_Y_MAX,
      top: PIN_Y_MIN
    };

    var startCoords = new Coordinate(evt.clientX, evt.clientY + window.scrollY);

    var setMainPinCoords = function (pinMoveEvt) {
      var newMouseCoords = new Coordinate(
          pinMoveEvt.clientX,
          pinMoveEvt.clientY + window.scrollY
      );
      var shift = new Coordinate(
          startCoords.x - newMouseCoords.x,
          startCoords.y - newMouseCoords.y
      );

      startCoords = newMouseCoords;

      var newLocation = new Coordinate(
          mainPin.offsetLeft - shift.x,
          mainPin.offsetTop - shift.y
      );

      if (isDrag) {
        if (newMouseCoords.x - adMap.offsetLeft > limits.right) {
          newLocation.x = limits.right;
        } else if (newMouseCoords.x - adMap.offsetLeft < limits.left) {
          newLocation.x = limits.left;
        }
        if (newMouseCoords.y > limits.bottom) {
          newLocation.y = limits.bottom;
        } else if (newMouseCoords.y < limits.top) {
          newLocation.y = limits.top;
        }

        mainPin.style.left = newLocation.x + 'px';
        mainPin.style.top = newLocation.y + 'px';
      }

      mainPinValue();
    };

    isDrag = true;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      setMainPinCoords(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      setMainPinCoords(upEvt);
      isDrag = false;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // отправка данных
  var onSuccess = function () {
    clearForm();
    clearMap();
    window.render.success();
    isActive = false;
  };

  var clearForm = function () {
    disableFormElements();
    window.adForm.classList.add('ad-form--disabled');
    window.adForm.reset();

    // удаление картинок и аватарки в форме
    avatarPreview.src = 'img/muffin-grey.svg';
    adPreview.innerHTML = '';
  };

  var clearMap = function () {
    adMap.classList.add('map--faded');
    window.util.clearPins();

    resetMainPin();
    mainPinValue();
  };

  window.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.adForm), onSuccess, onError);
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    clearForm();
    clearMap();
    isActive = false;
  });

  window.filters = {
    type: mapFilter.querySelector('#housing-type'),
    price: mapFilter.querySelector('#housing-price'),
    rooms: mapFilter.querySelector('#housing-rooms'),
    guests: mapFilter.querySelector('#housing-guests'),
    features: Array.from(mapFilter.querySelectorAll('input[name="features"]'), function (item) {
      return item;
    })
  };
  window.filters.type.addEventListener('change', onActualizePins);
  window.filters.price.addEventListener('change', onActualizePins);
  window.filters.rooms.addEventListener('change', onActualizePins);
  window.filters.guests.addEventListener('change', onActualizePins);
  window.filters.features.forEach(function (el) {
    el.addEventListener('change', onActualizePins);
  });
})();
