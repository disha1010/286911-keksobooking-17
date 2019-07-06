'use strict';

(function () {
  window.adForm = document.querySelector('.ad-form');

  window.util = {
    getRandomValue: function (dataList) {
      var randValueIndex = Math.floor(Math.random() * dataList.length);
      return dataList[randValueIndex];
    },
    getPinLocation: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }
  };
})();
