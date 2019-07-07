'use strict';

(function () {
  window.adForm = document.querySelector('.ad-form');

  window.util = {
    getRandomValue: function (data) {
      var randValueIndex = Math.floor(Math.random() * data.length);
      return data[randValueIndex];
    },
    getPinLocation: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }
  };
})();
