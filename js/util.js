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
    }
  };
})();
