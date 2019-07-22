'use strict';

(function () {
  var ESC_KEY = 'Escape';

  window.adForm = document.querySelector('.ad-form');

  window.util = {
    getRandomValue: function (data) {
      var randValueIndex = Math.floor(Math.random() * data.length);
      return data[randValueIndex];
    },
    getPinLocation: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    isEscEvt: function (evt, action) {
      if (evt.key === ESC_KEY) {
        action();
      }
    },
    clearPins: function () {
      // remove existing pins
      var oldPins = document.querySelectorAll('.map__pin--ads');
      if (oldPins && oldPins.length) {
        oldPins.forEach(function (p) {
          p.parentElement.removeChild(p);
        });
      }
    },
    hideElement: function (element) {
      element.classList.add('hidden');
    },
    makeHideable: function (hideableElement) {
      document.addEventListener('keydown', function () {
        if (hideableElement.parentElement) {
          hideableElement.parentElement.removeChild(hideableElement);
        }
      });
      hideableElement.addEventListener('click', function () {
        if (hideableElement.parentElement) {
          hideableElement.parentElement.removeChild(hideableElement);
        }
      });
    }
  };
})();
